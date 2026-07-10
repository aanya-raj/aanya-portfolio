#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Testing Aanya Portfolio Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check Backend
echo ""
echo "1. Checking Backend..."
cd aanya-backend

if [ ! -d ".venv" ]; then
    echo "   ❌ Virtual environment not found"
    exit 1
fi

if [ ! -f "portfolio.db" ]; then
    echo "   ❌ Database not found (run: python setup_admin.py)"
    exit 1
fi

echo "   ✓ Backend files OK"

# 2. Check Frontend
echo ""
echo "2. Checking Frontend..."
cd ../aanya-portfolio

if [ ! -d "node_modules" ]; then
    echo "   ⚠️  Node modules not found (run: npm install)"
else
    echo "   ✓ Node modules OK"
fi

if [ ! -f ".env" ]; then
    echo "   ❌ .env file not found"
    exit 1
fi

# Check .env content
if grep -q "localhost:3000" .env; then
    echo "   ✓ API URL configured correctly"
else
    echo "   ❌ API URL not pointing to localhost:3000"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ All checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To start the project:"
echo "  ./start_all.sh"
echo ""
echo "OR manually in 2 terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd aanya-backend"
echo "  source .venv/bin/activate"
echo "  python app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd aanya-portfolio"
echo "  npm run dev"
echo ""
