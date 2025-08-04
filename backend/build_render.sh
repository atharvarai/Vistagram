#!/usr/bin/env bash
# Build script for Render deployment

set -e  # Exit on any error

echo "🚀 Starting Vistagram backend build..."

# Upgrade pip first
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Set environment variables to avoid Rust compilation issues
export CARGO_HOME=/tmp/cargo
export RUSTUP_HOME=/tmp/rustup
export PIP_NO_CACHE_DIR=1

# Install dependencies with pre-compiled wheels only
echo "📦 Installing Python dependencies..."
pip install --only-binary=all -r requirements_simple.txt

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