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

# Install dependencies with pre-compiled wheels
echo "📦 Installing Python dependencies..."
pip install --no-cache-dir --prefer-binary -r requirements_simple.txt

# Skip verification to avoid import issues during build
echo "🔍 Skipping package verification during build..."

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Initialize database
echo "🗄️ Initializing database..."
python seed_data.py

echo "✅ Build completed successfully!" 