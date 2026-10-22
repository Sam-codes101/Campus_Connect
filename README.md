# 🎓 Campus Connect

> A centralized, modern web platform designed for college students to access academic resources, report lost & found items, engage with the student community, view official campus updates, and manage their student profile.

---

## 👥 Project Team
Built by a team of 4 Computer Science & Engineering (CSE) students as a college mini-project.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router v6, Axios, Lucide Icons
- **Backend:** Node.js, Express.js (REST API architecture)
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs password hashing
- **File & Media Storage:** Cloudinary

---

## 📁 Project Structure

```text
campus-connect/
│
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Cards)
│   │   ├── context/            # Global context providers (AuthContext)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Layout wrappers (MainLayout)
│   │   ├── pages/              # Application pages (Dashboard, Library, etc.)
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── App.jsx             # Main routing shell
│   │   ├── index.css           # Tailwind base styles
│   │   └── main.jsx            # React root entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Database connection & configurations
│   ├── controllers/            # Route controllers & business logic
│   ├── middleware/             # Auth, validation, & error handling
│   ├── models/                 # Mongoose schemas (User, Post, Resource, etc.)
│   ├── routes/                 # Express REST API routes
│   ├── utils/                  # Helper utilities
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── .env                    # Server environment variables
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas cluster)

### 2. Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd campus-connect/server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/campus_connect
   JWT_SECRET=super_secret_jwt_key_campus_connect_2026
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*
   *Verify API health by visiting `http://localhost:5000/api/health`.*

### 3. Frontend Setup
1. In a separate terminal, navigate to the client folder:
   ```bash
   cd campus-connect/client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

---

## 📌 Development Roadmap

- [x] **Phase 1:** Project Setup (Vite, Tailwind, Express, MongoDB Config, Basic Routing)
- [ ] **Phase 2:** Authentication (Register, Login, JWT, Protected Routes)
- [ ] **Phase 3:** Dashboard & Core Layout (Quick Access, Previews, Navbar)
- [ ] **Phase 4:** Campus Library (Academic Notes, PYQs, Filters, Uploads)
- [ ] **Phase 5:** Lost & Found (Report items, Categorized filters, Resolve items)
- [ ] **Phase 6:** Student Community (Posts, Likes, Comments, Categories)
- [ ] **Phase 7:** Campus Updates (Admin Notices/Events, Student feed)
- [ ] **Phase 8:** Student Profile (Profile view/edit, User activity tabs)
- [ ] **Phase 9:** Final Polish & Verification
