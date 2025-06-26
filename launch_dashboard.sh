#!/bin/bash
# 🚀 Interview Preparation Dashboard Launcher

echo "🚀 Starting Interview Preparation Dashboard..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to the correct directory
cd "/Users/a0g11b6/Desktop/Interview Prepration"

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source dashboard_env/bin/activate

# Check if streamlit is installed
if ! command -v streamlit &> /dev/null; then
    echo "📦 Installing required packages..."
    pip install streamlit plotly pandas numpy matplotlib seaborn
fi

echo "🎯 Launching dashboard at http://localhost:8501"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Your Interview Prep Dashboard is starting!"
echo "📱 Open your browser and navigate to: http://localhost:8501"
echo ""
echo "✨ Available Tools:"
echo "   🔬 Algorithm Performance Lab"
echo "   🕵️ Pattern Detective Game"
echo "   🤖 AI Interview Buddy"
echo "   🏰 Algorithm Kingdom RPG"
echo "   🎪 Company-Specific Training"
echo "   🏗️ Smart Recommendation Engine"
echo ""
echo "Press Ctrl+C to stop the dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Launch Streamlit dashboard
streamlit run interview_prep_dashboard.py --server.port=8501 --server.headless=true
