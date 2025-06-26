#!/bin/bash

# 🚀 Interactive Algorithm Dashboard Launcher
echo "🚀 Starting Interactive Algorithm Learning Dashboard..."

# Check if virtual environment exists
if [ ! -d "dashboard_env" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv dashboard_env
fi

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source dashboard_env/bin/activate

# Install requirements
echo "📚 Installing requirements..."
pip install -r requirements_dashboard.txt

# Launch the dashboard
echo "🎯 Launching dashboard..."
echo "🌐 Opening browser at http://localhost:8501"
streamlit run interactive_algo_dashboard.py

echo "✅ Dashboard closed. Thanks for learning!"
