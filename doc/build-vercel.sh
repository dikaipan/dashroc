#!/bin/bash
set -e

echo "📦 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps --force

echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
