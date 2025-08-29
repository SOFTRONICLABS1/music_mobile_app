#!/bin/bash

echo "🚀 Starting iOS with automatic error handling..."

# Kill any existing metro processes
pkill -f "node.*metro" 2>/dev/null || true

# Kill any process using port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Reset watchman if it exists
if command -v watchman &> /dev/null; then
    echo "📱 Resetting Watchman..."
    watchman shutdown-server 2>/dev/null || true
fi

# Create watchman config if it doesn't exist
if [ ! -f ".watchmanconfig" ]; then
    echo "⚙️ Creating Watchman config..."
    echo '{}' > .watchmanconfig
fi

# Start metro server with error handling
echo "🔄 Starting Metro bundler..."
REACT_NATIVE_PACKAGER_CACHE=false npx react-native start --reset-cache &
METRO_PID=$!

# Wait for metro to start
sleep 10

# Check if metro is running
if ! curl -s "http://localhost:8081/status" > /dev/null; then
    echo "⚠️ Metro server failed to start, retrying..."
    kill $METRO_PID 2>/dev/null || true
    sleep 2
    npx react-native start --reset-cache &
    METRO_PID=$!
    sleep 5
fi

echo "📱 Building and running iOS app..."
npx react-native run-ios

echo "✅ iOS app launched successfully!"