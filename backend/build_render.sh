#!/usr/bin/env bash
# Build script for Render deployment

set -e  # Exit on any error

echo "🚀 Starting Vistagram backend build..."

# Upgrade pip first
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Verify key packages are installed
echo "🔍 Verifying installations..."
python -c "import fastapi, uvicorn, sqlalchemy, redis, pydantic; print('✅ All key packages installed')"

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Initialize database
echo "🗄️ Initializing database..."
python seed_data.py

echo "✅ Build completed successfully!" 