# Vibely – Curate Your Vibe

Vibely is a modern social media web app where users can share posts, stories, and loops, chat in real time, and stay updated with live notifications.  
Built with a full-stack JavaScript stack and deployed with production-ready settings.

---

## ✨ Features

- **Authentication**
  - Sign up / login with secure HTTP-only cookies
  - Password reset via OTP-based email flow (multi-step UI)
  - Form validation and password strength meter

- **Feed & Posts**
  - Create, like, and comment on posts
  - Shuffled feed for a fresh experience on each load
  - Responsive card layout optimized for mobile and desktop

- **Stories**
  - Instagram-style stories bar with:
    - “Your Story” for the current user
    - Other users’ stories excluding the current user
  - Story viewing and separation of current user vs others

- **Real-Time Chat**
  - One-to-one messaging with Socket.io
  - Live message delivery without page refresh
  - Conversation-based filtering so only relevant messages update

- **Notifications**
  - Real-time in-app notifications for likes, comments, and more
  - Unread indicator badge on bell icon (desktop & mobile)
  - Notifications page for viewing and marking as read

- **UI/UX**
  - Clean, glassmorphism-inspired interface with gradients
  - Mobile-optimized layout:
    - Compact top bar with notification + messages icons
    - Bottom navigation for Home, Search, Create, Loops, Profile
  - Left sidebar on large screens with:
    - Welcome “Curate your vibe” section
    - Current user card
    - Suggested users list

- **Email (Password Reset)**
  - OTP-based password reset flow
  - Emails sent using an external email service (e.g., Resend)
  - Handles OTP generation, expiry, verification, and password update

---

## 🏗️ Tech Stack

**Frontend**
- React
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- React Icons
- Vercel for deployment

**Backend**
- Node.js
- Express
- MongoDB & Mongoose
- JWT-based auth (HTTP-only cookie)
- Socket.io for real-time events
- Email service (Resend / similar API-based provider)
- Render for deployment

---

## 🚀 Getting Started

### 1. Clone the repository
git clone https://github.com/your-username/vibely.git
cd vibely


### 2. Environment Variables
Create `.env` files in both `frontend` and `backend` with the required values.

**Backend `.env` example:**

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLIENT_URL=[https://your-frontend-domain.com](https://vibely-two.vercel.app/signin)

RESEND_API_KEY=your_resend_api_key

**Frontend `.env` example (Vite/CRA style):**

VITE_SERVER_URL=(https://vibely-backend-0joj.onrender.com)

Make sure `serverUrl` in the frontend uses this env variable.

### 3. Install dependencies

Backend
cd backend
npm install

Frontend
cd ../frontend
npm install


### 4. Run locally

In backend folder
npm run dev

In frontend folder
npm start # or npm run dev if using Vite
Open `http://localhost:3000` (or your dev port) in the browser.

---

## 🔐 Auth & Password Reset Flow

1. **User clicks “Forgot password?”**
2. Step 1: Enters email → app validates and calls:
   - `POST /api/auth/sendOtp`
3. Backend:
   - Looks up user
   - Generates 4-digit OTP with 5-minute expiry
   - Saves OTP + expiry on user
   - Sends OTP via email using Resend (or configured provider)
4. Step 2: User enters OTP:
   - `POST /api/auth/verifyOtp`
5. Backend verifies OTP + expiry, sets `isOtpVerified`
6. Step 3: User sets new password:
   - `POST /api/auth/resetPassword`
7. Backend hashes new password and resets `isOtpVerified`

---

## 🔔 Real-Time Features

- Socket.io manages:
  - New messages (`"newMessage"`)
  - Post likes (`"likedPost"`)
  - Comments (`"commentedPost"`)
  - Notifications (`"newNotification"`)

Frontend listeners update Redux state so that:
- Active chat updates instantly.
- Feed likes/comments stay in sync.
- Notification badge shows unread count.

---

## 🧪 Production Setup

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- MongoDB hosted on **MongoDB Atlas**
- Cookies configured with:
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: "none"` for cross-site cookies in production
- Email provider configured with API key

---

## 🗺️ Roadmap / Ideas

- Group chats and typing indicators  
- Rich media posts (videos, audio, loops)  
- Push notifications (web/mobile)  
- Profile insights / analytics  
- Custom domain and SEO-optimized landing page  

---

## 📝 License

This project is for learning and portfolio purposes.  
You can adapt it, extend it, or fork it as needed. Add a proper license (MIT, etc.) if you plan to open-source.

---

## 🙌 Acknowledgements

- React, Node.js, Express, MongoDB, Socket.io  
- Vercel & Render for free-tier hosting  
- Resend for transactional emails  






