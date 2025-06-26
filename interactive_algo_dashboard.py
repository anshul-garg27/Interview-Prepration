#!/usr/bin/env python3
"""
🚀 Interactive Algorithm Learning Dashboard
Beautiful UI with proper visualizations for algorithms and data structures
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import networkx as nx
import pandas as pd
import numpy as np
import markdown2
import os
import re
from pathlib import Path
import json
from typing import Dict, List, Tuple, Any

# Set page config
st.set_page_config(
    page_title="🎯 Algorithm Mastery Dashboard",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for beautiful styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
    }
    
    .algorithm-card {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 5px solid #667eea;
        margin-bottom: 1rem;
    }
    
    .visualization-container {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 15px;
        margin: 1rem 0;
    }
    
    .code-container {
        background: #2d3748;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .step-by-step {
        background: #e6fffa;
        border-left: 4px solid #38b2ac;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    
    .complexity-badge {
        background: #fed7d7;
        color: #c53030;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

class AlgorithmVisualizer:
    def __init__(self):
        self.markdown_files = self.load_markdown_files()
        
    def load_markdown_files(self) -> Dict[str, str]:
        """Load all markdown files from the current directory"""
        files = {}
        current_dir = Path("/Users/a0g11b6/Desktop/Interview Prepration")
        
        # Debug: Print the directory we're looking in
        print(f"Looking for markdown files in: {current_dir}")
        
        for file_path in current_dir.glob("*.md"):
            try:
                print(f"Found markdown file: {file_path}")
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    files[file_path.stem] = content
                    print(f"Loaded {file_path.stem} ({len(content)} characters)")
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
                st.error(f"Error loading {file_path}: {e}")
        
        print(f"Total files loaded: {len(files)}")
        return files
    
    def create_tree_visualization(self, tree_data: List[Tuple[str, str]] = None):
        """Create an interactive tree visualization"""
        if tree_data is None:
            # Default binary tree example
            tree_data = [
                ("A", ""),  # root
                ("B", "A"), ("C", "A"),
                ("D", "B"), ("E", "B"), ("F", "C"),
                ("G", "D"), ("H", "D")
            ]
        
        # Create graph
        G = nx.DiGraph()
        
        # Add nodes and edges
        for node, parent in tree_data:
            G.add_node(node)
            if parent:
                G.add_edge(parent, node)
        
        # Create hierarchical layout
        pos = self.hierarchy_pos(G, "A")
        
        # Extract positions
        node_x = [pos[node][0] for node in G.nodes()]
        node_y = [pos[node][1] for node in G.nodes()]
        
        # Create edges
        edge_x = []
        edge_y = []
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
            line=dict(width=3, color='#666'),
            hoverinfo='none',
            mode='lines',
            name='Edges'
        ))
        
        # Add nodes
        fig.add_trace(go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text',
            text=list(G.nodes()),
            textposition="middle center",
            textfont=dict(size=16, color="white"),
            marker=dict(
                size=40,
                color='#667eea',
                line=dict(width=3, color='white')
            ),
            hovertemplate='Node: %{text}<extra></extra>',
            name='Nodes'
        ))
        
        fig.update_layout(
            title="🌳 Interactive Binary Tree Visualization",
            showlegend=False,
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            plot_bgcolor='white',
            height=500
        )
        
        return fig
    
    def hierarchy_pos(self, G, root, width=1., vert_gap=0.2, vert_loc=0, xcenter=0.5):
        """Create hierarchical layout for tree"""
        pos = self._hierarchy_pos(G, root, width, vert_gap, vert_loc, xcenter)
        return pos
    
    def _hierarchy_pos(self, G, root, width=1., vert_gap=0.2, vert_loc=0, xcenter=0.5, pos=None, parent=None, parsed=[]):
        if pos is None:
            pos = {root: (xcenter, vert_loc)}
        else:
            pos[root] = (xcenter, vert_loc)
        
        children = list(G.neighbors(root))
        if not isinstance(G, nx.DiGraph) and parent is not None:
            children.remove(parent)
        
        if len(children) != 0:
            dx = width / len(children)
            nextx = xcenter - width / 2 - dx / 2
            for child in children:
                nextx += dx
                pos = self._hierarchy_pos(G, child, width=dx, vert_gap=vert_gap,
                                        vert_loc=vert_loc - vert_gap, xcenter=nextx,
                                        pos=pos, parent=root, parsed=parsed)
        return pos
    
    def create_array_visualization(self, array_data: List[int] = None, highlight_indices: List[int] = None):
        """Create an interactive array visualization with two pointers"""
        if array_data is None:
            array_data = [1, 3, 5, 7, 9, 11, 13, 15]
        
        if highlight_indices is None:
            highlight_indices = [0, len(array_data) - 1]  # Two pointers
        
        colors = ['lightblue'] * len(array_data)
        for i in highlight_indices:
            if i < len(colors):
                colors[i] = '#ff6b6b'
        
        fig = go.Figure()
        
        # Add array elements
        fig.add_trace(go.Bar(
            x=list(range(len(array_data))),
            y=array_data,
            marker_color=colors,
            text=array_data,
            textposition='auto',
            name='Array Elements',
            hovertemplate='Index: %{x}<br>Value: %{y}<extra></extra>'
        ))
        
        # Add pointer annotations
        for i, idx in enumerate(highlight_indices):
            if idx < len(array_data):
                pointer_name = f"Pointer {i+1}" if len(highlight_indices) > 1 else "Pointer"
                fig.add_annotation(
                    x=idx,
                    y=array_data[idx] + max(array_data) * 0.1,
                    text=f"👆 {pointer_name}",
                    showarrow=True,
                    arrowhead=2,
                    arrowcolor='red',
                    font=dict(size=14, color='red')
                )
        
        fig.update_layout(
            title="🎯 Array Two Pointers Visualization",
            xaxis_title="Index",
            yaxis_title="Value",
            plot_bgcolor='white',
            height=400,
            showlegend=False
        )
        
        return fig
    
    def create_graph_visualization(self, edges: List[Tuple[str, str]] = None):
        """Create an interactive graph visualization"""
        if edges is None:
            edges = [
                ("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"),
                ("D", "E"), ("C", "F"), ("E", "F")
            ]
        
        G = nx.Graph()
        G.add_edges_from(edges)
        
        # Use spring layout for better visualization
        pos = nx.spring_layout(G, seed=42)
        
        # Extract positions
        node_x = [pos[node][0] for node in G.nodes()]
        node_y = [pos[node][1] for node in G.nodes()]
        
        # Create edges
        edge_x = []
        edge_y = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
        
        fig = go.Figure()
        
        # Add edges
        fig.add_trace(go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=2, color='#888'),
            hoverinfo='none',
            mode='lines',
            name='Edges'
        ))
        
        # Add nodes
        fig.add_trace(go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text',
            text=list(G.nodes()),
            textposition="middle center",
            textfont=dict(size=14, color="white"),
            marker=dict(
                size=35,
                color='#764ba2',
                line=dict(width=2, color='white')
            ),
            hovertemplate='Node: %{text}<br>Degree: %{customdata}<extra></extra>',
            customdata=[G.degree(node) for node in G.nodes()],
            name='Nodes'
        ))
        
        fig.update_layout(
            title="🌐 Interactive Graph Visualization",
            showlegend=False,
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            plot_bgcolor='white',
            height=500
        )
        
        return fig
    
    def create_sorting_animation(self, algorithm: str = "bubble_sort"):
        """Create sorting algorithm visualization"""
        data = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42]
        
        if algorithm == "bubble_sort":
            steps = self.bubble_sort_steps(data.copy())
        else:
            steps = [data]
        
        # Create animated bar chart
        fig = go.Figure()
        
        for i, step in enumerate(steps):
            fig.add_trace(go.Bar(
                x=list(range(len(step))),
                y=step,
                name=f"Step {i}",
                visible=(i == 0),
                marker_color='lightblue',
                text=step,
                textposition='auto'
            ))
        
        # Create animation buttons
        steps_animation = []
        for i in range(len(steps)):
            step = dict(
                method="update",
                args=[{"visible": [False] * len(steps)}],
                label=f"Step {i}"
            )
            step["args"][0]["visible"][i] = True
            steps_animation.append(step)
        
        sliders = [dict(
            active=0,
            currentvalue={"prefix": "Step: "},
            pad={"t": 50},
            steps=steps_animation
        )]
        
        fig.update_layout(
            title=f"🔄 {algorithm.replace('_', ' ').title()} Animation",
            sliders=sliders,
            height=400
        )
        
        return fig
    
    def bubble_sort_steps(self, arr):
        """Generate steps for bubble sort visualization"""
        steps = [arr.copy()]
        n = len(arr)
        
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    steps.append(arr.copy())
        
        return steps
    
    def create_complexity_chart(self):
        """Create time complexity comparison chart"""
        algorithms = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)']
        n_values = [1, 10, 100, 1000]
        
        complexity_data = []
        for n in n_values:
            row = {
                'n': n,
                'O(1)': 1,
                'O(log n)': np.log2(n) if n > 0 else 0,
                'O(n)': n,
                'O(n log n)': n * np.log2(n) if n > 0 else 0,
                'O(n²)': n ** 2,
                'O(2ⁿ)': min(2 ** n, 1000000)  # Cap for visualization
            }
            complexity_data.append(row)
        
        df = pd.DataFrame(complexity_data)
        
        fig = go.Figure()
        
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']
        
        for i, algo in enumerate(algorithms):
            fig.add_trace(go.Scatter(
                x=df['n'],
                y=df[algo],
                mode='lines+markers',
                name=algo,
                line=dict(color=colors[i], width=3),
                marker=dict(size=8)
            ))
        
        fig.update_layout(
            title="📊 Algorithm Time Complexity Comparison",
            xaxis_title="Input Size (n)",
            yaxis_title="Operations",
            yaxis_type="log",
            height=500,
            hovermode='x unified'
        )
        
        return fig

def main():
    """Main dashboard application"""
    
    # Initialize visualizer
    viz = AlgorithmVisualizer()
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🚀 Algorithm Mastery Dashboard</h1>
        <p>Interactive visualizations for data structures and algorithms</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar for navigation
    st.sidebar.title("📚 Learning Modules")
    
    modules = {
        "🎯 Two Sum Mastery": "two_sum",
        "🌳 Trees": "trees",
        "🎯 Arrays & Two Pointers": "arrays",
        "🌐 Graphs": "graphs",
        "🔄 Sorting Algorithms": "sorting",
        "📊 Complexity Analysis": "complexity",
        "📖 Study Materials": "materials"
    }
    
    selected_module = st.sidebar.selectbox(
        "Choose a module:",
        list(modules.keys())
    )
    
    module_key = modules[selected_module]
    
    # Main content based on selected module
    if module_key == "trees":
        st.markdown("## 🌳 Tree Data Structures")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("### Interactive Binary Tree")
            tree_fig = viz.create_tree_visualization()
            st.plotly_chart(tree_fig, use_container_width=True)
        
        with col2:
            st.markdown("### Tree Operations")
            st.markdown("""
            <div class="algorithm-card">
                <h4>🔍 Tree Traversals</h4>
                <p><strong>Preorder:</strong> Root → Left → Right</p>
                <p><strong>Inorder:</strong> Left → Root → Right</p>
                <p><strong>Postorder:</strong> Left → Right → Root</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("""
            <div class="algorithm-card">
                <h4>⚡ Complexity</h4>
                <p><span class="complexity-badge">Time: O(n)</span></p>
                <p><span class="complexity-badge">Space: O(h)</span></p>
                <p><small>h = height of tree</small></p>
            </div>
            """, unsafe_allow_html=True)
    
    elif module_key == "arrays":
        st.markdown("## 🎯 Arrays & Two Pointers")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("### Two Pointers Technique")
            
            # Interactive controls
            st.markdown("#### Customize the array:")
            array_input = st.text_input("Enter array (comma-separated):", "1,3,5,7,9,11,13,15")
            try:
                custom_array = [int(x.strip()) for x in array_input.split(',')]
                left_ptr = st.slider("Left Pointer", 0, len(custom_array)-1, 0)
                right_ptr = st.slider("Right Pointer", 0, len(custom_array)-1, len(custom_array)-1)
                
                array_fig = viz.create_array_visualization(custom_array, [left_ptr, right_ptr])
                st.plotly_chart(array_fig, use_container_width=True)
                
                # Show current sum
                if left_ptr < len(custom_array) and right_ptr < len(custom_array):
                    current_sum = custom_array[left_ptr] + custom_array[right_ptr]
                    st.info(f"Current sum: {custom_array[left_ptr]} + {custom_array[right_ptr]} = {current_sum}")
                
            except ValueError:
                st.error("Please enter valid numbers separated by commas")
        
        with col2:
            st.markdown("### Algorithm Steps")
            st.markdown("""
            <div class="step-by-step">
                <h4>🎯 Two Pointers Strategy</h4>
                <ol>
                    <li>Start with left=0, right=n-1</li>
                    <li>Calculate current sum</li>
                    <li>If sum < target: left++</li>
                    <li>If sum > target: right--</li>
                    <li>If sum == target: found!</li>
                </ol>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("""
            <div class="algorithm-card">
                <h4>⚡ Complexity</h4>
                <p><span class="complexity-badge">Time: O(n)</span></p>
                <p><span class="complexity-badge">Space: O(1)</span></p>
            </div>
            """, unsafe_allow_html=True)
    
    elif module_key == "graphs":
        st.markdown("## 🌐 Graph Data Structures")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("### Interactive Graph")
            graph_fig = viz.create_graph_visualization()
            st.plotly_chart(graph_fig, use_container_width=True)
        
        with col2:
            st.markdown("### Graph Algorithms")
            st.markdown("""
            <div class="algorithm-card">
                <h4>🔍 Graph Traversals</h4>
                <p><strong>BFS:</strong> Level by level exploration</p>
                <p><strong>DFS:</strong> Go deep, then backtrack</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("""
            <div class="algorithm-card">
                <h4>🛣️ Shortest Path</h4>
                <p><strong>Dijkstra:</strong> Weighted graphs</p>
                <p><strong>BFS:</strong> Unweighted graphs</p>
            </div>
            """, unsafe_allow_html=True)
    
    elif module_key == "sorting":
        st.markdown("## 🔄 Sorting Algorithms")
        
        sorting_fig = viz.create_sorting_animation()
        st.plotly_chart(sorting_fig, use_container_width=True)
        
        st.markdown("### How Bubble Sort Works")
        st.markdown("""
        <div class="step-by-step">
            <p>Bubble sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. 
            Use the slider above to see each step of the sorting process!</p>
        </div>
        """, unsafe_allow_html=True)
    
    elif module_key == "complexity":
        st.markdown("## 📊 Algorithm Complexity Analysis")
        
        complexity_fig = viz.create_complexity_chart()
        st.plotly_chart(complexity_fig, use_container_width=True)
        
        st.markdown("### Understanding Big O Notation")
        st.markdown("""
        <div class="algorithm-card">
            <h4>📈 Growth Rates</h4>
            <p><strong>O(1):</strong> Constant - Always the same time</p>
            <p><strong>O(log n):</strong> Logarithmic - Binary search</p>
            <p><strong>O(n):</strong> Linear - Simple loop</p>
            <p><strong>O(n log n):</strong> Linearithmic - Merge sort</p>
            <p><strong>O(n²):</strong> Quadratic - Nested loops</p>
            <p><strong>O(2ⁿ):</strong> Exponential - Avoid if possible!</p>
        </div>
        """, unsafe_allow_html=True)
    
    elif module_key == "materials":
        st.markdown("## 📖 Study Materials")
        
        # Debug information
        st.info(f"Found {len(viz.markdown_files)} markdown files")
        
        if viz.markdown_files:
            # Show available files
            st.markdown("### Available Study Guides:")
            for i, filename in enumerate(viz.markdown_files.keys(), 1):
                st.markdown(f"{i}. **{filename.replace('_', ' ').title()}**")
            
            selected_file = st.selectbox(
                "Choose a study guide:",
                list(viz.markdown_files.keys()),
                format_func=lambda x: x.replace('_', ' ').title()
            )
            
            if selected_file:
                content = viz.markdown_files[selected_file]
                st.markdown(f"### 📚 {selected_file.replace('_', ' ').title()}")
                
                # Show content length
                st.caption(f"Content length: {len(content)} characters")
                
                # Convert markdown to HTML with better formatting
                html_content = markdown2.markdown(
                    content, 
                    extras=['fenced-code-blocks', 'tables', 'code-friendly', 'cuddled-lists']
                )
                
                # Display in a container
                with st.container():
                    st.markdown(html_content, unsafe_allow_html=True)
        else:
            st.error("❌ No markdown files found!")
            st.markdown("**Debug Info:**")
            st.code(f"Looking in directory: /Users/a0g11b6/Desktop/Interview Prepration")
            st.markdown("Make sure your .md files are in the correct directory.")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666; margin-top: 2rem;">
        <p>🚀 Built with Streamlit & Plotly | Make algorithms visual and fun! 🎯</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
