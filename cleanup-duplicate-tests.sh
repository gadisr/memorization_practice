#!/bin/bash

# Comprehensive cleanup script for test consolidation
# This script removes all duplicate test files and keeps only the organized structure

echo "🧹 === COMPREHENSIVE TEST CLEANUP ==="
echo ""

# Files to KEEP (organized structure)
echo "📁 Files to KEEP:"
KEEP_FILES=(
    "src/tests/consolidated-test-runner.ts"
    "src/tests/edge-tracer.test.ts"
    "src/services/cube-scrambler-test.ts"
    "src/examples/edge-tracing-demo.ts"
    "TESTING.md"
)

for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (not found)"
    fi
done

echo ""
echo "🗑️  Files to REMOVE (duplicates and old versions):"

# Root folder duplicates
ROOT_DUPLICATES=(
    "test-basic.js"
    "test-edge-tracer-complete.js"
    "test-edge-tracer-simple.js"
    "test-edge-tracer-ts.js"
    "test-edge-tracer.js"
    "test-simple.js"
    "test-cube-scrambler.html"
    "test-firebase.html"
)

echo "  📂 Root folder duplicates:"
for file in "${ROOT_DUPLICATES[@]}"; do
    if [ -f "$file" ]; then
        echo "    🗑️  Removing: $file"
        rm "$file"
    else
        echo "    ⚪ $file (not found)"
    fi
done

# src/ folder duplicates
SRC_DUPLICATES=(
    "src/test-edge-tracer.js"
    "src/test-edge-tracer.js.map"
    "src/test-edge-tracer.ts"
    "src/test-runner.js"
    "src/test-runner.js.map"
    "src/test-runner.ts"
)

echo ""
echo "  📂 src/ folder duplicates:"
for file in "${SRC_DUPLICATES[@]}"; do
    if [ -f "$file" ]; then
        echo "    🗑️  Removing: $file"
        rm "$file"
    else
        echo "    ⚪ $file (not found)"
    fi
done

# Clean up compiled JS files in tests folder
echo ""
echo "  📂 Cleaning up compiled files in src/tests/:"
COMPILED_FILES=(
    "src/tests/edge-tracer.test.js"
    "src/tests/edge-tracer.test.js.map"
)

for file in "${COMPILED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "    🗑️  Removing: $file"
        rm "$file"
    else
        echo "    ⚪ $file (not found)"
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📋 Final test structure:"
echo "  📁 src/tests/"
echo "    ├── consolidated-test-runner.ts    # Main test runner"
echo "    └── edge-tracer.test.ts            # Edge tracer tests"
echo "  📁 src/services/"
echo "    └── cube-scrambler-test.ts         # Scrambler tests"
echo "  📁 src/examples/"
echo "    └── edge-tracing-demo.ts           # Demo code"
echo ""
echo "🚀 Recommended commands:"
echo "  npm run test          # Run all tests"
echo "  npm run test:edge     # Run edge tracer tests only"
echo "  npm run test:scrambler # Run scrambler tests only"
echo ""
echo "📖 See TESTING.md for detailed documentation"
