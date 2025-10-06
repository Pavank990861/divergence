// __define-ocg__: header for price divergence monitor

#ifndef PRICE_DIVERGENCE_MONITOR_H
#define PRICE_DIVERGENCE_MONITOR_H

#include <string>

class PriceDivergenceMonitor {
public:
    // Constructor
    PriceDivergenceMonitor(int threshold);

    // Register a pair of stocks to monitor
    void RegisterPair(const std::string& stockOne, const std::string& stockTwo);

    // Update the price of a stock
    void UpdatePrice(const std::string& stockName, int newPrice);

private:
    // Helper function to report divergence (Note: The testing suite WILL check that this is used)
    void ReportDivergence(const std::string& updatedStockName, int updatedStockPrice, const std::string& otherStockName, int otherStockPrice);
};

#endif // PRICE_DIVERGENCE_MONITOR_H


