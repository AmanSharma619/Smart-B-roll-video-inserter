# Smart B-Roll Video Inserter 🎬

Smart B-Roll Video Inserter is a full-stack application that automatically inserts relevant **B-roll clips** into an **A-roll video** using AI-based context understanding and video processing.

The system analyzes:

* **A-roll video (with audio)** to understand spoken context
* **B-roll videos (audio-less)** to understand visual context
  and intelligently generates a **timeline** to insert the most relevant B-roll clips.

---

## 🚀 Features

* 🎙️ Speech-to-text transcription using Python (Whisper)
* 🖼️ Visual context extraction for audio-less B-rolls using Gemini
* 🧠 AI-based timeline planning using Groq
* ⚙️ Node.js + Express + Python backend
* ⚡ Vite-powered frontend

---

## 🗂️ Project Structure

```
Smart B-roll video inserter/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── python/          # Python scripts (transcription & processing)
│   ├── uploads/         # Temporary uploaded files 
│   ├── requirements.txt
│   └── mainroute.js
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🧑‍💻 Tech Stack

### Frontend

* Vite
* React
* Runs on **[http://localhost:5173](http://localhost:5173)**

### Backend

* Node.js
* Express.js
* FFmpeg
* Gemini and Groq APIs for planning & context matching

### Python

* Whisper (speech-to-text)
* Used for transcription and audio processing

---

## ▶️ Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AmanSharma619/Smart-B-roll-video-inserter.git
cd Smart-B-roll-video-inserter
```

---

## ⚙️ Backend Setup

### 📦 Prerequisites

Ensure the following are installed and available in PATH:

* **Node.js** (v18 or later)
* **Python** (v3.9+ recommended)
* **FFmpeg**

Verify installations:

```bash
node -v
python --version
ffmpeg -version
```

---

### 📁 Navigate to Backend

```bash
cd backend
```

---

### 📥 Install Node Dependencies

```bash
npm install
```

---

### 🐍 Python Setup (Required)

Create a virtual environment (recommended):

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

---

### 🔑 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

### ▶️ Start the Backend Server

```bash
nodemon ./mainroute.js
```

Backend will run on:

```
http://localhost:3000
```

---

## 🌐 Frontend Setup

Open a **new terminal**, then:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🧠 How It Works (High-Level)

1. User uploads:

   * One **A-roll video**
   * Multiple **B-roll videos**
2. Backend extracts audio using FFmpeg
3. Python(Whisper) transcribes A-roll speech
4. B-roll visuals are analyzed for context by Gemini
5. Groq generates a **timeline plan**
6. Backend processes and finalizes the plan

---

## 🧪 Troubleshooting

**Python not found**

```bash
py --version
```

**FFmpeg not found**

* Ensure FFmpeg is installed and added to PATH
* Restart terminal after installation

---


