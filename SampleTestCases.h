// This header contains the exposed sample test cases used by the harness.
#ifndef EXPOSED_TEST_CASES_H
#define EXPOSED_TEST_CASES_H

#include "catch.hpp"
#include "TestCases.h"

TEST_CASE( "Single Violation", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "2 ABC 104 DEF 101\n";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"ABC", "DEF"},

    updatePriceInput_t{"ABC", 100},
    updatePriceInput_t{"DEF", 101},
    
    updatePriceInput_t{"ABC", 104}
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "No Violations", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    
    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"GOOGL", 101},
    
    updatePriceInput_t{"GOOG", 102},
    updatePriceInput_t{"GOOGL", 103},
    
    updatePriceInput_t{"GOOG", 102},
    updatePriceInput_t{"GOOGL", 101}
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "Unknown Product", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "3 GOOG 103 GOOGL 100\n";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    
    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"GOOGL", 100},
    
    updatePriceInput_t{"IBM", 200},
    updatePriceInput_t{"GOOG", 103},
    
    updatePriceInput_t{"APPL", 300},
    updatePriceInput_t{"GOOG", 102}
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "Multiple Violations", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "2 GOOG 104 GOOGL 101\n"
  "3 GOOGL 107 GOOG 104\n";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    
    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"GOOGL", 101},
    
    updatePriceInput_t{"GOOG", 104},
    updatePriceInput_t{"GOOGL", 107},
    
    updatePriceInput_t{"GOOG", 108},
    updatePriceInput_t{"GOOGL", 109}
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "Multiple Pairs No Violations", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    registerPairInput_t{"CMCSA", "CMCST"},

    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"GOOGL", 101},

    updatePriceInput_t{"CMCSA", 200},
    updatePriceInput_t{"CMCST", 201},

    updatePriceInput_t{"GOOG", 101},
    updatePriceInput_t{"GOOGL", 100},

    updatePriceInput_t{"CMCSA", 201},
    updatePriceInput_t{"CMCST", 200},
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "Three Pairs Two Violate", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "6 CMCSA 198 CMCST 201\n"
  "9 GOOG 104 GOOGL 101\n";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    registerPairInput_t{"CMCSA", "CMCST"},
    registerPairInput_t{"AAA", "BBB"},

    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"GOOGL", 101},

    updatePriceInput_t{"CMCSA", 200},
    updatePriceInput_t{"CMCST", 201},

    updatePriceInput_t{"AAA", 300},
    updatePriceInput_t{"BBB", 301},

    updatePriceInput_t{"CMCSA", 198},
    updatePriceInput_t{"CMCST", 199},    
    
    updatePriceInput_t{"AAA", 301},
    updatePriceInput_t{"GOOG", 104},

    updatePriceInput_t{"BBB", 300},
    updatePriceInput_t{"GOOGL", 105},
  };

  runTestCase(threshold, actions, {expectedOutput});
}

TEST_CASE( "One Product Correlates With Two Others", "[DivergenceMonitor]" ) {
  constexpr int threshold = 2;
  const std::string expectedOutput = 
  "1 IBM 105 GOOG 100\n"
  "2 GOOGL 107 GOOG 100\n"
  "3 GOOG 104 GOOGL 107\n"
  "4 GOOG 108 IBM 105\n";

  std::vector<pdmInput_t> actions {
    registerPairInput_t{"GOOG", "GOOGL"},
    registerPairInput_t{"GOOG", "IBM"},

    updatePriceInput_t{"GOOG", 100},
    updatePriceInput_t{"IBM", 105},

    updatePriceInput_t{"GOOGL", 107},
    updatePriceInput_t{"GOOG", 104},

    updatePriceInput_t{"GOOG", 108},
  };

  runTestCase(threshold, actions, {expectedOutput});
}

#endif // EXPOSED_TEST_CASES_H
