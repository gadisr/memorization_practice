#!/bin/bash

# Cleanup script for test consolidation
# This script removes duplicate test files and keeps only the consolidated version

echo "🧹 Cleaning up duplicate test files..."

# Files to keep (don't delete these)
KEEP_FILES=(
    "src/tests/consolidated-test-runner.ts"
    "src/tests/edge-tracer.test.ts"
    "src/services/cube-scrambler-test.ts"
    "src/examples/edge-tracing-demo.ts"
)

# Files to remove (duplicates or old versions)
REMOVE_FILES=(
    "src/test-edge-tracer.ts"
    "src/test-edge-tracer.js"
    "src/test-runner.ts"
    "src/test-runner.js"
    "test-edge-tracer.js"
    "test-edge-tracer-simple.js"
    "test-edge-tracer-ts.js"
    "test-edge-tracer-complete.js"
    "test-basic.js"
    "test-simple.js"
    "simple-test.js"
)

echo "📁 Files to keep:"
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (not found)"
    fi
done

echo ""
echo "🗑️  Files to remove:"
for file in "${REMOVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  🗑️  $file"
        rm "$file"
    else
        echo "  ⚪ $file (not found)"
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📋 Recommended test commands:"
echo "  npm run test          # Run all tests"
echo "  npm run test:edge     # Run edge tracer tests only"
echo "  npm run test:scrambler # Run scrambler tests only"
echo ""
echo "📖 See TESTING.md for detailed documentation"
