# Formly - Conversational Form Builder & Respondent Platform

Formly is a full-stack, production-quality Typeform clone designed for creating and answering high-converting, conversational web forms. It features a modern 3-pane form builder with drag-and-drop question reordering, live respondent preview, full-screen respondent interface with keyboard navigation (Enter, Arrow keys), atomic response submission, responses dashboard, and question-level statistics analytics.

---

## 🌟 Key Features

### Creator Experience
- **Form Dashboard (`/forms`)**: Create, rename, duplicate, publish/unpublish, and delete forms with instant feedback toast notifications and confirmation modals.
- **Modern 3-Pane Builder (`/forms/[id]/builder`)**:
  - **Left Sidebar**: Drag-and-drop question sequence list (`@dnd-kit/core` & `@dnd-kit/sortable`).
  - **Center Editor**: Inline title editing, help text, required toggle, and dynamic options management (add, edit, delete choices) with debounced auto-save.
  - **Right Panel**: Real-time live respondent preview updating instantly as questions change.
- **Form Duplication**: Deep copies form questions and options while resetting status to draft without copying responses.
- **Publish Validation & Unique Slugs**: Validates form requirements before publishing and generates SEO-friendly unique public slugs (e.g. `job-application-a83f2d`).

### Public Respondent Experience (`/f/[slug]`)
- **No Authentication Required**: Public respondents can view and fill published forms seamlessly without logging in.
- **One Question at a Time**: Spacious, distraction-free conversational UI powered by Framer Motion slide animations.
- **Keyboard Control**: Navigate with `Enter` to advance, `Arrow Up` to move backward, and key choices.
- **Client & Server Validation**: Input format validation for email, numbers, required fields, and rating ranges.
- **State Retention**: Retains previously entered answers when navigating backward.
- **Full-Screen Thank You Page**: Displays a clean completion view upon successful submission.

### Responses & Statistics (`/forms/[id]/responses`)
- **Submissions List**: View total response counts, timestamped submission previews, and detailed individual answer inspection (`/forms/[id]/responses/[responseId]`).
- **Question Statistics**:
  - Choice percentage distribution bars for Multiple Choice & Dropdown questions.
  - Yes / No counts and percentage cards.
  - 5-Star score averages for Rating questions.
  - Numeric averages for Number questions.
  - Recent text entries for Short Text and Long Text questions.

---

## 🛠️ Mandatory 8 Question Types

1. `short_text`: Single-line text input.
2. `long_text`: Multi-line textarea.
3. `multiple_choice`: Clickable vertical choice cards.
4. `dropdown`: Select list options.
5. `email`: Validated email address input.
6. `number`: Numeric value input.
7. `yes_no`: Large binary Yes / No choice buttons.
8. `rating`: 1 to 5 rating scale cards.

---

## 📦 Required Tech Stack

- **Frontend**: Next.js (App Router, TypeScript, React 18, Tailwind CSS, Framer Motion, `@dnd-kit/core`, `@dnd-kit/sortable`, Lucide Icons).
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, Uvicorn.
- **Database**: SQLite with `PRAGMA foreign_keys=ON` and cascading deletes.

---

## 📁 Folder Structure

```
Scaler/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx (redirects to /forms)
│   │   ├── forms/
│   │   │   ├── page.tsx (Dashboard)
│   │   │   ├── new/page.tsx (Form creation helper)
│   │   │   └── [id]/
│   │   │       ├── builder/page.tsx (3-pane Form Builder)
│   │   │       └── responses/
│   │   │           ├── page.tsx (Responses & Stats Dashboard)
│   │   │           └── [responseId]/page.tsx (Individual response)
│   │   └── f/
│   │       └── [slug]/page.tsx (Public Respondent Experience)
│   ├── components/
│   │   ├── ui/ (Button, Modal, Toast, Badge)
│   │   ├── layout/ (Navbar)
│   │   ├── forms/ (FormCard, CreateFormModal, RenameModal)
│   │   ├── builder/ (QuestionList, QuestionItem, QuestionEditor, LivePreview, SettingsTab)
│   │   ├── responses/ (ResponseTable, ResponseDetailModal, QuestionStats)
│   │   └── public-form/ (PublicFormView, QuestionCard, ProgressHeader, ThankYouScreen)
│   ├── lib/
│   │   ├── api.ts (Centralized REST API client)
│   │   └── utils.ts
│   ├── types/ (form.ts, question.ts, response.ts)
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py (FastAPI app & CORS setup)
│   │   ├── database.py (SQLAlchemy engine & SQLite FK pragma)
│   │   ├── models/ (creator.py, form.py, question.py, response.py)
│   │   ├── schemas/ (form.py, question.py, response.py, stats.py)
│   │   ├── routes/ (forms.py, questions.py, public_forms.py, responses.py)
│   │   ├── services/ (form_service.py, question_service.py, response_service.py, stats_service.py)
│   │   └── utils/ (slug.py, validation.py)
│   ├── seed.py (Idempotent seed script)
│   ├── test_api.py (Automated test suite)
│   └── requirements.txt
├── README.md
└── .gitignore
```

---

## 🗄️ Database Schema Summary

- **`creators`**: `id` (PK), `name`, `email`, `created_at`
- **`forms`**: `id` (PK), `creator_id` (FK -> creators.id), `title`, `description`, `status` (`draft` | `published`), `public_slug` (Unique), `created_at`, `updated_at`, `published_at`
- **`questions`**: `id` (PK), `form_id` (FK -> forms.id), `type`, `title`, `description`, `required`, `order_index`, `created_at`, `updated_at`
- **`question_options`**: `id` (PK), `question_id` (FK -> questions.id), `label`, `value`, `order_index`
- **`responses`**: `id` (PK), `form_id` (FK -> forms.id), `submitted_at`
- **`answers`**: `id` (PK), `response_id` (FK -> responses.id), `question_id` (FK -> questions.id), `answer_text`

> All relationships enforce `ondelete="CASCADE"` to ensure zero orphan questions, options, or responses upon form deletion.

---

## 🔌 API Endpoints Summary

### Creator Form Management
- `GET /api/forms` - List creator forms
- `POST /api/forms` - Create new form
- `GET /api/forms/{id}` - Get form details with questions
- `PUT /api/forms/{id}` - Update title/description
- `DELETE /api/forms/{id}` - Cascade delete form
- `POST /api/forms/{id}/duplicate` - Duplicate form structure
- `POST /api/forms/{id}/publish` - Publish form & generate public slug
- `POST /api/forms/{id}/unpublish` - Revert form to draft

### Question Builder & Reordering
- `POST /api/forms/{id}/questions` - Add question
- `PUT /api/questions/{id}` - Update question title, type, required, options
- `DELETE /api/questions/{id}` - Delete question
- `PUT /api/forms/{id}/questions/reorder` - Batch reorder question sequence

### Public Respondent Interface
- `GET /api/public/forms/{slug}` - Fetch published form without login
- `POST /api/public/forms/{slug}/responses` - Submit atomic response payload

### Responses & Analytics
- `GET /api/forms/{id}/responses` - List form submissions
- `GET /api/forms/{id}/responses/{response_id}` - View individual submission
- `GET /api/forms/{id}/stats` - Get question statistical breakdown

---

## ⚡ Quick Start & Setup Instructions

### 1. Backend Setup (FastAPI & SQLite)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run database seeder (seeds default creator, 2 published forms, 1 draft form, 9 sample responses)
python seed.py

# Start FastAPI server
uvicorn app.main:app --port 8000 --reload
```

FastAPI server runs at: `http://localhost:8000`  
Swagger API Docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup (Next.js)

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Next.js web application runs at: `http://localhost:3000`

---

## 🔑 Default Creator Information & Sample URLs

- **Default Creator ID**: `1`
- **Default Creator Name**: `Demo Creator` (`demo@example.com`)
- **Seeded Public Form 1**: `http://localhost:3000/f/customer-feedback-demo`
- **Seeded Public Form 2**: `http://localhost:3000/f/job-application-demo`

---

## 🧪 Verification Commands Executed

1. **Database Seeding**: `python seed.py`
2. **Frontend Type Check & Production Compilation**: `npm run build`
3. **End-to-End API Automated Suite**: `python test_api.py` (13/13 tests passed)

---

## 🌐 Deployment Notes

- **Frontend**: Suitable for Vercel deployment (`npm run build`).
- **Backend**: Suitable for Render/Railway/Fly.io deployment.
- **SQLite Persistence Note**: SQLite stores data in a local file (`formly.db`). For ephemeral cloud deployments (e.g. Render free tier), attach a persistent disk volume to ensure long-term SQLite database persistence across app restarts.
