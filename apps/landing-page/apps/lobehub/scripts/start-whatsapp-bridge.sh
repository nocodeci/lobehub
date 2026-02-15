#!/bin/bash

# Script to start the WhatsApp Bridge for Connect AI integration
# This bridge enables WhatsApp messaging capabilities through MCP

echo "🟢 Starting WhatsApp Bridge..."
echo ""

# Navigate to the whatsapp-bridge directory
cd "$(dirname "$0")/../../whatsapp-mcp/whatsapp-bridge" || {
    echo "❌ Error: whatsapp-mcp/whatsapp-bridge directory not found"
    echo "Make sure you have cloned the whatsapp-mcp repository in the parent directory"
    exit 1
}

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Error: Go is not installed"
    echo "Please install Go from https://go.dev/doc/install"
    exit 1
fi

echo "📱 WhatsApp Bridge Configuration:"
echo "   - API Port: 8080"
echo "   - API Endpoints:"
echo "     • GET  /api/qr      - Get QR code for authentication"
echo "     • POST /api/send    - Send a message"
echo "     • POST /api/download - Download media"
echo ""
echo "🔗 Connect to LobeHub at: http://localhost:3010"
echo ""
echo "📋 Instructions:"
echo "   1. A QR code will appear in the terminal"
echo "   2. Open WhatsApp on your phone"
echo "   3. Go to Settings → Linked Devices"
echo "   4. Tap 'Link a Device' and scan the QR code"
echo ""
echo "Starting Go server..."
echo "----------------------------------------"

# Run the WhatsApp bridge
go run main.go
