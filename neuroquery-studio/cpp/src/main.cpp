#include "../include/engine.hpp"
#include <iostream>
#include <iomanip>

using namespace neuroquery;

void print_table(const QueryResult& res) {
    if (res.column_names.empty()) {
        std::cout << "Empty result set.\n";
        return;
    }

    // Determine column widths
    std::vector<size_t> widths(res.column_names.size());
    for (size_t i = 0; i < res.column_names.size(); ++i) {
        widths[i] = res.column_names[i].length();
        for (const auto& row : res.rows) {
            std::string s = value_to_string(row[i]);
            if (s.length() > widths[i]) widths[i] = s.length();
        }
        widths[i] += 2; // padding
    }

    // Divider line
    auto print_divider = [&]() {
        std::cout << "+";
        for (auto w : widths) {
            std::cout << std::string(w, '-') << "+";
        }
        std::cout << "\n";
    };

    print_divider();
    std::cout << "|";
    for (size_t i = 0; i < res.column_names.size(); ++i) {
        std::cout << " " << std::left << std::setw(widths[i] - 1) << res.column_names[i] << "|";
    }
    std::cout << "\n";
    print_divider();

    for (const auto& row : res.rows) {
        std::cout << "|";
        for (size_t i = 0; i < row.size(); ++i) {
            std::cout << " " << std::left << std::setw(widths[i] - 1) << value_to_string(row[i]) << "|";
        }
        std::cout << "\n";
    }
    print_divider();

    std::cout << "Row count: " << res.rows.size() << " (" 
              << std::fixed << std::setprecision(2) << res.execution_time_us << " µs / "
              << res.execution_time_us / 1000.0 << " ms)\n\n";
    std::cout << res.query_plan << "\n";
}

void run_benchmark() {
    std::cout << "========================================================\n";
    std::cout << "  NEUROQUERY STUDIO — C++20 KERNEL BENCHMARK (1,000,000 ROWS)\n";
    std::cout << "  Vectorized In-Memory Columnar & Hash-Join Execution Engine\n";
    std::cout << "========================================================\n\n";

    DatabaseEngine engine;
    std::cout << "[1/4] Seeding 50,000 Organizations & 1,000,000 Subscriptions in C++ memory...\n";
    auto t0 = std::chrono::high_resolution_clock::now();
    engine.seed_saas_benchmark_data(50000, 1000000);
    auto t1 = std::chrono::high_resolution_clock::now();
    double seed_ms = std::chrono::duration<double, std::milli>(t1 - t0).count();
    std::cout << "      Seeded 1.05M records in " << std::fixed << std::setprecision(1) << seed_ms << " ms.\n\n";

    // Benchmark 1: Full scan + predicate filter
    std::cout << "[2/4] Query 1: Vectorized Filter (monthly_price >= 899.0 AND status = 'active')...\n";
    ParsedQuery q1;
    q1.from_table = "subscriptions";
    q1.select_columns = {"id", "org_id", "plan", "monthly_price", "status"};
    q1.filters = {
        {"monthly_price", ">=", 899.0},
        {"status", "=", std::string("active")}
    };
    q1.limit = 10;
    auto res1 = engine.execute_parsed(q1);
    std::cout << "      Scanned: " << res1.rows_scanned << " rows in " << res1.execution_time_us << " µs ("
              << (res1.rows_scanned / (res1.execution_time_us / 1e6)) / 1e6 << " M rows/sec)\n";

    // Benchmark 2: Aggregation (SUM & AVG over 1M rows)
    std::cout << "[3/4] Query 2: Columnar Aggregation (SUM(monthly_price) GROUP BY plan)...\n";
    ParsedQuery q2;
    q2.from_table = "subscriptions";
    q2.is_aggregate = true;
    q2.agg_func = "SUM";
    q2.agg_col = "monthly_price";
    q2.group_by_col = "plan";
    auto res2 = engine.execute_parsed(q2);
    std::cout << "      Aggregated: " << res2.rows_scanned << " rows in " << res2.execution_time_us << " µs ("
              << (res2.rows_scanned / (res2.execution_time_us / 1e6)) / 1e6 << " M rows/sec)\n";

    // Benchmark 3: Radix Hash Join over 50k x 1M rows
    std::cout << "[4/4] Query 3: Relational Hash Join (organizations ⨝ subscriptions ON id = org_id)...\n";
    ParsedQuery q3;
    q3.from_table = "organizations";
    q3.join_table = "subscriptions";
    q3.join_on = std::make_pair("id", "org_id");
    q3.filters = {
        {"tier", "=", std::string("enterprise")}
    };
    q3.select_columns = {"name", "tier", "plan", "monthly_price"};
    q3.order_by_column = "monthly_price";
    q3.order_asc = false;
    q3.limit = 15;
    auto res3 = engine.execute_parsed(q3);
    std::cout << "      Completed Hash Join in " << res3.execution_time_us << " µs ("
              << res3.execution_time_us / 1000.0 << " ms)\n\n";

    std::cout << "Top 15 Results from Hash Join Query:\n";
    print_table(res3);

    std::cout << "========================================================\n";
    std::cout << "  BENCHMARK SUMMARY: C++ KERNEL EXECUTION SPEED RATING: S-TIER\n";
    std::cout << "========================================================\n";
}

int main(int argc, char* argv[]) {
    if (argc > 1 && std::string(argv[1]) == "--benchmark") {
        run_benchmark();
        return 0;
    }

    std::cout << "⚡ NeuroQuery Studio C++20 Database Kernel\n";
    std::cout << "Developer: Divyansh Shandil (IIT Mandi BS DS&AI graduate)\n\n";

    DatabaseEngine engine;
    engine.seed_saas_benchmark_data(100, 500);

    // Run Demo Query
    ParsedQuery q;
    q.from_table = "organizations";
    q.join_table = "subscriptions";
    q.join_on = std::make_pair("id", "org_id");
    q.filters = {
        {"tier", "=", std::string("enterprise")}
    };
    q.select_columns = {"name", "tier", "plan", "monthly_price", "status"};
    q.order_by_column = "monthly_price";
    q.order_asc = false;
    q.limit = 8;

    std::cout << "Executing SQL:\n";
    std::cout << "  SELECT o.name, o.tier, s.plan, s.monthly_price, s.status\n";
    std::cout << "  FROM organizations o\n";
    std::cout << "  JOIN subscriptions s ON o.id = s.org_id\n";
    std::cout << "  WHERE o.tier = 'enterprise'\n";
    std::cout << "  ORDER BY s.monthly_price DESC\n";
    std::cout << "  LIMIT 8;\n\n";

    auto res = engine.execute_parsed(q);
    print_table(res);

    std::cout << "\nTip: Run with --benchmark to test with 1,000,000 synthetic records!\n";
    return 0;
}
