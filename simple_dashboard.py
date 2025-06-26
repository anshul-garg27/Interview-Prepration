#!/usr/bin/env python3
"""
🚀 Simple Interactive Algorithm Dashboard - Fixed Version
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import networkx as nx
import pandas as pd
import numpy as np
import os
from pathlib import Path

# Set page config FIRST - this must be the very first Streamlit command
st.set_page_config(
    page_title="🎯 Algorithm Dashboard",
    page_icon="🚀",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .stSelectbox > div > div {
        background-color: #f0f2f6;
    }
</style>
""", unsafe_allow_html=True)

def load_markdown_files():
    """Load markdown files from the current directory"""
    try:
        current_dir = Path("/Users/a0g11b6/Desktop/Interview Prepration")
        files = {}
        
        for file_path in current_dir.glob("*.md"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    files[file_path.stem] = content
            except Exception as e:
                st.error(f"Error loading {file_path.name}: {e}")
        
        return files
    except Exception as e:
        st.error(f"Error accessing directory: {e}")
        return {}

def create_tree_visualization():
    """Create a simple tree visualization"""
    try:
        # Create a simple binary tree
        G = nx.DiGraph()
        edges = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F"), ("C", "G")]
        G.add_edges_from(edges)
        
        # Create positions
        pos = {
            "A": (0, 2),
            "B": (-1, 1), "C": (1, 1),
            "D": (-1.5, 0), "E": (-0.5, 0),
            "F": (0.5, 0), "G": (1.5, 0)
        }
        
        # Extract coordinates
        node_x = [pos[node][0] for node in G.nodes()]
        node_y = [pos[node][1] for node in G.nodes()]
        
        # Create edges
        edge_x, edge_y = [], []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
        
        # Create the plot
        fig = go.Figure()
        
        # Add edges
        fig.add_trace(go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=3, color='#888'),
            mode='lines',
            showlegend=False
        ))
        
        # Add nodes
        fig.add_trace(go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text',
            text=list(G.nodes()),
            textposition="middle center",
            marker=dict(size=40, color='#667eea', line=dict(width=2, color='white')),
            textfont=dict(size=16, color="white"),
            showlegend=False
        ))
        
        fig.update_layout(
            title="🌳 Binary Tree Visualization",
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            height=400,
            plot_bgcolor='white'
        )
        
        return fig
    except Exception as e:
        st.error(f"Error creating tree visualization: {e}")
        return None

def create_array_visualization():
    """Create array visualization"""
    try:
        array = [1, 3, 5, 7, 9, 11, 13, 15]
        colors = ['lightblue'] * len(array)
        colors[0] = '#ff6b6b'  # Left pointer
        colors[-1] = '#ff6b6b'  # Right pointer
        
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=list(range(len(array))),
            y=array,
            marker_color=colors,
            text=array,
            textposition='auto'
        ))
        
        fig.update_layout(
            title="🎯 Array Two Pointers",
            xaxis_title="Index",
            yaxis_title="Value",
            height=400
        )
        
        return fig
    except Exception as e:
        st.error(f"Error creating array visualization: {e}")
        return None

def main():
    """Main dashboard function"""
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🚀 Algorithm Learning Dashboard</h1>
        <p>Interactive visualizations for your algorithm studies</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Test if basic Streamlit works
    st.success("✅ Dashboard loaded successfully!")
    
    # Sidebar
    st.sidebar.title("📚 Modules")
    module = st.sidebar.selectbox(
        "Choose a module:",
        ["🌳 Trees", "🎯 Arrays", "📖 Study Materials", "🧪 Test"]
    )
    
    # Main content
    if module == "🌳 Trees":
        st.header("🌳 Tree Visualizations")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            tree_fig = create_tree_visualization()
            if tree_fig:
                st.plotly_chart(tree_fig, use_container_width=True)
        
        with col2:
            st.markdown("### Tree Operations")
            st.markdown("- **Preorder**: Root → Left → Right")
            st.markdown("- **Inorder**: Left → Root → Right") 
            st.markdown("- **Postorder**: Left → Right → Root")
    
    elif module == "🎯 Arrays":
        st.header("🎯 Array Algorithms")
        
        array_fig = create_array_visualization()
        if array_fig:
            st.plotly_chart(array_fig, use_container_width=True)
        
        st.markdown("### Two Pointers Technique")
        st.markdown("1. Start with left=0, right=n-1")
        st.markdown("2. Move pointers based on conditions")
        st.markdown("3. Time complexity: O(n)")
    
    elif module == "📖 Study Materials":
        st.header("📖 Your Study Materials")
        
        # Load and display markdown files
        markdown_files = load_markdown_files()
        
        if markdown_files:
            st.success(f"✅ Found {len(markdown_files)} study files!")
            
            # List all files
            st.markdown("### Available Files:")
            for i, filename in enumerate(markdown_files.keys(), 1):
                st.markdown(f"{i}. **{filename.replace('_', ' ').title()}**")
            
            # File selector
            selected_file = st.selectbox(
                "Select a file to view:",
                list(markdown_files.keys()),
                format_func=lambda x: x.replace('_', ' ').title()
            )
            
            if selected_file:
                content = markdown_files[selected_file]
                st.markdown(f"### 📚 {selected_file.replace('_', ' ').title()}")
                st.markdown(f"*File size: {len(content)} characters*")
                
                # Display first part of content
                if len(content) > 2000:
                    st.markdown("**Preview (first 2000 characters):**")
                    st.text(content[:2000] + "...")
                    
                    if st.button("Show Full Content"):
                        st.markdown(content)
                else:
                    st.markdown(content)
        else:
            st.error("❌ No markdown files found!")
            st.markdown("**Looking in:** `/Users/a0g11b6/Desktop/Interview Prepration/`")
    
    elif module == "🧪 Test":
        st.header("🧪 System Test")
        
        # Test all components
        st.markdown("### Component Tests:")
        
        # Test 1: Basic functionality
        st.markdown("**1. Basic Streamlit:** ✅ Working")
        
        # Test 2: Plotly
        try:
            fig = go.Figure(data=go.Bar(x=['A', 'B', 'C'], y=[1, 3, 2]))
            fig.update_layout(title="Test Chart")
            st.plotly_chart(fig, use_container_width=True)
            st.markdown("**2. Plotly Charts:** ✅ Working")
        except Exception as e:
            st.markdown(f"**2. Plotly Charts:** ❌ Error: {e}")
        
        # Test 3: File access
        try:
            files = load_markdown_files()
            st.markdown(f"**3. File Loading:** ✅ Found {len(files)} files")
        except Exception as e:
            st.markdown(f"**3. File Loading:** ❌ Error: {e}")
        
        # Test 4: NetworkX
        try:
            G = nx.Graph()
            G.add_edge('A', 'B')
            st.markdown("**4. NetworkX:** ✅ Working")
        except Exception as e:
            st.markdown(f"**4. NetworkX:** ❌ Error: {e}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        st.error(f"Critical error: {e}")
        st.markdown("Please check the console for detailed error messages.")
