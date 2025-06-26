#!/bin/bash
# 🚀 Enhanced Algorithm Dashboard Startup Script
# Comprehensive Real-Time Algorithm Execution Platform

set -e

echo "🚀 Starting Enhanced Algorithm Dashboard with Real Execution Engine"
echo "=================================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
check_docker() {
    echo -e "${BLUE}🐳 Checking Docker status...${NC}"
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Setup Python virtual environment
setup_environment() {
    echo -e "${BLUE}🐍 Setting up Python environment...${NC}"
    
    if [ ! -d "dashboard_env" ]; then
        echo "Creating virtual environment..."
        python3 -m venv dashboard_env
    fi
    
    source dashboard_env/bin/activate
    echo -e "${GREEN}✅ Virtual environment activated${NC}"
    
    echo "Installing/updating requirements..."
    pip install --upgrade pip
    pip install -r algorithm-dashboard/backend/requirements.txt
    echo -e "${GREEN}✅ Requirements installed${NC}"
}

# Build Docker images
build_docker_images() {
    echo -e "${BLUE}🔨 Building Docker execution images...${NC}"
    
    cd algorithm-dashboard
    
    # The Docker images will be built automatically when first needed
    # by the DockerExecutor class, but we can pre-build them here
    echo "Docker images will be built automatically on first use"
    echo -e "${GREEN}✅ Docker setup ready${NC}"
}

# Start the enhanced backend server
start_backend() {
    echo -e "${BLUE}🚀 Starting Enhanced WebSocket Server...${NC}"
    
    cd algorithm-dashboard/backend/websocket
    
    # Set Python path to include backend modules
    export PYTHONPATH="../:$PYTHONPATH"
    
    echo "Starting server on localhost:8765..."
    echo "Server capabilities:"
    echo "  🐳 Docker-based secure execution"
    echo "  📊 Live performance analytics"
    echo "  🧪 Real testing framework"
    echo "  🔒 Security sandboxing"
    echo "  📈 Complexity analysis"
    echo ""
    
    python enhanced_server.py
}

# Start the frontend
start_frontend() {
    echo -e "${BLUE}⚛️ Starting Next.js Frontend...${NC}"
    
    cd algorithm-dashboard
    
    # Install frontend dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    echo "Starting frontend on localhost:3000..."
    npm run dev
}

# Main execution
main() {
    echo -e "${YELLOW}Choose startup mode:${NC}"
    echo "1) Full Stack (Backend + Frontend)"
    echo "2) Backend Only"
    echo "3) Frontend Only"
    echo "4) Setup Only (no start)"
    
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            echo -e "${GREEN}🚀 Starting Full Stack Mode${NC}"
            check_docker
            setup_environment
            build_docker_images
            
            echo -e "${BLUE}Starting backend in background...${NC}"
            start_backend &
            BACKEND_PID=$!
            
            sleep 5  # Give backend time to start
            
            echo -e "${BLUE}Starting frontend...${NC}"
            start_frontend
            
            # Cleanup on exit
            trap "kill $BACKEND_PID" EXIT
            ;;
        2)
            echo -e "${GREEN}🚀 Starting Backend Only${NC}"
            check_docker
            setup_environment
            build_docker_images
            start_backend
            ;;
        3)
            echo -e "${GREEN}⚛️ Starting Frontend Only${NC}"
            start_frontend
            ;;
        4)
            echo -e "${GREEN}🔧 Setup Only${NC}"
            check_docker
            setup_environment
            build_docker_images
            echo -e "${GREEN}✅ Setup complete!${NC}"
            echo "To start manually:"
            echo "  Backend: cd algorithm-dashboard/backend/websocket && python enhanced_server.py"
            echo "  Frontend: cd algorithm-dashboard && npm run dev"
            ;;
        *)
            echo -e "${RED}Invalid choice. Exiting.${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
