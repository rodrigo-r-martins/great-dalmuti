#!/bin/bash
# Script to prepare server directory for deployment
# Copies shared directory into server/ so it's available in Docker build context
# Also creates symlink for local development compatibility

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Preparing deployment..."
echo "Copying shared directory into server/..."

# Remove existing shared directory or symlink if it exists
if [ -L "$SCRIPT_DIR/shared" ] || [ -d "$SCRIPT_DIR/shared" ]; then
    rm -rf "$SCRIPT_DIR/shared"
fi

# Copy shared directory into server/ for Docker build
cp -r "$PROJECT_ROOT/shared" "$SCRIPT_DIR/shared"

echo "✓ Shared directory copied successfully"
echo "You can now run: fly deploy"
