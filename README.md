# 📄 ResumeAI

AI-powered Resume Builder that enhances user information with **Ollama (phi3:mini)**, renders it with **Thymeleaf templates**, and generates professional PDFs via a **Puppeteer microservice**.

---

## ✨ Features
- 🔑 Authentication with **Google, GitHub, LinkedIn, and Credentials Login**  
- 📝 Collects user info: profile, skills, projects, education, and work experience  
- 🧠 Enhances and refines text using **Ollama (phi3:mini)**  
- ✏️ Allows users to edit before previewing the resume  
- 🎨 Renders resume using **Thymeleaf templates**  
- 📄 Generates professional **PDFs** with Puppeteer  

---

## ⚙️ Tech Stack
- **Backend:** Java 17, Spring Boot, Thymeleaf, PostgreSQL, JPA  
- **Frontend:** Next.js (React), TailwindCSS, NextAuth (OAuth + credentials)  
- **AI Model:** Ollama (`phi3:mini`)  
- **PDF Service:** Node.js, Puppeteer  

---

## 🔄 How It Works
1. User logs in via **OAuth (Google/GitHub/LinkedIn)** or credentials.  
2. User enters resume details (skills, projects, education, work experience).  
3. Data is refined with **Ollama (phi3:mini)** for professional phrasing.  
4. User can **review and edit** the enhanced content.  
5. Resume is rendered into **HTML with Thymeleaf templates** for preview.  
6. On export, the rendered HTML is sent to the **Puppeteer service** to generate a PDF.  
7. User downloads the **AI-enhanced professional resume**.  

---
