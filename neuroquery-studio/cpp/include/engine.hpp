#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <variant>
#include <optional>
#include <memory>
#include <chrono>
#include <algorithm>
#include <sstream>
#include <iomanip>

namespace neuroquery {

enum class DataType {
    INT,
    FLOAT,
    TEXT,
    BOOL,
    NULL_TYPE
};

using Value = std::variant<std::monostate, int64_t, double, std::string, bool>;

inline std::string value_to_string(const Value& val) {
    return std::visit([](auto&& arg) -> std::string {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, std::monostate>) {
            return "NULL";
        } else if constexpr (std::is_same_v<T, int64_t>) {
            return std::to_string(arg);
        } else if constexpr (std::is_same_v<T, double>) {
            std::ostringstream ss;
            ss << std::fixed << std::setprecision(2) << arg;
            return ss.str();
        } else if constexpr (std::is_same_v<T, std::string>) {
            return arg;
        } else if constexpr (std::is_same_v<T, bool>) {
            return arg ? "true" : "false";
        }
        return "UNKNOWN";
    }, val);
}

struct ColumnDef {
    std::string name;
    DataType type;
    bool is_primary_key = false;
    bool is_foreign_key = false;
    std::string fk_table = "";
    std::string fk_column = "";
};

class Table {
public:
    std::string name;
    std::vector<ColumnDef> schema;
    std::vector<std::vector<Value>> rows;
    std::unordered_map<int64_t, size_t> pk_index;

    Table() = default;
    Table(std::string table_name, std::vector<ColumnDef> cols)
        : name(std::move(table_name)), schema(std::move(cols)) {}

    int get_column_idx(const std::string& col_name) const {
        for (size_t i = 0; i < schema.size(); ++i) {
            if (schema[i].name == col_name) return static_cast<int>(i);
        }
        return -1;
    }

    void insert_row(std::vector<Value> row) {
        if (row.size() != schema.size()) {
            throw std::runtime_error("Row column count mismatch");
        }
        size_t row_idx = rows.size();
        for (size_t i = 0; i < schema.size(); ++i) {
            if (schema[i].is_primary_key) {
                if (std::holds_alternative<int64_t>(row[i])) {
                    pk_index[std::get<int64_t>(row[i])] = row_idx;
                }
            }
        }
        rows.push_back(std::move(row));
    }
};

struct QueryResult {
    std::vector<std::string> column_names;
    std::vector<std::vector<Value>> rows;
    double execution_time_us = 0.0;
    std::string query_plan = "";
    size_t rows_scanned = 0;
};

struct FilterCondition {
    std::string column;
    std::string op; // "=", "!=", ">", "<", ">=", "<="
    Value target_value;

    bool evaluate(const Value& val) const {
        if (std::holds_alternative<std::monostate>(val) || std::holds_alternative<std::monostate>(target_value)) {
            return false;
        }
        if (std::holds_alternative<int64_t>(val) && std::holds_alternative<int64_t>(target_value)) {
            auto v1 = std::get<int64_t>(val);
            auto v2 = std::get<int64_t>(target_value);
            if (op == "=") return v1 == v2;
            if (op == "!=") return v1 != v2;
            if (op == ">") return v1 > v2;
            if (op == "<") return v1 < v2;
            if (op == ">=") return v1 >= v2;
            if (op == "<=") return v1 <= v2;
        }
        if (std::holds_alternative<double>(val) && (std::holds_alternative<double>(target_value) || std::holds_alternative<int64_t>(target_value))) {
            double v1 = std::get<double>(val);
            double v2 = std::holds_alternative<double>(target_value) ? std::get<double>(target_value) : static_cast<double>(std::get<int64_t>(target_value));
            if (op == "=") return v1 == v2;
            if (op == "!=") return v1 != v2;
            if (op == ">") return v1 > v2;
            if (op == "<") return v1 < v2;
            if (op == ">=") return v1 >= v2;
            if (op == "<=") return v1 <= v2;
        }
        if (std::holds_alternative<std::string>(val) && std::holds_alternative<std::string>(target_value)) {
            const auto& s1 = std::get<std::string>(val);
            const auto& s2 = std::get<std::string>(target_value);
            if (op == "=") return s1 == s2;
            if (op == "!=") return s1 != s2;
        }
        return false;
    }
};

struct ParsedQuery {
    std::vector<std::string> select_columns;
    std::string from_table;
    std::optional<std::string> join_table;
    std::optional<std::pair<std::string, std::string>> join_on;
    std::vector<FilterCondition> filters;
    std::optional<std::string> order_by_column;
    bool order_asc = true;
    std::optional<size_t> limit;
    bool is_aggregate = false;
    std::string agg_func = "";
    std::string agg_col = "";
    std::string group_by_col = "";
};

class DatabaseEngine {
public:
    std::unordered_map<std::string, Table> tables;

    DatabaseEngine() = default;

    void add_table(Table tbl) {
        tables[tbl.name] = std::move(tbl);
    }

    QueryResult execute_parsed(const ParsedQuery& query);
    QueryResult execute_sql(const std::string& sql);

    void seed_saas_benchmark_data(size_t org_count, size_t subscription_count);
};

} // namespace neuroquery
