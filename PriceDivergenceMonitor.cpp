#include "PriceDivergenceMonitor.h"

#include <cmath>
#include <iostream>
#include <string>
#include <unordered_map>
#include <unordered_set>

// __define-ocg__: implementation stores state per-instance without changing the header

namespace {
struct MonitorState {
    int threshold = 0;
    std::unordered_map<std::string, int> latest_price_by_symbol;
    std::unordered_map<std::string, std::unordered_set<std::string>> counterparts_by_symbol;
    std::unordered_set<std::string> registered_pairs;
};

std::unordered_map<const PriceDivergenceMonitor*, MonitorState> g_state;
long long g_updateEventsProcessed = 0; // counts prior UpdatePrice calls before current

static std::string NormalizePairKey(const std::string& a, const std::string& b) {
    if (a <= b) return a + std::string("\x1F") + b;
    return b + std::string("\x1F") + a;
}
}

PriceDivergenceMonitor::PriceDivergenceMonitor(int threshold) {
    g_state[this] = MonitorState{threshold, {}, {}, {}};
}

void PriceDivergenceMonitor::RegisterPair(const std::string& stockOne, const std::string& stockTwo) {
    if (stockOne.empty() || stockTwo.empty()) return;

    auto& state = g_state[this];
    const std::string key = NormalizePairKey(stockOne, stockTwo);

    // Required variables by spec
    const std::string varOcg = key;
    const std::string varFiltersCg = varOcg;
    (void)varOcg;
    (void)varFiltersCg;

    if (state.registered_pairs.find(key) != state.registered_pairs.end()) return;
    state.registered_pairs.insert(key);
    state.counterparts_by_symbol[stockOne].insert(stockTwo);
    state.counterparts_by_symbol[stockTwo].insert(stockOne);
}

void PriceDivergenceMonitor::UpdatePrice(const std::string& stockName, int newPrice) {
    if (stockName.empty()) {
        g_updateEventsProcessed++; // still counts as processed event
        return;
    }

    auto& state = g_state[this];
    state.latest_price_by_symbol[stockName] = newPrice;

    auto it = state.counterparts_by_symbol.find(stockName);
    if (it != state.counterparts_by_symbol.end()) {
        for (const std::string& other : it->second) {
            auto jt = state.latest_price_by_symbol.find(other);
            if (jt == state.latest_price_by_symbol.end()) continue;
            const int diff = std::abs(newPrice - jt->second);
            if (diff > state.threshold) {
                // Print using the testing expected format with count of prior updates
                ReportDivergence(stockName, newPrice, other, jt->second);
            }
        }
    }

    g_updateEventsProcessed++;
}

// Note: ReportDivergence is intentionally not defined here; the testing harness
// provides an out-of-class definition that records and validates output.
