from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import httpx, os, uuid, json
from datetime import datetime, timedelta
import hashlib, hmac, base64

app = FastAPI(title="NextGenShe API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://women-edu-first.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-prod")

# ── In-memory DB (replace with PostgreSQL/Supabase in production) ─────────────
users_db: dict = {}
enrollments_db: dict = {}
contacts_db: list = []
progress_db: dict = {}

# ── MODELS ────────────────────────────────────────────────────────────────────
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    is_anonymous: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EnrollRequest(BaseModel):
    user_id: str
    course_id: int
    course_title: str

class ProgressUpdate(BaseModel):
    user_id: str
    course_id: int
    lesson_index: int
    completed: bool

class ChatMessage(BaseModel):
    message: str
    path: str
    level: str
    user_name: str
    history: List[dict] = []

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

# ── HELPERS ───────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(user_id: str) -> str:
    payload = f"{user_id}:{datetime.utcnow().isoformat()}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    token = base64.b64encode(f"{payload}:{sig}".encode()).decode()
    return token

def verify_token(token: str) -> Optional[str]:
    try:
        decoded = base64.b64decode(token.encode()).decode()
        parts = decoded.rsplit(":", 2)
        user_id, timestamp, sig = parts[0], parts[1], parts[2]
        expected = hmac.new(SECRET_KEY.encode(), f"{user_id}:{timestamp}".encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(sig, expected):
            return user_id
    except Exception:
        pass
    return None

# ── AUTH ROUTES ───────────────────────────────────────────────────────────────
@app.post("/api/auth/signup")
async def signup(data: UserSignup):
    if data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    users_db[data.email] = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "is_anonymous": data.is_anonymous,
        "created_at": datetime.utcnow().isoformat(),
        "enrollments": [],
    }
    token = make_token(user_id)
    return {"token": token, "user": {"id": user_id, "name": data.name, "email": data.email}}

@app.post("/api/auth/login")
async def login(data: UserLogin):
    user = users_db.get(data.email)
    if not user or user["password"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = make_token(user["id"])
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

# ── ENROLLMENT ROUTES ─────────────────────────────────────────────────────────
@app.post("/api/enroll")
async def enroll(data: EnrollRequest):
    key = f"{data.user_id}:{data.course_id}"
    if key in enrollments_db:
        return {"message": "Already enrolled", "enrolled": True}
    enrollments_db[key] = {
        "user_id": data.user_id,
        "course_id": data.course_id,
        "course_title": data.course_title,
        "enrolled_at": datetime.utcnow().isoformat(),
        "progress": 0,
    }
    return {"message": "Successfully enrolled!", "enrolled": True}

@app.get("/api/enrollments/{user_id}")
async def get_enrollments(user_id: str):
    user_enrollments = [v for k, v in enrollments_db.items() if v["user_id"] == user_id]
    return {"enrollments": user_enrollments}

# ── PROGRESS ROUTES ───────────────────────────────────────────────────────────
@app.post("/api/progress")
async def update_progress(data: ProgressUpdate):
    key = f"{data.user_id}:{data.course_id}"
    if key not in progress_db:
        progress_db[key] = {"completed_lessons": [], "last_updated": ""}
    if data.completed and data.lesson_index not in progress_db[key]["completed_lessons"]:
        progress_db[key]["completed_lessons"].append(data.lesson_index)
    progress_db[key]["last_updated"] = datetime.utcnow().isoformat()
    return {"progress": progress_db[key]}

@app.get("/api/progress/{user_id}/{course_id}")
async def get_progress(user_id: str, course_id: int):
    key = f"{user_id}:{course_id}"
    return progress_db.get(key, {"completed_lessons": [], "last_updated": ""})

# ── AI MENTOR ROUTE ───────────────────────────────────────────────────────────
@app.post("/api/ai/chat")
async def ai_chat(data: ChatMessage):
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="AI API key not configured")

    system_prompt = f"""You are Zara, a warm, supportive AI mentor on NextGenShe — a platform for girls and women
learning tech skills to earn from home, especially in Pakistan and South Asia.

User: {data.user_name} | Path: {data.path} | Level: {data.level}

Personality:
- Warm, encouraging, like a big sister or mentor
- Mix English with Urdu/Roman Urdu naturally (e.g., "Bohat acha!", "Bilkul kar sakti ho!")
- Never make them feel behind or incapable
- Give practical, actionable steps with realistic timelines
- Keep responses concise (3-4 paragraphs max)
- When giving roadmaps, use numbered steps
- Focus on learning → earning pathway
- Everything can be done from home on a phone or basic laptop

For earning questions: give specific platforms (Fiverr, Upwork) and realistic income ranges.
For roadmap requests: give week-by-week steps.
For motivation: celebrate their courage first, then help."""

    messages = data.history[-10:] + [{"role": "user", "content": data.message}]

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 800,
                "system": system_prompt,
                "messages": messages,
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="AI service error")
    result = response.json()
    reply = result["content"][0]["text"]
    return {"reply": reply}

# ── CONTACT ROUTE ─────────────────────────────────────────────────────────────
@app.post("/api/contact")
async def contact(data: ContactForm):
    contacts_db.append({
        "name": data.name,
        "email": data.email,
        "message": data.message,
        "submitted_at": datetime.utcnow().isoformat(),
    })
    # In production: send email via SendGrid/Resend here
    print(f"📬 New contact from {data.name} <{data.email}>: {data.message[:80]}")
    return {"success": True, "message": "Message received! We'll reply within 24 hours."}

# ── HEALTH ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "users": len(users_db), "enrollments": len(enrollments_db)}
