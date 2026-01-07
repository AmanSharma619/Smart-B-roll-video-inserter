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
