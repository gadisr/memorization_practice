# Testing Guide for Memorization Practice

This document explains how to run and understand the test suite for the memorization practice project.

## 🧪 Test Structure

The project has been consolidated into a comprehensive test system with the following components:

### Main Test Files
- **`src/tests/consolidated-test-runner.ts`** - Main consolidated test runner (RECOMMENDED)
- `src/tests/edge-tracer.test.ts` - Edge tracer specific tests
- `src/services/cube-scrambler-test.ts` - Cube scrambler specific tests

### Test Categories

1. **Edge Tracer Tests** (14 tests)
   - Data loading and validation
   - Solved cube handling
   - Cycle detection (2-cycles, 3-cycles, multiple cycles)
   - Helper function validation
   - Performance testing
   - Edge extraction from scrambled cubes

2. **Cube Scrambler Tests** (6 tests)
   - Scramble generation
   - Cube scrambling
   - Move explanations
   - Individual move testing
   - Rotation variants
   - Specific move testing

3. **Integration Tests** (2 tests)
   - Full workflow testing (scramble → trace)
   - Performance with larger scrambles

## 🚀 How to Run Tests

### Option 1: Run All Tests (Recommended)
```bash
npm run test
```
This runs the consolidated test runner with all tests.

### Option 2: Run Specific Test Suites
```bash
# Edge tracer tests only
npm run test:edge

# Cube scrambler tests only  
npm run test:scrambler
```

### Option 3: Watch Mode (Development)
```bash
# Run tests in watch mode (rebuilds and retests on file changes)
npm run test:watch
```

### Option 4: Manual Execution
```bash
# Build first
npm run build

# Then run specific test files
node dist/tests/consolidated-test-runner.js
node dist/tests/edge-tracer.test.js
node dist/services/cube-scrambler-test.js
```

## 📊 Test Output

The consolidated test runner provides detailed output:

```
🧪 === CONSOLIDATED TEST RUNNER ===

🔗 === EDGE TRACER TESTS ===
✅ should load edge notation data (5ms)
✅ solved cube should return empty tracing string (2ms)
✅ should handle simple swap (a <-> b) (3ms)
...

🎲 === CUBE SCRAMBLER TESTS ===
✅ should generate scramble sequences (8ms)
✅ should apply scramble to cube (12ms)
...

🔗 === INTEGRATION TESTS ===
✅ should handle full scramble and trace workflow (45ms)
✅ should handle larger scrambles efficiently (234ms)

📊 === TEST RESULTS ===
Total Tests: 22
Passed: 22
Failed: 0
Success Rate: 100.0%
Total Time: 456ms

🎉 All tests passed!

📈 Performance Summary:
Average test time: 20.73ms
Slowest tests:
  - should handle larger scrambles efficiently: 234ms
  - should handle full scramble and trace workflow: 45ms
  - should apply scramble to cube: 12ms
```

## 🔧 Test Configuration

### Performance Thresholds
- Individual tests should complete in < 1000ms
- Integration tests should complete in < 5000ms
- Average test time is tracked and reported

### Test Data
- Uses solved cube states for baseline testing
- Creates specific scrambled states for cycle testing
- Tests with various scramble lengths (10, 25, 50 moves)

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Make sure TypeScript compiles successfully
   npm run build
   ```

2. **Module Import Errors**
   - Ensure all dependencies are installed: `npm install`
   - Check that the build output exists in `dist/` folder

3. **Test Failures**
   - Check the specific error messages in the output
   - Verify that the edge notation data is loaded correctly
   - Ensure cube scrambling functions are working

### Debug Mode
To run tests with more verbose output, you can modify the test runner or add console.log statements to specific tests.

## 📁 File Organization

```
src/
├── tests/
│   ├── consolidated-test-runner.ts    # Main test runner
│   ├── edge-tracer.test.ts            # Edge tracer tests
│   └── edge-tracer.test.js            # Compiled edge tracer tests
├── services/
│   ├── edge-tracer.ts                 # Edge tracer implementation
│   ├── cube-scrambler.ts              # Cube scrambler implementation
│   └── cube-scrambler-test.ts        # Cube scrambler tests
└── examples/
    └── edge-tracing-demo.ts           # Demo/example code
```

## 🎯 Test Coverage

The test suite covers:

- ✅ **Data Loading**: Edge notation, cube positions, correlate mapping
- ✅ **Core Algorithms**: Edge tracing, cycle detection, position checking
- ✅ **Helper Functions**: Color extraction, secondary letter finding
- ✅ **Integration**: Full workflow from scramble to trace
- ✅ **Performance**: Timing and efficiency validation
- ✅ **Edge Cases**: Flipped edges, multiple cycles, empty results

## 🔄 Continuous Integration

For CI/CD pipelines, use:
```bash
npm run test
```

The test runner returns appropriate exit codes:
- Exit code 0: All tests passed
- Exit code 1: Some tests failed

## 📝 Adding New Tests

To add new tests to the consolidated runner:

1. Add your test to the appropriate section in `consolidated-test-runner.ts`
2. Use the existing `this.test()` and `this.expect()` methods
3. Follow the naming convention: "should [description]"
4. Run `npm run test` to verify your new test

Example:
```typescript
this.test('should handle new edge case', () => {
  const result = someFunction();
  this.expect(result).toBe('expected value');
});
```
