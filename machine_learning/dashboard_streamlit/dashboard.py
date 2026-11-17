import streamlit as st
import pandas as pd
from PIL import Image
from streamlit_option_menu import option_menu

st.set_page_config(
    page_title="BilahBeuAI Dashboard",
    page_icon="🌿",
    layout="wide"
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.main, [data-testid="stAppViewContainer"], [data-testid="stHeader"] {
    background-color: #061809 !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

[data-testid="stSidebar"] {
    background-color: #030f06 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.03) !important;
}

[data-testid="stSidebarNav"] {
    display: none !important;
}

.main-title {
    font-size: 42px;
    font-weight: 800;
    color: #ffffff !important;
    letter-spacing: -1px;
    margin-bottom: 5px;
}

.subtitle {
    font-size: 18px;
    color: #8bb38f !important;
    font-weight: 400;
    margin-bottom: 30px;
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff !important;
    margin-top: 30px;
    margin-bottom: 15px;
}

.metric-card {
    background-color: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(139, 179, 143, 0.15) !important;
    padding: 24px;
    border-radius: 18px;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    transition: all 0.3s ease;
}

.metric-card:hover {
    border-color: rgba(139, 179, 143, 0.4) !important;
    box-shadow: 0px 8px 30px rgba(139, 179, 143, 0.05);
}

.metric-value {
    font-size: 38px;
    font-weight: 800;
    color: #ffffff !important;
    line-height: 1.2;
}

.metric-label {
    font-size: 15px;
    font-weight: 500;
    color: #8bb38f !important;
    margin-top: 4px;
}

.stImage img {
    border-radius: 14px !important;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.sample-card {
    background-color: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(139, 179, 143, 0.1) !important;
    padding: 16px;
    border-radius: 18px;
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    text-align: center;
}

.sample-card:hover {
    border-color: rgba(139, 179, 143, 0.3) !important;
    transform: translateY(-2px);
}

.sample-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff !important;
    margin-top: 12px;
    letter-spacing: 0.3px;
}

[data-testid="stDataFrame"] {
    background-color: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(139, 179, 143, 0.1) !important;
    border-radius: 12px;
    overflow: hidden;
    padding: 8px;
}

.project-card {
    background-color: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(139, 179, 143, 0.15) !important;
    padding: 30px;
    border-radius: 18px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
}

.project-card h3 {
    color: #ffffff !important;
    font-weight: 700;
    margin-top: 0;
}

.project-card p, .project-card li {
    color: #b8d4bb !important;
    line-height: 1.7;
}

.footer {
    text-align: center;
    color: #537557;
    margin-top: 60px;
    font-size: 14px;
}
</style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("<h3 style='color: #ffffff; font-weight: 700; margin-top:10px; margin-bottom: 25px; letter-spacing: -0.5px;'>🌿 BilahBeu AI</h3>", unsafe_allow_html=True)
    
    menu_select = option_menu(
        menu_title=None,
        options=["Data Summary", "Exploratory Data Analysis", "Business Questions"],
        icons=["box", "bar-chart", "question-circle"],
        menu_icon="cast",
        default_index=0,
        styles={
            "container": {"padding": "0px !important", "background-color": "transparent"},
            "icon": {"color": "#8bb38f", "font-size": "15px"}, 
            "nav-link": {
                "font-size": "14px", 
                "text-align": "left", 
                "margin": "0px 0px 8px 0px", 
                "color": "#8bb38f",
                "background-color": "rgba(255, 255, 255, 0.03)",
                "border-radius": "12px",
                "font-weight": "500",
                "padding": "12px 16px"
            },
            "nav-link-selected": {
                "background-color": "#ffffff", 
                "color": "#061809", 
                "font-weight": "700",
                "box-shadow": "0px 8px 24px rgba(0, 0, 0, 0.4)"
            }
        }
    )
    
    if menu_select == "Exploratory Data Analysis":
        st.switch_page("pages/EDA.py")
    elif menu_select == "Business Questions":
        st.switch_page("pages/Business_Questions.py")

summary_df = pd.read_csv("data/summary_stats.csv")
summary_df.columns = summary_df.columns.str.strip()
distribusi_df = pd.read_csv("data/distribusi.csv")

total_data = summary_df.loc[summary_df["Metric"] == "Total Data", "Value"].values[0]
jumlah_kelas = summary_df.loc[summary_df["Metric"] == "Jumlah Kelas", "Value"].values[0]
jumlah_kategori = summary_df.loc[summary_df["Metric"] == "Jumlah Kategori", "Value"].values[0]

col1, col2 = st.columns([1, 4])
with col1:
    logo = Image.open("assets/logo.png")
    st.image(logo, width=170)
with col2:
    st.markdown('<div class="main-title">🌿 BilahBeuAI Dashboard</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Dashboard Analisis Visual Dataset Klasifikasi Sampah Rumah Tangga Berbasis AI </div>', unsafe_allow_html=True)

st.divider()

st.markdown('<div class="section-title">📊 Statistik Dataset</div>', unsafe_allow_html=True)
col1, col2, col3 = st.columns(3)
with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{total_data}</div>
        <div class="metric-label">Total Data</div>
    </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{jumlah_kelas}</div>
        <div class="metric-label">Jumlah Kelas</div>
    </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{jumlah_kategori}</div>
        <div class="metric-label">Jumlah Kategori</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

st.markdown('<div class="section-title">📈 Distribusi Dataset</div>', unsafe_allow_html=True)
st.image("charts/eda/distribusi_data.png", use_container_width=True)
st.dataframe(distribusi_df, use_container_width=True)

st.divider()

st.markdown('<div class="section-title">🖼️ Contoh Dataset</div>', unsafe_allow_html=True)
img1, img2, img3 = st.columns(3)
with img1:
    st.markdown('<div class="sample-card">', unsafe_allow_html=True)
    st.image("assets/sample_organik.jpg", use_container_width=True)
    st.markdown('<div class="sample-title">🍂 Sampah Organik</div></div>', unsafe_allow_html=True)
with img2:
    st.markdown('<div class="sample-card">', unsafe_allow_html=True)
    st.image("assets/sample_anorganik.jpg", use_container_width=True)
    st.markdown('<div class="sample-title">🍾 Sampah Anorganik</div></div>', unsafe_allow_html=True)
with img3:
    st.markdown('<div class="sample-card">', unsafe_allow_html=True)
    st.image("assets/sample_b3.jpg", use_container_width=True)
    st.markdown('<div class="sample-title">⚠️ Sampah B3</div></div>', unsafe_allow_html=True)

st.divider()

st.markdown('<div class="section-title">📌 Overview Project</div>', unsafe_allow_html=True)
st.markdown("""
<div class="project-card">
    <h3>🌱 Tentang Project</h3>
    <p>Project ini bertujuan untuk melakukan analisis visual terhadap dataset klasifikasi sampah menggunakan pendekatan Computer Vision dan Exploratory Data Analysis (EDA).</p>
    <p>Analisis dilakukan terhadap beberapa karakteristik visual utama seperti:</p>
    <ul>
        <li>Brightness (tingkat kecerahan)</li>
        <li>Edge / tekstur visual</li>
        <li>Dominant color</li>
        <li>Distribusi dataset</li>
    </ul>
    <p>Dashboard ini digunakan untuk membantu memahami kualitas dataset serta mendukung pengembangan model klasifikasi sampah berbasis AI.</p>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="footer">
🌿 BilahBeuAI Dashboard
</div>
""", unsafe_allow_html=True)