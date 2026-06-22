# ExamNotes AI

ExamNotes AI is a premium EdTech SaaS prototype for generating exam-focused notes, analyzing previous year questions, predicting high-probability topics, building study plans, creating flashcards, and running AI quizzes.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:8080`.

The app runs in demo mode without environment variables. Add `.env` values from `.env.example` to connect MongoDB, Gemini, Google OAuth, Cloudinary, and Razorpay.

## Product Modules

- Landing page, Google login screen, dashboard, profile
- AI notes generator with academic filters and note modes
- PYQ analyzer for PDF, DOCX, and image upload
- Topic weightage charts and heat map
- Exam prediction-ready AI API layer
- Smart study planner
- Quiz and flashcard generators
- Gems economy and Razorpay-ready store

## Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose models
- AI: Gemini API service wrapper
- Auth: Google OAuth-ready route boundary
- Storage: Cloudinary-ready architecture
- Payments: Razorpay order route
- Deployment: Vercel-ready Node app
