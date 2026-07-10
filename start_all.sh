#!/bin/bash

# Aanya Portfolio - Complete Startup Script
# Starts both backend and frontend automatically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Aanya Portfolio - Complete Stack Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/aanya-backend"
FRONTEND_DIR="$SCRIPT_DIR/aanya-portfolio"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

trap cleanup INT TERM

# ─── Backend Setup ─────────────────────────────────────────────

echo -e "${BLUE}📦 [1/4] Checking Backend...${NC}"

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}⚙️  Creating Python virtual environment...${NC}"
    python3 -m venv .venv
fi

# Activate virtual environment
echo -e "${GREEN}✓ Activating virtual environment${NC}"
source .venv/bin/activate

# Check if dependencies are installed
if ! python -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}📥 Installing Python dependencies...${NC}"
    pip install -q -r requirements.txt
fi

# Check if database exists
if [ ! -f "portfolio.db" ]; then
    echo -e "${YELLOW}⚠️  Database not found!${NC}"
    echo -e "${YELLOW}Please run: python setup_admin.py${NC}"
    echo ""
    read -p "Would you like to create an admin user now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python setup_admin.py
    else
        echo -e "${RED}❌ Cannot start without database. Exiting.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Backend ready${NC}"

# ─── Frontend Setup ────────────────────────────────────────────

echo ""
echo -e "${BLUE}📦 [2/4] Checking Frontend...${NC}"

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend directory not found: $FRONTEND_DIR${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing Node dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Creating .env file...${NC}"
    echo "VITE_API_URL=http://localhost:3000/api" > .env
fi

echo -e "${GREEN}✓ Frontend ready${NC}"

# ─── Start Backend ─────────────────────────────────────────────

echo ""
echo -e "${BLUE}🚀 [3/4] Starting Backend (Flask)...${NC}"

cd "$BACKEND_DIR"
source .venv/bin/activate

# Start backend in background
python app.py > /tmp/aanya-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check logs: tail -f /tmp/aanya-backend.log${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✓ Backend running at http://localhost:3000${NC}"

# ─── Start Frontend ────────────────────────────────────────────

echo ""
echo -e "${BLUE}🚀 [4/4] Starting Frontend (Vite)...${NC}"

cd "$FRONTEND_DIR"

# Start frontend in background
npm run dev > /tmp/aanya-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}⏳ Waiting for frontend to start...${NC}"
sleep 5

echo -e "${GREEN}✓ Frontend running at http://localhost:5173${NC}"

# ─── Success ───────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}✅ All services started successfully!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📱 Frontend:${NC}  http://localhost:5173"
echo -e "${BLUE}🔌 Backend:${NC}   http://localhost:3000"
echo -e "${BLUE}💾 API:${NC}       http://localhost:3000/api/health"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo "   Backend:  tail -f /tmp/aanya-backend.log"
echo "   Frontend: tail -f /tmp/aanya-frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running and show logs
tail -f /tmp/aanya-frontend.log
