# AI-Powered Onboarding Chatbot

This project is an AI-powered chatbot designed to help new hires navigate company policies, tools, and FAQs. It leverages **React**, **Node.js**, **MongoDB**, and **Google Gemini AI** to provide intelligent, context-aware responses using RAG (Retrieval-Augmented Generation).

## ✨ Features

*   **Intelligent Chat Interface**: 
    *   Natural language Q&A about company policies.
    *   **Rich Text Support**: Responses are rendered with Markdown (Bold, Lists, Code Blocks, Tables).
    *   **Quick Replies**: The AI suggests 3 relevant follow-up questions after every response.
    *   **Typing Indicators**: Smooth animations to indicate AI processing.
*   **Knowledge Base Management (RAG)**:
    *   **Upload Support**: Admin users can upload **PDF** and **Markdown (.md)** files.
    *   **Vector/Text Search**: Uses MongoDB text indexing to retrieve relevant context for the AI.
*   **Admin Dashboard**:
    *   Secure panel to manage documents (Upload/Delete).
    *   View usage statistics (Total Queries, Feedback tracking).
*   **User Feedback System**: Users can rate answers (Thumbs Up/Down) to help improve quality.
*   **Secure Authentication**: 
    *   JWT-based Login and Registration.
    *   Role-based access control (Admin vs Employee).
    *   Dark Mode UI design.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Material-UI (MUI), React Markdown
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: Google Gemini (via `@google/genai` SDK)
*   **File Processing**: `pdf2json` for robust PDF parsing.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas connection string)
- Google GenAI API Key

### 1. Clone the repository
```bash
git clone <repository-url>
cd GENAI-CHATBOT
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatbot_db  # Or your Atlas URI
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
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

## 📖 Usage Guide

1.  **Authentication**:
    *   Open the app at `http://localhost:5173`.
    *   Click "Sign up" to create a new account (default role: Employee).
    *   *Note*: To create an Admin user, you can manually update the `role` to `'admin'` in the MongoDB `users` collection, or use the registration form if role selection is enabled.

2.  **Populate Knowledge Base (Admin Only)**:
    *   Log in as an Admin.
    *   Click the **Admin Dashboard** link in the sidebar.
    *   Upload PDF or Markdown files (e.g., existing company handbooks, IT policies).
    *   The system automatically parses and indexes the content.

3.  **Chatting**:
    *   Go to the main chat interface.
    *   Ask questions like *"What is the remote work policy?"*
    *   The bot will answer using the uploaded documents and suggest follow-up questions.
    *   Click on a suggestion chip to instantly ask that question.

4.  **Feedback**:
    *   Click the Thumbs Up/Down icons on bot responses to provide feedback.
