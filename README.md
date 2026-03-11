<div align="center">

# 🧠 ResumeIQ

### AI-Driven Resume Intelligence with Hybrid RAG

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React_Native-Expo-0EA5E9?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Ollama](https://img.shields.io/badge/Ollama-Mistral_7B-black?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

**ResumeIQ** transforms static resumes into actionable career insights using a Hybrid RAG pipeline with fully local LLM inference — no external API calls, no data leakage.

</div>

---

## ✨ What Makes This Different

> Most resume tools do simple keyword matching. ResumeIQ uses a **Hybrid Retrieval-Augmented Generation** pipeline to reason about your resume the way a senior recruiter would.

| Feature | Traditional ATS | ResumeIQ |
|---|---|---|
| Analysis method | Keyword matching | Semantic + BM25 hybrid retrieval |
| Feedback depth | Score only | Structural flaws, skill gaps, rewrites |
| Privacy | Cloud LLM | 100% local via Ollama |
| Interface | Web only | Mobile-first (React Native) |

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    React Native (Expo)                       │
│         Upload · History · AI Feedback Display               │
└───────────────────────┬─────────────────────────────────────┘
                        │ JWT Auth
┌───────────────────────▼─────────────────────────────────────┐
│                  Spring Boot API :8080                        │
│         Auth · Resume Metadata · ATS Scoring                 │
└───────────┬───────────────────────────┬─────────────────────┘
            │ Store                     │ Analyze
┌───────────▼──────────┐   ┌───────────▼─────────────────────┐
│  Supabase            │   │  FastAPI RAG Service :8001        │
│  · Storage (PDFs)    │   │  · PDF Extraction                 │
│  · PostgreSQL        │   │  · Chunking & Embedding           │
└──────────────────────┘   │  · Hybrid Retrieval               │
                           │  · Reranking                      │
                           │  · Mistral-7B (Ollama)            │
                           └──────────────────────────────────┘
```

---

## 🧠 RAG Pipeline
```
Resume PDF
    │
    ▼
PDF Text Extraction
    │
    ▼
Parent–Child Chunking
    │
    ├──────────────────────────────┐
    ▼                              ▼
Vector Embeddings              BM25 Index
(Sentence Transformers)        (Keyword)
    │                              │
    └──────────┬───────────────────┘
               ▼
        Hybrid Retrieval
               │
               ▼
          Reranking
               │
               ▼
      Context Construction
               │
               ▼
     Mistral-7B via Ollama
               │
               ▼
     Structured Resume Feedback
```

---

## 🚀 Quick Start

The system runs as **three services simultaneously**. Open three terminal windows.

### Prerequisites

- Python 3.10+
- Java 17+ & Maven
- Node.js 18+
- [Ollama](https://ollama.com) installed and running with Mistral-7B
```bash
# Pull the model before starting
ollama pull mistral
```

---

### 1️⃣ AI Service (FastAPI + RAG)
```bash
cd rag_core

# Install dependencies
pip install -r requirements.txt

# Start the RAG service
python -m uvicorn rag_api:app --reload --port 8001
```

> ✅ Running at `http://localhost:8001`

---

### 2️⃣ Backend (Spring Boot)
```bash
cd SpringBoot/hello

# Run the backend
mvn spring-boot:run
```

> ✅ Running at `http://localhost:8080`

---

### 3️⃣ Mobile App (React Native + Expo)
```bash
cd Front/mineapp

# Install dependencies
npm install

# Start Expo
npx expo start
```

> ✅ Scan the QR code with the **Expo Go** app on your phone, or press `w` for web.

---

## 📂 Project Structure
```
resumeiq/
│
├── Front/
│   └── mineapp/
│       ├── src/app/          # Screens & navigation
│       ├── src/services/     # API calls
│       └── assets/           # Images & fonts
│
├── SpringBoot/
│   └── hello/
│       ├── controller/       # REST endpoints
│       ├── service/          # Business logic
│       ├── repository/       # DB access layer
│       └── security/         # JWT config
│
├── rag_core/
│   ├── chunker.py            # Parent-child chunking
│   ├── embedder.py           # Sentence Transformer embeddings
│   ├── retriever.py          # Vector similarity search
│   ├── hybrid.py             # BM25 + vector hybrid ranking
│   ├── reranker.py           # Cross-encoder reranking
│   ├── generator.py          # LLM prompt & response
│   └── rag_api.py            # FastAPI entrypoint
│
└── README.md
```

---

## 🔐 Authentication Flow
```
User Login
    │
    ▼
Spring Boot validates credentials
    │
    ▼
JWT token generated & returned
    │
    ▼
Token stored in mobile app
    │
    ▼
Token attached to all API requests (Authorization: Bearer <token>)
```

---

## 🤖 Example AI Output

Given a resume, the system produces structured feedback like:
```
📋 RESUME ANALYSIS REPORT
─────────────────────────────────────────

⚠️  Structural Issues
  • Missing professional summary section
  • Bullet points lack action verbs and metrics

🔧  Missing Skills Detected
  • Cloud platforms (AWS / GCP / Azure)
  • CI/CD tooling (GitHub Actions, Jenkins)
  • Containerization (Docker, Kubernetes)

✅  Improvement Suggestions
  • Quantify achievements: "Reduced load time by 40%"
  • Add links to GitHub projects or live demos
  • Tailor the skills section to match job descriptions

📊  ATS Compatibility Score: 67 / 100
```

---

## 🔒 Privacy First

Unlike cloud-based resume tools, **ResumeIQ never sends your resume to an external AI API**.

- 🏠 Mistral-7B runs **fully locally** via Ollama
- 📄 PDFs are stored only in **your own Supabase instance**
- 🔑 All authentication is handled by **your own Spring Boot backend**

---

## 📌 Roadmap

- [ ] Job description matching & tailored resume rewriting
- [ ] Skill gap detection against live job postings
- [ ] AI-generated interview question preparation
- [ ] Persistent vector database (ChromaDB / Weaviate)
- [ ] Cloud deployment (Docker Compose / Railway)
- [ ] Resume version comparison

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native + Expo |
| Backend API | Spring Boot 3.x |
| AI / RAG Service | FastAPI + LangChain |
| LLM | Mistral-7B via Ollama |
| Embeddings | Sentence Transformers |
| Keyword Retrieval | BM25 |
| Database | PostgreSQL (Supabase) |
| File Storage | Supabase Storage |
| Auth | JWT |

---

## 👨‍💻 Suchet Amaljari

Built to demonstrate a production-grade AI system combining:
**Mobile Development · Backend Microservices · Hybrid RAG · Local LLM Inference**

---

<div align="center">

⭐ **Star this repo if you found it useful!**

</div>
