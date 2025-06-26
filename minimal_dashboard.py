import streamlit as st
import os

# MUST be first command
st.set_page_config(page_title="Algorithm Dashboard", layout="wide")

def main():
    # Simple header
    st.title("🚀 Algorithm Learning Dashboard")
    st.write("Welcome to your interactive algorithm learning platform!")
    
    # Test basic functionality
    st.success("✅ Dashboard is working!")
    
    # Simple sidebar
    st.sidebar.title("📚 Navigation")
    page = st.sidebar.selectbox("Choose:", ["Home", "Trees", "Arrays", "Files"])
    
    if page == "Home":
        st.header("🏠 Home")
        st.write("This is your algorithm dashboard home page.")
        
        # Simple test chart
        import pandas as pd
        data = pd.DataFrame({
            'Algorithm': ['Bubble Sort', 'Quick Sort', 'Merge Sort'],
            'Complexity': [8, 6, 5]
        })
        st.bar_chart(data.set_index('Algorithm'))
        
    elif page == "Trees":
        st.header("🌳 Trees")
        st.write("Tree algorithms and visualizations")
        
        # Simple tree visualization with text
        st.code("""
        Binary Tree Example:
               A
              / \\
             B   C
            / \\ / \\
           D  E F  G
        """)
        
    elif page == "Arrays":
        st.header("🎯 Arrays")
        st.write("Array algorithms and two pointers")
        
        # Simple array visualization
        array = [1, 3, 5, 7, 9, 11, 13]
        st.write(f"Sample Array: {array}")
        
        # Interactive sliders
        left = st.slider("Left Pointer", 0, len(array)-1, 0)
        right = st.slider("Right Pointer", 0, len(array)-1, len(array)-1)
        
        if left < len(array) and right < len(array):
            st.info(f"Sum: {array[left]} + {array[right]} = {array[left] + array[right]}")
    
    elif page == "Files":
        st.header("📖 Your Study Files")
        
        # List markdown files
        try:
            md_files = [f for f in os.listdir(".") if f.endswith('.md')]
            st.write(f"Found {len(md_files)} markdown files:")
            
            for i, file in enumerate(md_files[:10], 1):  # Show first 10
                st.write(f"{i}. {file}")
                
            if md_files:
                selected = st.selectbox("View file:", md_files)
                if selected:
                    try:
                        with open(selected, 'r') as f:
                            content = f.read()
                        st.text_area("File content:", content[:2000], height=300)
                    except Exception as e:
                        st.error(f"Error reading file: {e}")
        except Exception as e:
            st.error(f"Error listing files: {e}")
    
    # Footer
    st.markdown("---")
    st.write("🎯 Simple Algorithm Dashboard")

if __name__ == "__main__":
    main()
