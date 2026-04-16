# NextGenShe — Full Stack Platform 🚀

**React + FastAPI + Claude AI** — A complete, functional women-focused tech learning platform.

---

## 🗂️ Project Structure

```
nextgenshe/
├── frontend/                  ← React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     ← With auth state (login/signup buttons)
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx ← Real enrollment button
│   │   │   ├── TeamCard.jsx
│   │   │   └── AuthModal.jsx  ← 🆕 Sign in / Sign up modal
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Contact.jsx    ← Connected to real API
│   │   │   ├── AIMentor.jsx   ← 🆕 AI chat with Zara
│   │   │   └── Dashboard.jsx  ← 🆕 User dashboard
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← 🆕 Auth state management
│   │   ├── hooks/
│   │   │   └── useApi.js      ← 🆕 All API hooks
│   │   ├── App.jsx            ← Updated with new routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── backend/                   ← FastAPI server
    ├── main.py                ← All API routes
    ├── requirements.txt
    └── .env.example
```

---

## ⚙️ Local Setup (Step by Step)

### Step 1 — Backend

```bash
cd backend

# Copy env file and fill in your keys
cp .env.example .env
# Edit .env → add your ANTHROPIC_API_KEY

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# OR: venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`  
Test it: `http://localhost:8000/api/health`

### Step 2 — Frontend

```bash
cd frontend

# Copy env file
cp .env.example .env
# VITE_API_URL=http://localhost:8000  ← already set for local

# Install packages
npm install

# Start dev server
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🔑 Getting Your Anthropic API Key (Free)

1. Go to https://console.anthropic.com
2. Create a free account
3. Go to **API Keys** → **Create Key**
4. Copy the key → paste into `backend/.env`

The AI Mentor (Zara) uses `claude-haiku-4-5` which is the cheapest/fastest model.  
Free tier gives you $5 credit — enough for thousands of conversations.

---

## 🌐 Deploying to Production

### Frontend → Vercel

```bash
cd frontend
npm run build   # Test build locally first

# Push to GitHub, then connect to Vercel
# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

### Backend → Render (Free)

1. Push your `backend/` folder to GitHub
2. Go to https://render.com → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `SECRET_KEY` = any random string

### Update CORS (after deploying)

In `backend/main.py`, update `allow_origins`:
```python
allow_origins=["https://nextgenshe.vercel.app"]  # your real frontend URL
```

---

## 🔌 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/enroll` | Enroll in a course |
| GET | `/api/enrollments/{user_id}` | Get user enrollments |
| POST | `/api/progress` | Update lesson progress |
| GET | `/api/progress/{user_id}/{course_id}` | Get course progress |
| POST | `/api/ai/chat` | Chat with Zara AI |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

---

## 🗄️ Upgrading to PostgreSQL (Production)

When you're ready to scale, replace the in-memory dicts with a real database.
The easiest free option is **Supabase**:

1. Create free project at https://supabase.com
2. Run these SQL tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id INTEGER NOT NULL,
  course_title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  message TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);
```

3. Install `supabase` Python client: `pip install supabase`
4. Replace dict operations in `main.py` with Supabase queries

---

## ✨ What's Now Functional

- ✅ **User Authentication** — Sign up, login, logout with token storage
- ✅ **Course Enrollment** — Real enrollment saved to backend
- ✅ **AI Mentor (Zara)** — Live Claude AI chat in Urdu/English
- ✅ **Contact Form** — Submits to real API endpoint
- ✅ **User Dashboard** — Shows enrollments and quick links
- ✅ **Protected Routes** — Auth prompt when signing up for courses
- ✅ **Persistent Login** — Token saved in localStorage

---

## 🔮 Next Features to Add

- [ ] Email verification (SendGrid/Resend)
- [ ] Password reset flow
- [ ] Lesson content pages with video embeds
- [ ] Quiz/assessment system
- [ ] Certificates on course completion
- [ ] Community circles / discussion boards
- [ ] Admin dashboard to manage users & courses
- [ ] PWA / offline support

---

Built with 💜 for women in tech — NextGenShe
