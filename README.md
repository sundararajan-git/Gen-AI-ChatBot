# AI-Powered Onboarding Chatbot

This project is an AI-powered chatbot designed to help new hires navigate company policies, tools, and FAQs. It uses **React**, **Node.js**, **MongoDB**, and **Google Gemini AI**.

## Features
- **AI Chat Interface**: Ask natural language questions about company policies.
- **RAG (Retrieval-Augmented Generation)**: Answers are based on uploaded documents (PDF/Markdown).
- **Admin Panel**: Secure dashboard to upload knowledge base documents and view stats.
- **User Feedback**: Users can rate answers (thumbs up/down) to improve quality.
- **Auth System**: Login/Signup with JWT authentication. Admin role protection.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd GENAI-CHATBOT
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatbot_db
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the client:
```bash
npm run dev
```

## Usage
1.  **Register a user**: Go to `/login` (or register if implemented, otherwise manually create/seed a user).
    *   *Note*: The current code expects existing users or you can use Postman to register.
2.  **Login**: Use credentials.
3.  **Admin Panel**: If you are an admin, navigate to `/admin`.
    *   Upload the sample document from `samples/CompanyPolicy.md`.
4.  **Chat**: Go to the home page and ask questions like "What are the work hours?" or "How do I claim expenses?".

## Tech Stack
-   **Frontend**: React, Vite, Material-UI
-   **Backend**: Node.js, Express
-   **Database**: MongoDB
-   **AI**: Google Gemini Pro/Flash
-   **Tools**: `pdf-parse` for document processing.
