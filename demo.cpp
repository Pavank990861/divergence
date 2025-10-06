#include "PriceDivergenceMonitor.h"

#include <string>
#include <iostream>

// Provide a local definition so the demo links; the harness supplies its own.
void PriceDivergenceMonitor::ReportDivergence(const std::string& updatedStockName, int updatedStockPrice, const std::string& otherStockName, int otherStockPrice) {
    std::cout << "demo: " << updatedStockName << " " << updatedStockPrice
              << " vs " << otherStockName << " " << otherStockPrice << "\n";
}

int main() {
    PriceDivergenceMonitor mon(2);
    mon.RegisterPair("ABC", "DEF");
    mon.UpdatePrice("ABC", 100);
    mon.UpdatePrice("DEF", 101);
    mon.UpdatePrice("ABC", 104);

    mon.RegisterPair("GOOG", "GOOGL");
    mon.UpdatePrice("GOOG", 100);
    mon.UpdatePrice("GOOGL", 101);
    mon.UpdatePrice("GOOG", 102);

    return 0;
}


