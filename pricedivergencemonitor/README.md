# PriceDivergenceMonitor (C++)

Minimal implementation of a price divergence monitor and a small demo.

## Requirements
- clang++ 11+ (C++20)
- macOS or Linux shell

## Project layout
- `PriceDivergenceMonitor.h/.cpp` – implementation used by tests
- `SampleTestCases.h` – sample Catch2 tests (uses harness helpers)
- `main.cpp` – Catch2 entry (requires Catch2 headers in your environment)
- `demo.cpp` – tiny runnable demo (no external deps)

Note: The code includes a comment with "__define-ocg__" and variables named `varOcg` and `varFiltersCg` as requested.

## Build and run the demo (no external deps)
```bash
clang++ -std=c++20 -O2 -Wall -Wextra -pedantic \
  "PriceDivergenceMonitor.cpp" "demo.cpp" \
  -o demo && ./demo
```

Expected output (example):
```text
demo: ABC 104 vs DEF 101
```

## Build just the library/object (for harness integration)
```bash
clang++ -std=c++20 -O2 -Wall -Wextra -pedantic -c PriceDivergenceMonitor.cpp -o PriceDivergenceMonitor.o
```
Link your own test harness against `PriceDivergenceMonitor.o` and provide your own out-of-class definition of `PriceDivergenceMonitor::ReportDivergence(...)`.

## Run with Catch2 (optional; requires Catch2 headers)
If you have Catch2 v2 single-header (`catch.hpp`) available on your include path and a compatible `TestCases.h` harness:
```bash
clang++ -std=c++20 -O2 -Wall -Wextra -pedantic \
  PriceDivergenceMonitor.cpp main.cpp \
  -I . \
  -o tests && ./tests
```
This will compile `main.cpp` (which includes `SampleTestCases.h`) and run tests.

## Clean
```bash
rm -f demo tests PriceDivergenceMonitor.o
```
