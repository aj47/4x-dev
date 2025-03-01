import streamlit as st
import os
from dotenv import load_dotenv
from openai import OpenAI
import time
import streamlit.components.v1 as components

# Load environment variables from .env file (if any)
load_dotenv()

# Configure page settings
st.set_page_config(
    page_title="5xDev - Generate Multiple Web Apps",
    page_icon="🧪",
    layout="wide",
)

# Add custom CSS
st.markdown("""
<style>
.app-container {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
}
.code-box {
    border-radius: 8px;
    border: 1px solid #ddd;
    overflow: auto;
    max-height: 300px;
}
.stButton button {
    width: 100%;
}
h1, h2, h3 {
    color: #1E88E5;
}
</style>
""", unsafe_allow_html=True)

# Set Groq API key
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    st.warning("⚠️ GROQ_API_KEY environment variable not found. Please set it to use this app.")

def generate_web_app(prompt, variation_prompt=""):
    """Generate web app code using Groq API via OpenAI client"""
    try:
        # Initialize OpenAI client with Groq's base URL
        client = OpenAI(
            api_key=groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )
        
        full_prompt = f"""Create a simple, self-contained web application based on this prompt: 
        {prompt} 
        {variation_prompt}
        
        The code should be complete and runnable as a single HTML file.
        Focus on creating a working prototype that demonstrates the core functionality.
        Use modern web technologies and best practices.
        Include all necessary CSS and JavaScript directly in the HTML file.
        Make sure all functionality works when rendered in an iframe.
        Keep the code concise but include helpful comments.
        Return ONLY the code without explanations.
        """
        
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": full_prompt}],
            temperature=0.7,
            max_tokens=2048
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating code: {str(e)}"

# App title and description
st.title("🧪 5xDev - Web App Generator")
st.markdown("""
Generate four different web applications from a single prompt using Groq's LLama3-70B model.
Enter your idea below and see what gets created!
""")

# Initialize session state
if "user_prompt" not in st.session_state:
    st.session_state.user_prompt = ""

# User input
with st.form(key="app_form"):
    user_prompt = st.text_area(
        "What web app do you want to create?",
        placeholder="E.g., A to-do list app with local storage and dark mode",
        height=80,
        key="user_prompt"
    )
    
    submit_button = st.form_submit_button(label="🚀 Generate 4 Web Apps")

# Generate apps on form submission
if submit_button and user_prompt and groq_api_key:
    with st.spinner("🔮 Generating your web applications..."):
        # Create variations to get different results
        variations = [
            "",
            "Make it visually appealing and use a different framework than the other versions.",
            "Focus on simplicity and performance. Use minimal dependencies.",
            "Add some creative features that might not be explicitly mentioned in the prompt."
        ]
        
        # Generate 4 different web apps
        results = []
        for i, variation in enumerate(variations):
            with st.status(f"Generating app {i+1}/4..."):
                app_code = generate_web_app(user_prompt, variation)
                results.append(app_code)
                time.sleep(0.5)  # Small delay for better UX
    
    # Display the results in a 2x2 grid
    st.subheader("📊 Generated Web Apps")
        
    # First row
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("<div class='app-container'>", unsafe_allow_html=True)
        st.markdown("### App 1 - Standard Version")
        with st.expander("View Code", expanded=False):
            st.code(results[0], language="html")
            
        # Render the actual web app
        st.markdown("#### Live Preview")
        components.html(results[0], height=400, scrolling=True)
        st.markdown("</div>", unsafe_allow_html=True)
            
    with col2:
        st.markdown("<div class='app-container'>", unsafe_allow_html=True)
        st.markdown("### App 2 - Visual Focus")
        with st.expander("View Code", expanded=False):
            st.code(results[1], language="html")
            
        # Render the actual web app
        st.markdown("#### Live Preview")
        components.html(results[1], height=400, scrolling=True)
        st.markdown("</div>", unsafe_allow_html=True)
            
    # Second row
    col3, col4 = st.columns(2)
    with col3:
        st.markdown("<div class='app-container'>", unsafe_allow_html=True)
        st.markdown("### App 3 - Minimalist Version")
        with st.expander("View Code", expanded=False):
            st.code(results[2], language="html")
            
        # Render the actual web app
        st.markdown("#### Live Preview")
        components.html(results[2], height=400, scrolling=True)
        st.markdown("</div>", unsafe_allow_html=True)
            
    with col4:
        st.markdown("<div class='app-container'>", unsafe_allow_html=True)
        st.markdown("### App 4 - Creative Approach")
        with st.expander("View Code", expanded=False):
            st.code(results[3], language="html")
            
        # Render the actual web app
        st.markdown("#### Live Preview")
        components.html(results[3], height=400, scrolling=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    st.success("✅ All applications generated successfully!")
    
    st.markdown("""
    ### 💡 Next Steps
    - Try out the live previews above
    - Click "View Code" to see and copy the code you like best
    """)
elif submit_button and not groq_api_key:
    st.error("Please set your GROQ_API_KEY environment variable to use this app.")
elif submit_button and not user_prompt:
    st.warning("Please enter a prompt to generate web applications.")

# Footer
st.markdown("---")
st.markdown("Made with ❤️ using Streamlit and Groq's LLama3-70B")
