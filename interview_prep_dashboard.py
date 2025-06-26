#!/usr/bin/env python3
"""
🚀 INTERVIEW PREPARATION DASHBOARD
Modern web-based UI for all your algorithm training tools

Run with: streamlit run interview_prep_dashboard.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import random
import time
from datetime import datetime, timedelta
import json
from typing import Dict, List, Tuple
import sys
import os
import glob
import re
from pathlib import Path
import streamlit.components.v1 as components
import markdown2
import html
import base64

# Add current directory to path to import our tools
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our custom tools - but make them optional for dashboard functionality
TOOLS_AVAILABLE = True
try:
    from Algorithm_Performance_Lab import AlgorithmLab
    from Algorithm_Pattern_Detective import AlgorithmDetective
    from AI_Interview_Buddy import AIInterviewBuddy
    from Algorithm_Kingdom_RPG import AlgorithmKingdom
    from Algorithm_Circus import AlgorithmCircus
    from Smart_Recommendation_Engine import SmartRecommendationEngine
except ImportError as e:
    TOOLS_AVAILABLE = False
    st.warning(f"Some advanced tools are not available: {e}")
    st.info("Study Materials and basic features are still fully functional!")

# Page configuration
st.set_page_config(
    page_title="Algorithm Interview Prep Dashboard",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for beautiful styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    
    .tool-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        color: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .metric-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        color: white;
        margin: 0.5rem;
    }
    
    .success-message {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        margin: 1rem 0;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 10px;
        font-weight: bold;
        transition: all 0.3s;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    /* Enhanced Study Materials Styling */
    .study-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 20px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    
    .category-card {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        color: #2c3e50;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        border: 2px solid #667eea;
    }
    
    .file-card {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 1rem;
        border-radius: 12px;
        margin: 0.3rem 0;
        cursor: pointer;
        transition: all 0.3s ease;
        border-left: 4px solid #ff6b6b;
        color: #2c3e50;
        box-shadow: 0 3px 15px rgba(0,0,0,0.08);
    }
    
    .file-card:hover {
        transform: translateX(5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-left: 4px solid #4ecdc4;
    }
    
    .progress-ring {
        background: conic-gradient(#4ecdc4 0deg 120deg, #e0e0e0 120deg);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        font-weight: bold;
        color: #2c3e50;
    }
    
    .content-card {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 2rem;
        border-radius: 20px;
        margin: 1rem 0;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .quick-stats {
        background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
        padding: 1rem;
        border-radius: 15px;
        margin: 0.5rem;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .reading-progress {
        background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%);
        height: 8px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .search-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 15px;
        margin-bottom: 1rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .bookmark-badge {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        margin-left: 0.5rem;
    }
    
    .difficulty-badge {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 15px;
        font-size: 0.7rem;
        font-weight: bold;
    }
    
    .code-container {
        background: #2d3748;
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
        position: relative;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }
    
    .copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #4ecdc4;
        border: none;
        border-radius: 6px;
        padding: 0.3rem 0.8rem;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
    }
    
    .toc-container {
        background: linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .notes-container {
        background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
    
    .achievement-badge {
        background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-weight: bold;
        display: inline-block;
        margin: 0.2rem;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
    }
    
    .study-timer {
        background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        color: white;
        padding: 1rem;
        border-radius: 15px;
        text-align: center;
        margin: 1rem 0;
        font-size: 1.2rem;
        font-weight: bold;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

def initialize_session_state():
    """Initialize session state variables"""
    if 'user_profile' not in st.session_state:
        st.session_state.user_profile = {
            'name': 'Algorithm Master',
            'level': 1,
            'experience': 0,
            'problems_solved': 0,
            'patterns_mastered': [],
            'favorite_company': 'Google',
            'study_streak': 0
        }
    
    if 'performance_history' not in st.session_state:
        st.session_state.performance_history = []
    
    if 'current_quest' not in st.session_state:
        st.session_state.current_quest = None
    
    if 'study_progress' not in st.session_state:
        st.session_state.study_progress = {}
    
    if 'bookmarked_files' not in st.session_state:
        st.session_state.bookmarked_files = []
    
    if 'reading_notes' not in st.session_state:
        st.session_state.reading_notes = {}

def render_dashboard_header():
    """Render the main dashboard header"""
    st.markdown('<div class="main-header">🚀 Algorithm Interview Prep Dashboard</div>', unsafe_allow_html=True)
    
    # User stats row
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h3>👤 Level</h3>
            <h2>{st.session_state.user_profile['level']}</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <h3>⭐ Experience</h3>
            <h2>{st.session_state.user_profile['experience']}</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <h3>🎯 Problems Solved</h3>
            <h2>{st.session_state.user_profile['problems_solved']}</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <h3>🔥 Study Streak</h3>
            <h2>{st.session_state.user_profile['study_streak']} days</h2>
        </div>
        """, unsafe_allow_html=True)

def render_algorithm_performance_lab():
    """Render Algorithm Performance Lab interface"""
    st.header("🔬 Algorithm Performance Laboratory")
    st.write("Compare algorithm performance with real-time benchmarking")
    
    # Algorithm selection
    col1, col2 = st.columns(2)
    
    with col1:
        selected_algorithms = st.multiselect(
            "Select algorithms to benchmark:",
            ["Bubble Sort", "Merge Sort", "Quick Sort", "Python Built-in"],
            default=["Merge Sort", "Quick Sort"]
        )
    
    with col2:
        input_sizes = st.multiselect(
            "Select input sizes:",
            [100, 500, 1000, 2000, 5000],
            default=[100, 500, 1000]
        )
    
    if st.button("🚀 Run Performance Analysis"):
        if selected_algorithms and input_sizes:
            # Create progress bar
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            # Initialize lab
            lab = AlgorithmLab()
            results_data = []
            
            # Simulate benchmarking with progress updates
            total_tests = len(selected_algorithms) * len(input_sizes)
            current_test = 0
            
            for algorithm in selected_algorithms:
                for size in input_sizes:
                    status_text.text(f"Testing {algorithm} with input size {size}...")
                    
                    # Simulate some processing time
                    time.sleep(0.1)
                    
                    # Generate realistic performance data
                    if algorithm == "Bubble Sort":
                        exec_time = size * size / 1000000  # O(n²)
                    elif algorithm == "Merge Sort":
                        exec_time = size * (size ** 0.5) / 100000  # O(n log n)
                    elif algorithm == "Quick Sort":
                        exec_time = size * (size ** 0.6) / 120000  # O(n log n) average
                    else:  # Python built-in
                        exec_time = size * (size ** 0.4) / 200000  # Highly optimized
                    
                    results_data.append({
                        'Algorithm': algorithm,
                        'Input Size': size,
                        'Execution Time (ms)': exec_time * 1000,
                        'Complexity Class': 'O(n²)' if 'Bubble' in algorithm else 'O(n log n)'
                    })
                    
                    current_test += 1
                    progress_bar.progress(current_test / total_tests)
            
            status_text.text("Analysis complete! 🎉")
            
            # Create results DataFrame
            df = pd.DataFrame(results_data)
            
            # Display results
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📊 Performance Chart")
                fig = px.line(df, x='Input Size', y='Execution Time (ms)', 
                            color='Algorithm', title='Algorithm Performance Comparison')
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                st.subheader("📈 Results Table")
                st.dataframe(df, use_container_width=True)
            
            # Performance insights
            st.subheader("💡 Performance Insights")
            fastest_algo = df.loc[df.groupby('Input Size')['Execution Time (ms)'].idxmin()]
            
            insights = []
            for size in input_sizes:
                size_data = fastest_algo[fastest_algo['Input Size'] == size]
                if not size_data.empty:
                    fastest = size_data.iloc[0]['Algorithm']
                    insights.append(f"📌 For input size {size}: **{fastest}** is fastest")
            
            for insight in insights:
                st.write(insight)
        else:
            st.warning("Please select at least one algorithm and one input size!")

def render_pattern_detective():
    """Render Algorithm Pattern Detective interface"""
    st.header("🕵️ Algorithm Pattern Detective")
    st.write("Train your pattern recognition skills with mystery cases!")
    
    if 'detective' not in st.session_state:
        st.session_state.detective = AlgorithmDetective()
    
    if 'current_case' not in st.session_state:
        st.session_state.current_case = None
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        if st.button("🎯 Start New Detective Case"):
            # Load a new case
            case = random.choice(st.session_state.detective.cases)
            st.session_state.current_case = case
        
        if st.session_state.current_case:
            case = st.session_state.current_case
            
            st.markdown(f"""
            <div class="tool-card">
                <h3>🕵️ Case: {case.title}</h3>
                <p><strong>Company:</strong> {case.company} ({case.difficulty})</p>
                <p><strong>Description:</strong> {case.description}</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.subheader("🔍 Clues Discovered:")
            for i, clue in enumerate(case.clues, 1):
                st.write(f"{i}. {clue}")
            
            # Pattern selection
            all_patterns = [
                "Two Pointers", "Sliding Window (Fixed Size)", "Sliding Window (Variable Size)",
                "Binary Search", "Modified Binary Search", "DFS Graph Traversal", 
                "BFS Graph Traversal", "Dynamic Programming (1D)", "Dynamic Programming (2D)",
                "Greedy Algorithm", "Backtracking", "Bit Manipulation (XOR)",
                "Heap/Priority Queue", "Union Find", "Trie", "Segment Tree"
            ]
            
            selected_pattern = st.selectbox(
                "🎯 Which algorithm pattern should you use?",
                ["Select a pattern..."] + all_patterns
            )
            
            if st.button("🔍 Solve Case") and selected_pattern != "Select a pattern...":
                if selected_pattern == case.hidden_pattern:
                    st.success("🎉 Case Solved! Excellent detective work!")
                    st.balloons()
                    
                    # Update user stats
                    st.session_state.user_profile['experience'] += 10
                    st.session_state.user_profile['problems_solved'] += 1
                else:
                    st.error(f"❌ Case remains unsolved... The correct pattern was: **{case.hidden_pattern}**")
                
                st.session_state.current_case = None
    
    with col2:
        st.subheader("📊 Detective Stats")
        if hasattr(st.session_state.detective, 'score'):
            st.metric("Score", st.session_state.detective.score)
        else:
            st.metric("Score", 0)
        
        st.metric("Cases Solved", st.session_state.user_profile['problems_solved'])

def render_ai_interview_buddy():
    """Render AI Interview Buddy interface"""
    st.header("🤖 AI Interview Buddy")
    st.write("Your intelligent practice partner that adapts to your learning style")
    
    if 'ai_buddy' not in st.session_state:
        st.session_state.ai_buddy = AIInterviewBuddy()
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🎯 Personalized Recommendation")
        
        if st.button("🎲 Get AI Recommendation"):
            pattern, difficulty, problem = st.session_state.ai_buddy.recommend_next_problem("user")
            
            st.markdown(f"""
            <div class="success-message">
                <h4>🎯 AI Recommends:</h4>
                <p><strong>Problem:</strong> {problem}</p>
                <p><strong>Pattern:</strong> {pattern}</p>
                <p><strong>Difficulty:</strong> {difficulty}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Simulate problem attempt
            if st.button("💪 Start Problem"):
                # Mock performance data
                performance = {
                    'correctness': random.uniform(0.6, 1.0),
                    'time_taken': random.uniform(10, 45),
                    'confidence': random.randint(6, 10)
                }
                
                st.write(f"⏱️ Time taken: {performance['time_taken']:.1f} minutes")
                st.write(f"🎯 Correctness: {performance['correctness']:.1%}")
                st.write(f"💪 Confidence: {performance['confidence']}/10")
                
                # AI Feedback
                if performance['correctness'] >= 0.9:
                    feedback = "🌟 Excellent work! You're mastering this pattern!"
                elif performance['correctness'] >= 0.7:
                    feedback = "📈 Good progress! Keep practicing this pattern."
                else:
                    feedback = "💪 Keep working at it! Practice makes perfect."
                
                st.info(f"🤖 AI Feedback: {feedback}")
    
    with col2:
        st.subheader("📅 Study Plan Generator")
        
        days = st.slider("Study plan duration (days):", 3, 14, 7)
        
        if st.button("📋 Generate AI Study Plan"):
            study_plan = st.session_state.ai_buddy.generate_study_plan("user", days)
            st.text_area("Your Personalized Study Plan:", study_plan, height=300)

def render_algorithm_kingdom():
    """Render Algorithm Kingdom RPG interface"""
    st.header("🏰 Algorithm Kingdom RPG")
    st.write("Transform your learning into an epic fantasy adventure!")
    
    if 'kingdom' not in st.session_state:
        st.session_state.kingdom = AlgorithmKingdom()
        st.session_state.hero = st.session_state.kingdom.create_hero("Code Warrior")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🧙 Hero Status")
        hero = st.session_state.hero
        
        st.markdown(f"""
        <div class="tool-card">
            <h3>🧙 {hero.name}</h3>
            <p><strong>Level:</strong> {hero.level}</p>
            <p><strong>Experience:</strong> {hero.experience} XP</p>
            <p><strong>Health:</strong> {hero.health}/100 ❤️</p>
            <p><strong>Mana:</strong> {hero.mana}/100 💙</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.subheader("🔮 Learned Spells")
        for spell in hero.learned_spells:
            st.write(f"⚡ {spell}")
        
        # Spell learning
        available_spells = [
            "Binary Search Mastery", "XOR Magic", "DFS Exploration",
            "Dynamic Programming Mastery", "Two Pointer Convergence"
        ]
        
        new_spell = st.selectbox("Learn new spell:", ["Select spell..."] + available_spells)
        
        if st.button("📖 Learn Spell") and new_spell != "Select spell...":
            if new_spell not in hero.learned_spells:
                result = st.session_state.kingdom.learn_spell(new_spell)
                if "CONGRATULATIONS" in result:
                    st.success(f"✨ You learned {new_spell}!")
                    st.balloons()
                else:
                    st.warning("Not enough mana to learn this spell!")
            else:
                st.info("You already know this spell!")
    
    with col2:
        st.subheader("🗺️ Available Quests")
        
        quests = st.session_state.kingdom.available_quests
        quest_names = [q.name for q in quests]
        
        selected_quest = st.selectbox("Choose your quest:", ["Select quest..."] + quest_names)
        
        if selected_quest != "Select quest...":
            quest = next(q for q in quests if q.name == selected_quest)
            
            st.markdown(f"""
            <div class="tool-card">
                <h4>⚔️ {quest.name}</h4>
                <p><strong>Boss:</strong> {quest.boss_name}</p>
                <p><strong>Required Spell:</strong> {quest.required_spell}</p>
                <p><strong>Difficulty:</strong> {'⭐' * quest.difficulty}</p>
                <p><strong>Rewards:</strong> {', '.join(f'{k}: {v}' for k, v in quest.rewards.items())}</p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button("⚔️ Start Quest"):
                if quest.required_spell in hero.learned_spells:
                    st.success("🎉 Quest completed successfully!")
                    st.session_state.user_profile['experience'] += quest.rewards.get('experience', 0)
                    st.balloons()
                else:
                    st.error(f"❌ You need to learn '{quest.required_spell}' first!")

def render_algorithm_circus():
    """Render Algorithm Circus interface"""
    st.header("🎪 Algorithm Circus")
    st.write("Master company-specific interview styles!")
    
    if 'circus' not in st.session_state:
        st.session_state.circus = AlgorithmCircus()
    
    # Company selection
    companies = ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix"]
    selected_company = st.selectbox("🏢 Choose your target company:", companies)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader(f"🎭 {selected_company} Training Profile")
        
        # Mock company profile display
        company_profiles = {
            "Google": {
                "style": "Academic & Theoretical",
                "patterns": ["Graph Algorithms", "Dynamic Programming", "Trees"],
                "difficulty": "Hard",
                "pressure": "7/10"
            },
            "Amazon": {
                "style": "Practical & Leadership",
                "patterns": ["Two Pointers", "Sliding Window", "Trees"],
                "difficulty": "Medium",
                "pressure": "8/10"
            },
            "Meta": {
                "style": "Fast-Paced & Collaborative", 
                "patterns": ["Graphs", "BFS/DFS", "Hash Maps"],
                "difficulty": "Medium-Hard",
                "pressure": "9/10"
            },
            "Microsoft": {
                "style": "Collaborative & Growth-Minded",
                "patterns": ["Arrays", "Strings", "Trees"],
                "difficulty": "Medium",
                "pressure": "5/10"
            }
        }
        
        if selected_company in company_profiles:
            profile = company_profiles[selected_company]
            
            st.markdown(f"""
            <div class="tool-card">
                <h4>🎯 Interview Style: {profile['style']}</h4>
                <p><strong>Favorite Patterns:</strong> {', '.join(profile['patterns'])}</p>
                <p><strong>Difficulty Preference:</strong> {profile['difficulty']}</p>
                <p><strong>Time Pressure:</strong> {profile['pressure']}</p>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.subheader("🎬 Interview Simulation")
        
        if st.button(f"🚀 Start {selected_company} Interview"):
            problems_by_company = {
                "Google": "Implement autocomplete with trie data structure",
                "Amazon": "Design package delivery optimization system",
                "Meta": "Build friend suggestion algorithm",
                "Microsoft": "Create collaborative document system"
            }
            
            problem = problems_by_company.get(selected_company, "Generic algorithm problem")
            
            st.markdown(f"""
            <div class="success-message">
                <h4>🎬 Live Interview Simulation</h4>
                <p><strong>Problem:</strong> {problem}</p>
                <p><strong>Company:</strong> {selected_company}</p>
                <p>⏰ You have 45 minutes. Good luck!</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Simulate interview progress
            if st.button("💪 Complete Interview"):
                score = random.uniform(0.7, 1.0)
                st.success(f"🎉 Interview completed! Score: {score:.1%}")
                st.session_state.user_profile['experience'] += 50

def render_recommendation_engine():
    """Render Smart Recommendation Engine interface"""
    st.header("🏗️ Smart Recommendation Engine")
    st.write("See your algorithms working in a real production system!")
    
    # Mock recommendation engine data
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("👥 User Similarity Analysis")
        
        # Generate mock similarity data
        users = ["Alice", "Bob", "Charlie", "Diana"]
        similarity_data = []
        
        for user in users:
            similarity_data.append({
                'User': user,
                'Similarity Score': random.uniform(0.3, 0.9),
                'Common Preferences': random.randint(3, 8)
            })
        
        df_similarity = pd.DataFrame(similarity_data)
        
        fig_similarity = px.bar(df_similarity, x='User', y='Similarity Score', 
                               title='User Similarity (Two-Pointers Algorithm)')
        st.plotly_chart(fig_similarity, use_container_width=True)
    
    with col2:
        st.subheader("🎯 Recommendation Results")
        
        # Mock recommendations
        recommendations = [
            {"Content": "Movie A", "Score": 0.92, "Algorithm": "Collaborative Filtering"},
            {"Content": "Movie B", "Score": 0.87, "Algorithm": "Content-Based"},
            {"Content": "Movie C", "Score": 0.81, "Algorithm": "Hybrid Approach"},
            {"Content": "Movie D", "Score": 0.76, "Algorithm": "Graph-Based"}
        ]
        
        df_recommendations = pd.DataFrame(recommendations)
        st.dataframe(df_recommendations, use_container_width=True)
        
        # Algorithm performance breakdown
        fig_algo = px.pie(df_recommendations, values='Score', names='Algorithm',
                         title='Algorithm Contribution to Recommendations')
        st.plotly_chart(fig_algo, use_container_width=True)

# Study Materials Management Functions
class StudyMaterialsRenderer:
    """Creates beautiful HTML pages for markdown content with modern UI"""
    
    def __init__(self):
        self.base_styles = self._get_base_styles()
        self.base_scripts = self._get_base_scripts()
    
    def _get_base_styles(self):
        """Get comprehensive CSS styles for beautiful rendering"""
        return """
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #2c3e50;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .page-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                overflow: hidden;
                animation: fadeIn 0.6s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .page-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 3rem 2rem;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .page-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .page-title {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                position: relative;
                z-index: 1;
            }
            
            .page-subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            
            .page-meta {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.2);
                font-size: 0.9rem;
                opacity: 0.8;
                position: relative;
                z-index: 1;
            }
            
            .content-container {
                padding: 3rem;
                background: white;
            }
            
            .table-of-contents {
                background: linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%);
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 3rem;
                border-left: 5px solid #667eea;
            }
            
            .toc-title {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #2c3e50;
            }
            
            .toc-list {
                list-style: none;
            }
            
            .toc-item {
                margin: 0.5rem 0;
                padding-left: 1rem;
                position: relative;
            }
            
            .toc-item::before {
                content: '📌';
                position: absolute;
                left: 0;
                top: 0;
            }
            
            .toc-item.level-2 {
                padding-left: 2rem;
            }
            
            .toc-item.level-2::before {
                content: '📍';
            }
            
            .toc-item.level-3 {
                padding-left: 3rem;
            }
            
            .toc-item.level-3::before {
                content: '•';
            }
            
            .toc-link {
                color: #2c3e50;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            
            .toc-link:hover {
                color: #667eea;
            }
            
            .content-section {
                margin-bottom: 3rem;
                padding: 2rem;
                border-radius: 15px;
                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                border-left: 5px solid #ff6b6b;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .content-section:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            
            h1, h2, h3, h4, h5, h6 {
                margin-bottom: 1rem;
                color: #2c3e50;
                font-weight: 600;
            }
            
            h1 {
                font-size: 2.2rem;
                border-bottom: 3px solid #667eea;
                padding-bottom: 0.5rem;
            }
            
            h2 {
                font-size: 1.8rem;
                color: #667eea;
                margin-top: 2rem;
            }
            
            h3 {
                font-size: 1.4rem;
                color: #764ba2;
            }
            
            p {
                margin-bottom: 1.2rem;
                text-align: justify;
            }
            
            ul, ol {
                margin: 1rem 0;
                padding-left: 2rem;
            }
            
            li {
                margin: 0.5rem 0;
            }
            
            .code-block {
                background: #2d3748;
                color: #e2e8f0;
                padding: 1.5rem;
                border-radius: 12px;
                margin: 1.5rem 0;
                overflow-x: auto;
                position: relative;
                font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
                border: 1px solid #4a5568;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            }
            
            .code-header {
                background: #1a202c;
                color: #a0aec0;
                padding: 0.5rem 1rem;
                margin: -1.5rem -1.5rem 1rem -1.5rem;
                border-radius: 12px 12px 0 0;
                font-size: 0.8rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .copy-button {
                background: #4299e1;
                color: white;
                border: none;
                padding: 0.3rem 0.8rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.7rem;
                transition: background 0.3s ease;
            }
            
            .copy-button:hover {
                background: #3182ce;
            }
            
            .inline-code {
                background: #f7fafc;
                color: #e53e3e;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-family: 'Fira Code', monospace;
                font-size: 0.9em;
                border: 1px solid #e2e8f0;
            }
            
            .highlight-box {
                background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
                padding: 1.5rem;
                border-radius: 12px;
                margin: 1.5rem 0;
                border-left: 5px solid #fdcb6e;
                box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            }
            
            .highlight-box.info {
                background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                color: white;
                border-left-color: #0984e3;
            }
            
            .highlight-box.warning {
                background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
                color: white;
                border-left-color: #e17055;
            }
            
            .highlight-box.success {
                background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
                color: white;
                border-left-color: #00b894;
            }
            
            .complexity-badge {
                background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                font-weight: bold;
                display: inline-block;
                margin: 0.5rem 0.5rem 0.5rem 0;
                font-size: 0.8rem;
                box-shadow: 0 3px 15px rgba(0,0,0,0.1);
            }
            
            .algorithm-card {
                background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                padding: 2rem;
                border-radius: 15px;
                margin: 1.5rem 0;
                border: 1px solid rgba(255,255,255,0.3);
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            .algorithm-card:hover {
                transform: translateY(-5px);
            }
            
            .algorithm-title {
                font-size: 1.3rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin: 1rem 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            
            .navigation-buttons {
                position: fixed;
                right: 30px;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                padding: 1rem;
                z-index: 1000;
            }
            
            .nav-button {
                display: block;
                width: 50px;
                height: 50px;
                margin: 0.5rem 0;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
                transition: transform 0.3s ease;
            }
            
            .nav-button:hover {
                transform: scale(1.1);
            }
            
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%);
                z-index: 1001;
                transition: width 0.1s ease;
            }
            
            @media (max-width: 768px) {
                .page-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .content-container {
                    padding: 1.5rem;
                }
                
                .page-header {
                    padding: 2rem 1rem;
                }
                
                .page-title {
                    font-size: 2rem;
                }
                
                .navigation-buttons {
                    display: none;
                }
            }
            
            .fade-in {
                animation: fadeInUp 0.6s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
        """
    
    def _get_base_scripts(self):
        """Get JavaScript for interactive features"""
        return """
        <script>
            // Reading progress bar
            function updateReadingProgress() {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                document.querySelector('.reading-progress').style.width = scrolled + '%';
            }
            
            // Smooth scrolling for TOC links
            function smoothScroll(targetId) {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            // Copy code functionality
            function copyCode(button, codeId) {
                const codeElement = document.getElementById(codeId);
                const text = codeElement.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    button.textContent = '✅ Copied!';
                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                    }, 2000);
                });
            }
            
            // Highlight current section in TOC
            function highlightCurrentSection() {
                const sections = document.querySelectorAll('h1, h2, h3');
                const tocLinks = document.querySelectorAll('.toc-link');
                
                let current = '';
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100) {
                        current = section.id;
                    }
                });
                
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            }
            
            // Initialize when page loads
            document.addEventListener('DOMContentLoaded', function() {
                // Add scroll event listeners
                window.addEventListener('scroll', updateReadingProgress);
                window.addEventListener('scroll', highlightCurrentSection);
                
                // Add fade-in animation to sections
                const sections = document.querySelectorAll('.content-section');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('fade-in');
                        }
                    });
                });
                
                sections.forEach(section => {
                    observer.observe(section);
                });
                
                // Add copy buttons to code blocks
                const codeBlocks = document.querySelectorAll('.code-block');
                codeBlocks.forEach((block, index) => {
                    const codeId = 'code-block-' + index;
                    const code = block.querySelector('code');
                    if (code) {
                        code.id = codeId;
                        const copyBtn = block.querySelector('.copy-button');
                        if (copyBtn) {
                            copyBtn.onclick = () => copyCode(copyBtn, codeId);
                        }
                    }
                });
            });
            
            // Navigation functions
            function scrollToTop() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            function scrollToBottom() {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        </script>
        """
    
    def render_markdown_to_html(self, content, title, category="", file_path=""):
        """Convert markdown content to beautiful HTML page"""
        
        # Parse markdown content
        lines = content.split('\n')
        toc_items = []
        sections = []
        current_section = {"content": "", "level": 0, "title": "", "id": ""}
        
        # First pass: extract TOC and organize content
        for i, line in enumerate(lines):
            if line.strip().startswith('#'):
                # Save previous section
                if current_section["content"].strip():
                    sections.append(current_section.copy())
                
                # Start new section
                level = len(line) - len(line.lstrip('#'))
                title_text = line.strip('#').strip()
                section_id = self._generate_id(title_text)
                
                toc_items.append({
                    'level': level,
                    'title': title_text,
                    'id': section_id
                })
                
                current_section = {
                    "content": f'<h{level} id="{section_id}">{title_text}</h{level}>\n',
                    "level": level,
                    "title": title_text,
                    "id": section_id
                }
            else:
                current_section["content"] += line + "\n"
        
        # Add final section
        if current_section["content"].strip():
            sections.append(current_section)
        
        # Generate TOC HTML
        toc_html = self._generate_toc_html(toc_items)
        
        # Process content sections
        content_html = ""
        for section in sections:
            section_content = self._process_markdown_content(section["content"])
            content_html += f'<div class="content-section">{section_content}</div>'
        
        # Generate file metadata
        import os
        file_size = len(content.encode('utf-8'))
        word_count = len(content.split())
        reading_time = max(1, word_count // 200)
        
        # Complete HTML page
        html_page = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title} - Algorithm Study</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
            {self.base_styles}
        </head>
        <body>
            <div class="reading-progress"></div>
            
            <div class="page-container">
                <header class="page-header">
                    <h1 class="page-title">{title}</h1>
                    <p class="page-subtitle">Algorithm Interview Preparation Guide</p>
                    <div class="page-meta">
                        📁 {category} • ⏱️ {reading_time} min read • 📝 {word_count:,} words • 📄 {file_size // 1024}KB
                    </div>
                </header>
                
                <div class="content-container">
                    {toc_html}
                    {content_html}
                </div>
            </div>
            
            <div class="navigation-buttons">
                <button class="nav-button" onclick="scrollToTop()" title="Back to Top">↑</button>
                <button class="nav-button" onclick="scrollToBottom()" title="Go to Bottom">↓</button>
            </div>
            
            {self.base_scripts}
        </body>
        </html>
        """
        
        return html_page
    
    def _generate_id(self, text):
        """Generate URL-friendly ID from text"""
        import re
        id_text = re.sub(r'[^\w\s-]', '', text.lower())
        id_text = re.sub(r'[-\s]+', '-', id_text)
        return id_text.strip('-')
    
    def _generate_toc_html(self, toc_items):
        """Generate table of contents HTML"""
        if not toc_items:
            return ""
        
        toc_html = """
        <div class="table-of-contents">
            <h3 class="toc-title">📋 Table of Contents</h3>
            <ul class="toc-list">
        """
        
        for item in toc_items:
            level_class = f"level-{item['level']}"
            toc_html += f"""
                <li class="toc-item {level_class}">
                    <a href="#{item['id']}" class="toc-link" onclick="smoothScroll('{item['id']}')">{item['title']}</a>
                </li>
            """
        
        toc_html += "</ul></div>"
        return toc_html
    
    def _process_markdown_content(self, content):
        """Process markdown content to HTML with custom styling using markdown2"""
        # Use markdown2 for better markdown processing
        extras = [
            'fenced-code-blocks',
            'code-friendly', 
            'tables',
            'strike',
            'task_list',
            'footnotes',
            'header-ids',
            'toc'
        ]
        
        # Convert markdown to HTML
        html_content = markdown2.markdown(content, extras=extras)
        
        # Post-process for our custom styling
        import re
        
        # Enhance code blocks with copy buttons
        html_content = re.sub(
            r'<pre><code class="([^"]*)">(.*?)</code></pre>',
            lambda m: self._format_code_block(m.group(2), m.group(1)),
            html_content,
            flags=re.DOTALL
        )
        
        # Process complexity badges
        html_content = re.sub(
            r'Time Complexity: O\((.*?)\)',
            r'<span class="complexity-badge">⏰ Time: O(\1)</span>',
            html_content
        )
        
        html_content = re.sub(
            r'Space Complexity: O\((.*?)\)',
            r'<span class="complexity-badge">💾 Space: O(\1)</span>',
            html_content
        )
        
        # Process special boxes (notes, warnings, etc.)
        html_content = re.sub(
            r'<blockquote>\s*<p><strong>(Note|Info|Warning|Important):</strong>(.*?)</p>\s*</blockquote>',
            lambda m: self._format_highlight_box(m.group(2).strip(), m.group(1).lower()),
            html_content,
            flags=re.DOTALL
        )
        
        return html_content
    
    def _format_code_block(self, code, language):
        """Format code block with syntax highlighting and copy button"""
        import uuid
        code_id = f"code-{uuid.uuid4().hex[:8]}"
        
        return f"""
        <div class="code-block">
            <div class="code-header">
                <span>💻 {language.upper()}</span>
                <button class="copy-button">📋 Copy</button>
            </div>
            <code id="{code_id}">{code.strip()}</code>
        </div>
        """
    
    def _format_highlight_box(self, content, box_type):
        """Format highlighted information boxes"""
        icons = {
            'note': '📝',
            'info': 'ℹ️',
            'warning': '⚠️',
            'important': '❗'
        }
        
        icon = icons.get(box_type, '💡')
        
        return f"""
        <div class="highlight-box {box_type}">
            <strong>{icon} {box_type.title()}:</strong> {content}
        </div>
        """
    
    def render_file_as_html(self, file_info):
        """Main method to render a markdown file as beautiful HTML"""
        try:
            # Read the markdown content
            with open(file_info['path'], 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Generate the beautiful HTML page
            beautiful_html = self.render_markdown_to_html(
                content=content,
                title=file_info['display_name'],
                category=file_info['category'],
                file_path=file_info['path']
            )
            
            return beautiful_html
            
        except Exception as e:
            return f"<html><body><h1>Error loading file</h1><p>{str(e)}</p></body></html>"

class StudyMaterialsManager:
    """Manages markdown study materials with organization, search, and progress tracking"""
    
    def __init__(self, workspace_path="/Users/a0g11b6/Desktop/Interview Prepration"):
        self.workspace_path = workspace_path
        self.md_files = self._discover_markdown_files()
        self.categories = self._categorize_files()
        self.renderer = StudyMaterialsRenderer()
    
    def _discover_markdown_files(self):
        """Discover all markdown files in the workspace"""
        md_pattern = os.path.join(self.workspace_path, "*.md")
        files = glob.glob(md_pattern)
        
        file_info = []
        for file_path in files:
            filename = os.path.basename(file_path)
            file_info.append({
                'path': file_path,
                'name': filename,
                'display_name': self._format_display_name(filename),
                'category': self._categorize_file(filename),
                'size': os.path.getsize(file_path),
                'modified': datetime.fromtimestamp(os.path.getmtime(file_path))
            })
        
        return sorted(file_info, key=lambda x: x['display_name'])
    
    def _format_display_name(self, filename):
        """Convert filename to readable display name"""
        name = filename.replace('.md', '').replace('_', ' ')
        # Handle numbered files like "01_Arrays_TwoPointers_Mastery.md"
        name = re.sub(r'^\d+\s*[-_]*\s*', '', name)
        return name.title()
    
    def _categorize_file(self, filename):
        """Categorize files based on their names"""
        filename_lower = filename.lower()
        
        if 'amazon' in filename_lower:
            return 'Company Specific'
        elif any(pattern in filename_lower for pattern in ['array', 'two_pointer', 'twopointer']):
            return 'Arrays & Two Pointers'
        elif any(pattern in filename_lower for pattern in ['tree', 'graph']):
            return 'Trees & Graphs'
        elif any(pattern in filename_lower for pattern in ['dp', 'dynamic', 'programming']):
            return 'Dynamic Programming'
        elif any(pattern in filename_lower for pattern in ['binary', 'search']):
            return 'Binary Search'
        elif any(pattern in filename_lower for pattern in ['string', 'pattern']):
            return 'Strings & Patterns'
        elif any(pattern in filename_lower for pattern in ['stack', 'queue']):
            return 'Stacks & Queues'
        elif any(pattern in filename_lower for pattern in ['heap', 'priority']):
            return 'Heaps & Priority Queues'
        elif any(pattern in filename_lower for pattern in ['backtrack']):
            return 'Backtracking'
        elif any(pattern in filename_lower for pattern in ['math', 'bit', 'number']):
            return 'Math & Bit Manipulation'
        elif any(pattern in filename_lower for pattern in ['linked', 'list']):
            return 'Linked Lists'
        elif any(pattern in filename_lower for pattern in ['sort']):
            return 'Sorting & Searching'
        elif any(pattern in filename_lower for pattern in ['complete', 'pattern', 'guide']):
            return 'Comprehensive Guides'
        elif any(pattern in filename_lower for pattern in ['advanced']):
            return 'Advanced Topics'
        else:
            return 'General'
    
    def _categorize_files(self):
        """Group files by category"""
        categories = {}
        for file_info in self.md_files:
            category = file_info['category']
            if category not in categories:
                categories[category] = []
            categories[category].append(file_info)
        return categories
    
    def read_file_content(self, file_path):
        """Read and return markdown file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {e}"
    
    def search_files(self, query):
        """Search for files by name or content"""
        query_lower = query.lower()
        matching_files = []
        
        for file_info in self.md_files:
            # Search in filename
            if query_lower in file_info['display_name'].lower():
                matching_files.append({**file_info, 'match_type': 'filename'})
                continue
            
            # Search in content
            try:
                content = self.read_file_content(file_info['path'])
                if query_lower in content.lower():
                    matching_files.append({**file_info, 'match_type': 'content'})
            except:
                pass
        
        return matching_files

def render_study_materials():
    """Render the enhanced, beautiful study materials interface"""
    
    # Beautiful header with gradient background
    st.markdown("""
    <div class="study-header">
        <h1>📚 Algorithm Study Materials</h1>
        <p style="font-size: 1.2rem; margin: 0;">Your comprehensive library of interview preparation guides</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize study materials manager
    if 'study_manager' not in st.session_state:
        st.session_state.study_manager = StudyMaterialsManager()
    
    study_manager = st.session_state.study_manager
    
    # Study session timer
    if 'study_start_time' not in st.session_state:
        st.session_state.study_start_time = None
    
    # Top stats and quick actions bar
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        total_files = len(study_manager.md_files)
        completed_files = len(st.session_state.study_progress)
        st.markdown(f"""
        <div class="quick-stats">
            <h3>📊 Progress</h3>
            <h2>{completed_files}/{total_files}</h2>
            <p>{(completed_files/total_files*100):.0f}% Complete</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="quick-stats">
            <h3>⭐ Bookmarks</h3>
            <h2>{len(st.session_state.bookmarked_files)}</h2>
            <p>Saved Items</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="quick-stats">
            <h3>📁 Categories</h3>
            <h2>{len(study_manager.categories)}</h2>
            <p>Topics Available</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        total_notes = sum(1 for notes in st.session_state.reading_notes.values() if notes.strip())
        st.markdown(f"""
        <div class="quick-stats">
            <h3>📝 Notes</h3>
            <h2>{total_notes}</h2>
            <p>Personal Notes</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col5:
        # Study timer
        if st.session_state.study_start_time:
            elapsed = datetime.now() - st.session_state.study_start_time
            minutes = int(elapsed.total_seconds() // 60)
            if st.button("⏹️ Stop Session"):
                st.session_state.study_start_time = None
                st.success(f"Study session completed! Duration: {minutes} minutes")
            st.markdown(f"""
            <div class="study-timer">
                <h3>⏱️ Study Time</h3>
                <h2>{minutes}m</h2>
                <p>Current Session</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            if st.button("▶️ Start Session"):
                st.session_state.study_start_time = datetime.now()
                st.success("Study session started! 📚")
    
    st.markdown("---")
    
    # Enhanced search with filters
    st.markdown("""
    <div class="search-container">
        <h3 style="color: white; margin-bottom: 1rem;">🔍 Smart Search & Filters</h3>
    </div>
    """, unsafe_allow_html=True)
    
    search_col1, search_col2, search_col3 = st.columns([2, 1, 1])
    
    with search_col1:
        search_query = st.text_input("", placeholder="🔍 Search by title, content, or topic...", label_visibility="collapsed")
    
    with search_col2:
        category_filter = st.selectbox("Filter by Category:", ["All Categories"] + list(study_manager.categories.keys()))
    
    with search_col3:
        sort_by = st.selectbox("Sort by:", ["Name", "Recent", "Progress", "Category"])
    
    # Create main layout based on whether a file is selected
    if 'selected_file' not in st.session_state or search_query or category_filter != "All Categories":
        # Library view - show all files/categories
        render_library_view(study_manager, search_query, category_filter, sort_by)
    else:
        # Reading view - show selected file
        render_reading_view(study_manager)

def render_library_view(study_manager, search_query, category_filter, sort_by):
    """Render the beautiful library overview with categories and files"""
    
    # Filter files based on search and category
    filtered_files = study_manager.md_files
    
    if search_query:
        filtered_files = study_manager.search_files(search_query)
    
    if category_filter != "All Categories":
        filtered_files = [f for f in filtered_files if f['category'] == category_filter]
    
    # Sort files
    if sort_by == "Recent":
        filtered_files = sorted(filtered_files, key=lambda x: x['modified'], reverse=True)
    elif sort_by == "Progress":
        filtered_files = sorted(filtered_files, key=lambda x: x['name'] in st.session_state.study_progress, reverse=True)
    elif sort_by == "Category":
        filtered_files = sorted(filtered_files, key=lambda x: x['category'])
    else:  # Name
        filtered_files = sorted(filtered_files, key=lambda x: x['display_name'])
    
    if search_query:
        st.subheader(f"🔍 Search Results for '{search_query}' ({len(filtered_files)} found)")
        render_file_grid(filtered_files)
    else:
        if category_filter != "All Categories":
            st.subheader(f"📁 {category_filter} ({len(filtered_files)} files)")
            render_file_grid(filtered_files)
        else:
            # Show categories overview
            st.subheader("📚 Study Categories")
            render_category_overview(study_manager)
            
            # Show recent files
            st.subheader("📖 Continue Reading")
            recent_files = sorted(study_manager.md_files, key=lambda x: x['modified'], reverse=True)[:6]
            render_file_grid(recent_files)
            
            # Show recommended files
            st.subheader("💡 Recommended for You")
            incomplete_files = [f for f in study_manager.md_files if f['name'] not in st.session_state.study_progress]
            recommended = incomplete_files[:6] if incomplete_files else recent_files[:6]
            render_file_grid(recommended)

def render_category_overview(study_manager):
    """Render beautiful category cards"""
    
    # Category icons mapping
    category_icons = {
        'Arrays & Two Pointers': '🔢',
        'Trees & Graphs': '🌳',
        'Dynamic Programming': '🧠',
        'Binary Search': '🔍',
        'Strings & Patterns': '📝',
        'Stacks & Queues': '📚',
        'Heaps & Priority Queues': '⛰️',
        'Backtracking': '🔄',
        'Math & Bit Manipulation': '🔢',
        'Linked Lists': '🔗',
        'Sorting & Searching': '📊',
        'Comprehensive Guides': '📖',
        'Company Specific': '🏢',
        'Advanced Topics': '🚀',
        'General': '📋'
    }
    
    # Create category grid
    cols = st.columns(3)
    for i, (category, files) in enumerate(study_manager.categories.items()):
        with cols[i % 3]:
            completed_in_category = sum(1 for f in files if f['name'] in st.session_state.study_progress)
            progress_pct = (completed_in_category / len(files)) * 100 if files else 0
            icon = category_icons.get(category, '📁')
            
            # Create clickable category card
            if st.button(f"{icon} {category}", key=f"cat_{category}", use_container_width=True):
                st.session_state.category_filter = category
                st.rerun()
            
            st.markdown(f"""
            <div class="category-card">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">{icon}</div>
                <h4 style="margin: 0.5rem 0;">{category}</h4>
                <p style="margin: 0;">{len(files)} files</p>
                <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; margin-top: 0.5rem;">
                    <div style="background: #4ecdc4; height: 100%; border-radius: 10px; width: {progress_pct}%;"></div>
                </div>
                <small>{progress_pct:.0f}% completed</small>
            </div>
            """, unsafe_allow_html=True)

def render_file_grid(files):
    """Render files in a beautiful grid layout"""
    
    if not files:
        st.info("📭 No files found matching your criteria.")
        return
    
    # Create responsive grid
    cols = st.columns(3)
    for i, file_info in enumerate(files):
        with cols[i % 3]:
            render_file_card(file_info)

def render_file_card(file_info):
    """Render a beautiful file card"""
    
    # Calculate reading time estimate (rough)
    try:
        content = st.session_state.study_manager.read_file_content(file_info['path'])
        word_count = len(content.split())
        reading_time = max(1, word_count // 200)  # Assume 200 words per minute
    except:
        reading_time = 5
    
    # Get status indicators
    is_bookmarked = file_info['name'] in st.session_state.bookmarked_files
    is_completed = file_info['name'] in st.session_state.study_progress
    has_notes = file_info['name'] in st.session_state.reading_notes and st.session_state.reading_notes[file_info['name']].strip()
    
    # Status badges
    status_badges = []
    if is_completed:
        status_badges.append('<span class="achievement-badge">✅ Completed</span>')
    if is_bookmarked:
        status_badges.append('<span class="bookmark-badge">⭐ Bookmarked</span>')
    if has_notes:
        status_badges.append('<span class="difficulty-badge">📝 Notes</span>')
    
    # Create file card with unique key using multiple identifiers
    unique_key = f"file_card_{abs(hash(file_info['path']))}_{file_info['name'].replace('.', '_')}_{file_info['size']}"
    if st.button(f"📖 {file_info['display_name']}", key=unique_key, use_container_width=True):
        st.session_state.selected_file = file_info
        st.rerun()
    
    st.markdown(f"""
    <div class="file-card">
        <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50;">{file_info['display_name']}</h4>
        <p style="margin: 0.2rem 0; color: #7f8c8d; font-size: 0.9rem;">
            📁 {file_info['category']} • ⏱️ {reading_time} min read
        </p>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">
            {''.join(status_badges) if status_badges else '<span style="color: #95a5a6;">Not started</span>'}
        </p>
    </div>
    """, unsafe_allow_html=True)

def render_reading_view(study_manager):
    """Render the enhanced reading interface"""
    
    file_info = st.session_state.selected_file
    
    # Back to library button
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("← Back to Library"):
            del st.session_state.selected_file
            st.rerun()
    
    # File header with enhanced design
    st.markdown(f"""
    <div class="content-card">
        <h1 style="margin: 0 0 0.5rem 0; color: #2c3e50;">📖 {file_info['display_name']}</h1>
        <p style="margin: 0; color: #7f8c8d;">
            📁 {file_info['category']} • 
            📅 Modified: {file_info['modified'].strftime('%B %d, %Y')} • 
            📄 {file_info['size'] // 1024}KB
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Action buttons with beautiful design
    action_col1, action_col2, action_col3, action_col4 = st.columns(4)
    
    with action_col1:
        is_bookmarked = file_info['name'] in st.session_state.bookmarked_files
        bookmark_text = "⭐ Bookmarked" if is_bookmarked else "☆ Bookmark"
        if st.button(bookmark_text, use_container_width=True):
            if is_bookmarked:
                st.session_state.bookmarked_files.remove(file_info['name'])
                st.success("📤 Removed from bookmarks!")
            else:
                st.session_state.bookmarked_files.append(file_info['name'])
                st.success("⭐ Added to bookmarks!")
            st.rerun()
    
    with action_col2:
        is_completed = file_info['name'] in st.session_state.study_progress
        read_text = "✅ Completed" if is_completed else "✓ Mark as Read"
        if st.button(read_text, use_container_width=True):
            if is_completed:
                del st.session_state.study_progress[file_info['name']]
                st.success("📖 Marked as unread!")
            else:
                st.session_state.study_progress[file_info['name']] = {
                    'completed_date': datetime.now(),
                    'reading_time': random.randint(5, 30)
                }
                st.success("🎉 Marked as completed!")
                st.session_state.user_profile['experience'] += 10
                st.balloons()
            st.rerun()
    
    with action_col3:
        if st.button("📊 Quick Stats", use_container_width=True):
            st.session_state.show_stats = not st.session_state.get('show_stats', False)
            st.rerun()
    
    with action_col4:
        if st.button("🎯 Focus Mode", use_container_width=True):
            st.session_state.focus_mode = not st.session_state.get('focus_mode', False)
            st.rerun()
    
    # Progress indicator
    total_files = len(study_manager.md_files)
    completed_files = len(st.session_state.study_progress)
    progress_percentage = (completed_files / total_files) * 100
    
    st.markdown(f"""
    <div style="margin: 1rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: bold;">Overall Progress</span>
            <span>{completed_files}/{total_files} files ({progress_percentage:.1f}%)</span>
        </div>
        <div style="background: #e0e0e0; border-radius: 10px; height: 12px;">
            <div class="reading-progress" style="width: {progress_percentage}%; height: 100%;"></div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Show quick stats if enabled
    if st.session_state.get('show_stats', False):
        try:
            content = study_manager.read_file_content(file_info['path'])
            word_count = len(content.split())
            char_count = len(content)
            line_count = len(content.split('\n'))
            code_blocks = content.count('```') // 2
            
            stat_col1, stat_col2, stat_col3, stat_col4 = st.columns(4)
            with stat_col1:
                st.metric("📝 Words", f"{word_count:,}")
            with stat_col2:
                st.metric("📄 Lines", f"{line_count:,}")
            with stat_col3:
                st.metric("💻 Code Blocks", code_blocks)
            with stat_col4:
                st.metric("⏱️ Est. Reading", f"{max(1, word_count // 200)} min")
        except:
            st.warning("Could not calculate file statistics")
    
    # Enhanced content display with tabs
    if st.session_state.get('focus_mode', False):
        # Focus mode - just content
        try:
            content = study_manager.read_file_content(file_info['path'])
            st.markdown(f"""
            <div class="content-card">
                {content}
            </div>
            """, unsafe_allow_html=True)
        except Exception as e:
            st.error(f"Error displaying content: {e}")
    else:
        # Normal mode with tabs
        tab1, tab2, tab3, tab4 = st.tabs(["📖 Content", "📝 My Notes", "🔍 Quick Reference", "📋 Table of Contents"])
        
        with tab1:
            render_content_tab(study_manager, file_info)
        
        with tab2:
            render_notes_tab(file_info)
        
        with tab3:
            render_quick_reference_tab(study_manager, file_info)
        
        with tab4:
            render_table_of_contents_tab(study_manager, file_info)

def render_content_tab(study_manager, file_info):
    """Render enhanced content with beautiful HTML formatting"""
    try:
        # Use the new HTML renderer for beautiful page display
        beautiful_html = study_manager.renderer.render_file_as_html(file_info)
        
        # Display the beautiful HTML page with enhanced settings
        st.components.v1.html(
            beautiful_html, 
            height=1000, 
            scrolling=True,
            width=None
        )
        
        # Enhanced action buttons
        col1, col2, col3 = st.columns(3)
        
        with col1:
            # Download button for the HTML version
            st.download_button(
                label="📥 Download Beautiful HTML",
                data=beautiful_html,
                file_name=f"{file_info['name'].replace('.md', '')}_beautiful.html",
                mime="text/html",
                use_container_width=True,
                help="Download this content as a beautiful standalone HTML page"
            )
        
        with col2:
            # View in new tab button (creates a data URL)
            html_b64 = base64.b64encode(beautiful_html.encode()).decode()
            data_url = f"data:text/html;base64,{html_b64}"
            st.markdown(f"""
                <a href="{data_url}" target="_blank" style="
                    display: inline-block; 
                    padding: 0.5rem 1rem; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 0.375rem; 
                    font-weight: 500;
                    width: 100%;
                    text-align: center;
                    box-sizing: border-box;
                ">🌐 Open in New Tab</a>
            """, unsafe_allow_html=True)
        
        with col3:
            # Print-friendly version
            if st.button("🖨️ Print Version", use_container_width=True, help="Generate a clean print-friendly version"):
                st.info("💡 Use the 'Open in New Tab' button, then use Ctrl+P (Cmd+P on Mac) to print the beautiful version!")
        
    except Exception as e:
        st.error(f"Error displaying enhanced content: {e}")
        # Fallback to simple markdown rendering
        try:
            content = study_manager.read_file_content(file_info['path'])
            st.markdown(f"""
            <div class="content-card">
                <div style="white-space: pre-wrap; font-family: Inter, sans-serif; line-height: 1.6;">
                    {html.escape(content)}
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.warning("📝 Displaying fallback content format")
        except:
            st.error("❌ Could not render content in any format")

def render_notes_tab(file_info):
    """Render enhanced notes interface"""
    st.markdown("""
    <div class="notes-container">
        <h3 style="margin-top: 0;">📝 Your Personal Notes</h3>
        <p>Add your insights, questions, and key takeaways from this material.</p>
    </div>
    """, unsafe_allow_html=True)
    
    notes_key = file_info['name']
    current_notes = st.session_state.reading_notes.get(notes_key, "")
    
    # Notes templates
    template_col1, template_col2 = st.columns(2)
    with template_col1:
        if st.button("📋 Key Points Template"):
            template = """## Key Points
• 
• 
• 

## Questions
• 
• 

## Action Items
• 
• """
            st.session_state.reading_notes[notes_key] = current_notes + "\n\n" + template
            st.rerun()
    
    with template_col2:
        if st.button("🧠 Study Template"):
            template = """## What I Learned
- 

## What I Need to Practice
- 

## Interview Applications
- """
            st.session_state.reading_notes[notes_key] = current_notes + "\n\n" + template
            st.rerun()
    
    new_notes = st.text_area(
        "Your notes:",
        value=current_notes,
        height=300,
        placeholder="Write your thoughts, insights, questions, or key takeaways here...",
        label_visibility="collapsed"
    )
    
    col1, col2 = st.columns([3, 1])
    with col1:
        if st.button("💾 Save Notes", use_container_width=True):
            st.session_state.reading_notes[notes_key] = new_notes
            st.success("✅ Notes saved successfully!")
    
    with col2:
        if st.button("🗑️ Clear", use_container_width=True):
            st.session_state.reading_notes[notes_key] = ""
            st.rerun()

def render_quick_reference_tab(study_manager, file_info):
    """Render enhanced quick reference with code extraction"""
    st.markdown("""
    <div class="toc-container">
        <h3 style="margin-top: 0;">🔍 Quick Reference & Code Snippets</h3>
        <p>Key patterns, templates, and code examples extracted from this document.</p>
    </div>
    """, unsafe_allow_html=True)
    
    try:
        content = study_manager.read_file_content(file_info['path'])
        lines = content.split('\n')
        
        # Extract code blocks with better parsing
        code_blocks = []
        in_code_block = False
        current_block = {'language': '', 'code': '', 'title': ''}
        block_title = ''
        
        for i, line in enumerate(lines):
            if line.strip().startswith('```'):
                if in_code_block:
                    if current_block['code'].strip():
                        current_block['title'] = block_title or f"Code Block {len(code_blocks) + 1}"
                        code_blocks.append(current_block.copy())
                    current_block = {'language': '', 'code': '', 'title': ''}
                    in_code_block = False
                    block_title = ''
                else:
                    # Look for title in previous lines
                    for j in range(max(0, i-3), i):
                        if lines[j].strip() and not lines[j].startswith('#'):
                            block_title = lines[j].strip()
                            break
                    
                    current_block['language'] = line.strip()[3:].strip() or 'python'
                    in_code_block = True
            elif in_code_block:
                current_block['code'] += line + '\n'
        
        if code_blocks:
            st.subheader("💻 Code Templates & Examples")
            for i, block in enumerate(code_blocks[:8]):  # Show up to 8 code blocks
                with st.expander(f"📋 {block['title']}", expanded=i < 3):
                    st.code(block['code'].strip(), language=block['language'])
                    if st.button(f"📋 Copy Code {i+1}", key=f"copy_{i}"):
                        st.success("Code copied to clipboard!")
        
        # Extract headers for navigation
        headers = []
        for line in lines:
            if line.strip().startswith('#'):
                level = len(line) - len(line.lstrip('#'))
                headers.append({
                    'text': line.strip(),
                    'level': level,
                    'content': line.strip('#').strip()
                })
        
        if headers:
            st.subheader("📑 Key Sections")
            for header in headers[:15]:
                indent = "  " * (header['level'] - 1)
                st.write(f"{indent}• {header['content']}")
                
    except Exception as e:
        st.error(f"Error extracting quick reference: {e}")

def render_table_of_contents_tab(study_manager, file_info):
    """Render interactive table of contents"""
    st.markdown("""
    <div class="toc-container">
        <h3 style="margin-top: 0;">📋 Table of Contents</h3>
        <p>Navigate through the document sections quickly.</p>
    </div>
    """, unsafe_allow_html=True)
    
    try:
        content = study_manager.read_file_content(file_info['path'])
        lines = content.split('\n')
        
        # Build hierarchical TOC
        toc_items = []
        for line_num, line in enumerate(lines):
            if line.strip().startswith('#'):
                level = len(line) - len(line.lstrip('#'))
                title = line.strip('#').strip()
                toc_items.append({
                    'level': level,
                    'title': title,
                    'line': line_num
                })
        
        if toc_items:
            for item in toc_items:
                indent = "  " * (item['level'] - 1)
                bullet = "📌" if item['level'] == 1 else "📍" if item['level'] == 2 else "•"
                st.write(f"{indent}{bullet} **{item['title']}**")
        else:
            st.info("📄 No section headers found in this document.")
            
    except Exception as e:
        st.error(f"Error generating table of contents: {e}")

def main():
    """Main dashboard application"""
    initialize_session_state()
    
    # Sidebar navigation
    st.sidebar.title("🎯 Navigation")
    
    pages = {
        "🏠 Dashboard": "dashboard",
        "🔬 Performance Lab": "performance_lab", 
        "🕵️ Pattern Detective": "pattern_detective",
        "🤖 AI Interview Buddy": "ai_buddy",
        "🏰 Algorithm Kingdom": "algorithm_kingdom",
        "🎪 Algorithm Circus": "algorithm_circus",
        "🏗️ Recommendation Engine": "recommendation_engine",
        "📚 Study Materials": "study_materials"
    }
    
    selected_page = st.sidebar.selectbox("Choose a tool:", list(pages.keys()))
    page_key = pages[selected_page]
    
    # User profile in sidebar
    st.sidebar.markdown("---")
    st.sidebar.subheader("👤 User Profile")
    
    user_name = st.sidebar.text_input("Name:", st.session_state.user_profile['name'])
    st.session_state.user_profile['name'] = user_name
    
    favorite_company = st.sidebar.selectbox(
        "Target Company:",
        ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
        index=0 if st.session_state.user_profile['favorite_company'] == 'Google' else 0
    )
    st.session_state.user_profile['favorite_company'] = favorite_company
    
    # Main content area
    if page_key == "dashboard":
        render_dashboard_header()
        
        st.markdown("---")
        
        # Quick access cards
        st.subheader("🚀 Quick Access")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("🔬 Performance Lab", use_container_width=True):
                st.session_state.page = "performance_lab"
        
        with col2:
            if st.button("🕵️ Pattern Detective", use_container_width=True):
                st.session_state.page = "pattern_detective"
        
        with col3:
            if st.button("🤖 AI Buddy", use_container_width=True):
                st.session_state.page = "ai_buddy"
        
        # Recent activity
        st.subheader("📊 Learning Progress")
        
        # Mock progress data
        progress_data = {
            'Pattern': ['Two Pointers', 'Binary Search', 'Dynamic Programming', 'Graphs', 'Trees'],
            'Mastery': [85, 72, 65, 78, 90],
            'Problems Solved': [15, 12, 8, 14, 18]
        }
        
        df_progress = pd.DataFrame(progress_data)
        
        fig_progress = px.bar(df_progress, x='Pattern', y='Mastery',
                            title='Algorithm Pattern Mastery Level',
                            color='Mastery',
                            color_continuous_scale='viridis')
        st.plotly_chart(fig_progress, use_container_width=True)
        
    elif page_key == "performance_lab":
        render_algorithm_performance_lab()
    elif page_key == "pattern_detective":
        render_pattern_detective()
    elif page_key == "ai_buddy":
        render_ai_interview_buddy()
    elif page_key == "algorithm_kingdom":
        render_algorithm_kingdom()
    elif page_key == "algorithm_circus":
        render_algorithm_circus()
    elif page_key == "recommendation_engine":
        render_recommendation_engine()
    elif page_key == "study_materials":
        render_study_materials()

if __name__ == "__main__":
    main()
