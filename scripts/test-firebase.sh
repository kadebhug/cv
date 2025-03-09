#!/bin/bash

# Shell script to test Firebase functionality

echo "🔥 Starting Firebase tests..."

# Set Node.js to use ES modules
export NODE_OPTIONS=--experimental-vm-modules

# Run the test script directly
node -e "import('../src/services/firebase-test.js').then(module => module.runTests());"

# Check the exit status
if [ $? -eq 0 ]; then
  echo "✅ Tests completed successfully!"
  exit 0
else
  echo "❌ Tests failed!"
  exit 1
fi 