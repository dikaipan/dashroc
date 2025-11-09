#!/bin/bash

# ROC Dashboard Netlify Deployment Script

echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install function dependencies
echo "📦 Installing function dependencies..."
pip install -r netlify/functions/requirements.txt

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=frontend/dist --functions=netlify/functions

echo "✅ Deployment complete!"
