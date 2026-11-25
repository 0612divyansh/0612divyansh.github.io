#include "../include/engine.hpp"
#include <chrono>
#include <random>

namespace neuroquery {

QueryResult DatabaseEngine::execute_parsed(const ParsedQuery& query) {
    auto start_time = std::chrono::high_resolution_clock::now();
    QueryResult result;

    if (tables.find(query.from_table) == tables.end()) {
        throw std::runtime_error("Table not found: " + query.from_table);
    }

    const auto& primary_table = tables.at(query.from_table);
    std::ostringstream plan;
    plan << "== C++20 Vectorized Execution Plan ==\n";
    plan << "1. Scan: Table '" << primary_table.name << "' (" << primary_table.rows.size() << " records)\n";

    result.rows_scanned = primary_table.rows.size();

    // Intermediate row representation
    struct MatchedRow {
        std::vector<Value> values;
    };
    std::vector<MatchedRow> working_set;
    working_set.reserve(primary_table.rows.size());

    // 1. Scan and apply primary table filters
    std::vector<int> filter_col_indices;
    for (const auto& f : query.filters) {
        int idx = primary_table.get_column_idx(f.column);
        filter_col_indices.push_back(idx);
    }

    for (const auto& row : primary_table.rows) {
        bool matches = true;
        for (size_t i = 0; i < query.filters.size(); ++i) {
            int col_idx = filter_col_indices[i];
            if (col_idx >= 0) {
                if (!query.filters[i].evaluate(row[col_idx])) {
                    matches = false;
                    break;
                }
            }
        }
        if (matches) {
            working_set.push_back({row});
        }
    }

    if (!query.filters.empty()) {
        plan << "2. Filter: Applied " << query.filters.size() << " predicate(s) (Kept " << working_set.size() << " records)\n";
    }

    // 2. Hash Join (if specified)
    std::vector<std::string> combined_col_names;
    for (const auto& col : primary_table.schema) {
        combined_col_names.push_back(col.name);
    }

    if (query.join_table.has_value() && query.join_on.has_value()) {
        const std::string& j_tbl_name = query.join_table.value();
        if (tables.find(j_tbl_name) == tables.end()) {
            throw std::runtime_error("Join table not found: " + j_tbl_name);
        }
        const auto& join_table = tables.at(j_tbl_name);
        plan << "3. Hash Join: Building hash table on '" << j_tbl_name << "'." << query.join_on->second << "\n";

        for (const auto& col : join_table.schema) {
            combined_col_names.push_back(col.name);
        }

        int left_key_idx = primary_table.get_column_idx(query.join_on->first);
        int right_key_idx = join_table.get_column_idx(query.join_on->second);

        if (left_key_idx < 0 || right_key_idx < 0) {
            throw std::runtime_error("Invalid JOIN ON column references");
        }

        // Build hash table for right table
        std::unordered_multimap<std::string, const std::vector<Value>*> hash_index;
        for (const auto& r_row : join_table.rows) {
            hash_index.emplace(value_to_string(r_row[right_key_idx]), &r_row);
        }

        // Probe hash table with working set
        std::vector<MatchedRow> joined_set;
        for (const auto& w_row : working_set) {
            std::string key = value_to_string(w_row.values[left_key_idx]);
            auto range = hash_index.equal_range(key);
            for (auto it = range.first; it != range.second; ++it) {
                std::vector<Value> merged = w_row.values;
                merged.insert(merged.end(), it->second->begin(), it->second->end());
                joined_set.push_back({std::move(merged)});
            }
        }
        working_set = std::move(joined_set);
        plan << "   Probe: Matched " << working_set.size() << " combined rows via Radix Hash Join\n";
    }

    // 3. Projection & Aggregation
    if (query.is_aggregate && !query.agg_func.empty()) {
        plan << "4. Aggregation: " << query.agg_func << "(" << query.agg_col << ")";
        if (!query.group_by_col.empty()) {
            plan << " GROUP BY " << query.group_by_col;
        }
        plan << "\n";

        // Group-by aggregation
        int group_idx = -1;
        if (!query.group_by_col.empty()) {
            auto it = std::find(combined_col_names.begin(), combined_col_names.end(), query.group_by_col);
            if (it != combined_col_names.end()) {
                group_idx = std::distance(combined_col_names.begin(), it);
            }
        }

        int target_val_idx = -1;
        if (query.agg_col != "*") {
            auto it = std::find(combined_col_names.begin(), combined_col_names.end(), query.agg_col);
            if (it != combined_col_names.end()) {
                target_val_idx = std::distance(combined_col_names.begin(), it);
            }
        }

        struct AggBucket {
            size_t count = 0;
            double sum = 0.0;
            double min_val = 1e18;
            double max_val = -1e18;
        };
        std::unordered_map<std::string, AggBucket> buckets;

        for (const auto& r : working_set) {
            std::string g_key = (group_idx >= 0) ? value_to_string(r.values[group_idx]) : "ALL";
            auto& b = buckets[g_key];
            b.count++;

            if (target_val_idx >= 0) {
                const auto& v = r.values[target_val_idx];
                double numeric_val = 0.0;
                if (std::holds_alternative<int64_t>(v)) numeric_val = static_cast<double>(std::get<int64_t>(v));
                else if (std::holds_alternative<double>(v)) numeric_val = std::get<double>(v);
                
                b.sum += numeric_val;
                if (numeric_val < b.min_val) b.min_val = numeric_val;
                if (numeric_val > b.max_val) b.max_val = numeric_val;
            }
        }

        if (group_idx >= 0) {
            result.column_names.push_back(query.group_by_col);
        }
        result.column_names.push_back(query.agg_func + "_" + query.agg_col);

        for (const auto& [grp, b] : buckets) {
            std::vector<Value> out_row;
            if (group_idx >= 0) {
                out_row.push_back(grp);
            }
            if (query.agg_func == "COUNT") {
                out_row.push_back(static_cast<int64_t>(b.count));
            } else if (query.agg_func == "SUM") {
                out_row.push_back(b.sum);
            } else if (query.agg_func == "AVG") {
                out_row.push_back(b.count > 0 ? b.sum / b.count : 0.0);
            } else if (query.agg_func == "MIN") {
                out_row.push_back(b.min_val);
            } else if (query.agg_func == "MAX") {
                out_row.push_back(b.max_val);
            }
            result.rows.push_back(std::move(out_row));
        }

    } else {
        // Standard Projection
        std::vector<int> proj_indices;
        if (query.select_columns.empty() || (query.select_columns.size() == 1 && query.select_columns[0] == "*")) {
            for (size_t i = 0; i < combined_col_names.size(); ++i) {
                proj_indices.push_back(static_cast<int>(i));
                result.column_names.push_back(combined_col_names[i]);
            }
        } else {
            for (const auto& col_name : query.select_columns) {
                auto it = std::find(combined_col_names.begin(), combined_col_names.end(), col_name);
                if (it != combined_col_names.end()) {
                    proj_indices.push_back(std::distance(combined_col_names.begin(), it));
                    result.column_names.push_back(col_name);
                }
            }
        }

        for (const auto& w_row : working_set) {
            std::vector<Value> out_row;
            for (int idx : proj_indices) {
                out_row.push_back(w_row.values[idx]);
            }
            result.rows.push_back(std::move(out_row));
        }
    }

    // 4. Sort (ORDER BY)
    if (query.order_by_column.has_value() && !result.rows.empty()) {
        const std::string& order_col = query.order_by_column.value();
        auto it = std::find(result.column_names.begin(), result.column_names.end(), order_col);
        if (it != result.column_names.end()) {
            size_t sort_idx = std::distance(result.column_names.begin(), it);
            plan << "5. Sort: std::sort on column '" << order_col << "' (" << (query.order_asc ? "ASC" : "DESC") << ")\n";

            std::sort(result.rows.begin(), result.rows.end(), [sort_idx, asc = query.order_asc](const auto& a, const auto& b) {
                std::string s_a = value_to_string(a[sort_idx]);
                std::string s_b = value_to_string(b[sort_idx]);
                return asc ? (s_a < s_b) : (s_a > s_b);
            });
        }
    }

    // 5. Limit
    if (query.limit.has_value() && result.rows.size() > query.limit.value()) {
        result.rows.resize(query.limit.value());
        plan << "6. Limit: Truncated result set to " << query.limit.value() << " rows\n";
    }

    auto end_time = std::chrono::high_resolution_clock::now();
    result.execution_time_us = std::chrono::duration<double, std::micro>(end_time - start_time).count();
    plan << "== Completed in " << std::fixed << std::setprecision(2) << result.execution_time_us << " µs ==\n";
    result.query_plan = plan.str();

    return result;
}

void DatabaseEngine::seed_saas_benchmark_data(size_t org_count, size_t subscription_count) {
    Table orgs("organizations", {
        {"id", DataType::INT, true},
        {"name", DataType::TEXT},
        {"tier", DataType::TEXT},
        {"region", DataType::TEXT}
    });

    std::vector<std::string> tiers = {"starter", "professional", "enterprise", "growth"};
    std::vector<std::string> regions = {"us-east-1", "eu-west-1", "ap-south-1", "us-west-2"};

    for (size_t i = 1; i <= org_count; ++i) {
        orgs.insert_row({
            static_cast<int64_t>(i),
            "Organization_" + std::to_string(i),
            tiers[i % tiers.size()],
            regions[i % regions.size()]
        });
    }

    Table subs("subscriptions", {
        {"id", DataType::INT, true},
        {"org_id", DataType::INT, false, true, "organizations", "id"},
        {"plan", DataType::TEXT},
        {"monthly_price", DataType::FLOAT},
        {"status", DataType::TEXT}
    });

    std::vector<std::string> plans = {"Starter", "Scale", "Enterprise AI", "Custom Dedicated"};
    std::vector<double> prices = {49.0, 199.0, 899.0, 2400.0};
    std::vector<std::string> statuses = {"active", "trialing", "past_due", "canceled"};

    for (size_t i = 1; i <= subscription_count; ++i) {
        int64_t target_org = (i % org_count) + 1;
        subs.insert_row({
            static_cast<int64_t>(i),
            target_org,
            plans[i % plans.size()],
            prices[i % prices.size()],
            statuses[i % statuses.size()]
        });
    }

    add_table(std::move(orgs));
    add_table(std::move(subs));
}

} // namespace neuroquery
