# 🚀 Campus Connect — Complete Deployment & Teacher Viva Guide

> This guide provides step-by-step instructions to deploy Campus Connect online for **100% FREE**, along with a **Teacher Presentation & Viva Cheat Sheet** for your college evaluation.

---

## 🌟 Quick Overview: 2 Free Ways to Deploy

| Method | Best For | Services Used | Cost |
|---|---|---|---|
| **Option A (Recommended)** | Separate Frontend & Backend | **Vercel** (Frontend) + **Render** (Backend) + **MongoDB Atlas** | **FREE** |
| **Option B (All-in-One)** | Single URL, Zero CORS configuration | **Render** (Full-Stack Monorepo) + **MongoDB Atlas** | **FREE** |

---

## 🍃 Step 1: Free MongoDB Atlas Cloud Database Setup (3 Minutes)

Before deploying either option, you need a free cloud MongoDB connection string:

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **"Build a Database"** and choose the **M0 FREE Shared Cluster**.
3. Under **Security Quickstart**:
   - **Username & Password:** Create a database user (e.g., `campus_admin` and a secure password). *Remember this password!*
   - **Network Access:** Choose **"Allow Access from Anywhere"** (`0.0.0.0/0`) so Vercel and Render can connect to your database.
4. Click **"Connect"** → **"Drivers"** → Copy your connection string:
   ```text
   mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/campus_connect?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password).*

---

## 🌐 Option A: Deploy on Vercel (Frontend) + Render (Backend)

### Part 1: Deploy Backend to Render (Free)
1. Push your `campus-connect` code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Campus Connect"
   git branch -M main
   git remote add origin https://github.com/your-username/campus-connect.git
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and create an account.
3. Click **"New +"** → **"Web Service"** → Connect your GitHub repository.
4. Configure the settings:
   - **Name:** `campus-connect-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **"Advanced"** → **"Add Environment Variable"**:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `super_secret_jwt_key_campus_connect_2026`
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app` *(update after Part 2)*
6. Click **"Create Web Service"**.
7. Once deployed, copy your backend URL: e.g. `https://campus-connect-api.onrender.com`.

---

### Part 2: Deploy Frontend to Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** → **"Project"** → Import your `campus-connect` repository.
3. In the project setup screen:
   - **Root Directory:** Click "Edit" and select `client`.
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **"Environment Variables"** and add:
   - `VITE_API_URL` = `https://campus-connect-api.onrender.com/api` *(Your Render backend URL + /api)*
5. Click **"Deploy"**.
6. In ~60 seconds, your site will be live with an SSL HTTPS domain (e.g., `https://campus-connect-cse.vercel.app`)!
7. *Tip:* Go back to Render and update `CLIENT_URL` to your new Vercel URL for clean CORS.

---

## 📦 Option B: All-in-One Deployment on Render (Single Service)

If you prefer everything running on a single URL with zero CORS configuration:

1. Push your repository to GitHub.
2. On [Render](https://render.com), click **"New +"** → **"Web Service"**.
3. Settings:
   - **Root Directory:** *(leave blank / project root)*
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `super_secret_jwt_key_campus_connect_2026`
5. Click **"Create Web Service"**.
   *The server will automatically build the client and serve both the React web application and REST APIs from the same domain!*

---

## 🎓 Teacher Presentation & Viva Cheat Sheet

### 1. 30-Second Elevator Pitch
> *"Campus Connect is a centralized MERN-stack web portal created specifically for college students. It unites 5 vital campus functions into a single interface: academic note sharing with PYQs, a lost & found recovery portal, a student community feed with real-time likes and discussions, official department notices, and student profile credential management. It uses role-based authentication separating Students from Faculty/Admins."*

### 2. Architecture & Tech Stack Highlights
- **Frontend:** React 18, Vite (fast HMR build), Tailwind CSS (responsive mobile-ready UI), React Router v6 (SPA routing), Axios (HTTP client with JWT Bearer interceptor).
- **Backend:** Node.js & Express.js with clean MVC folder separation (Controllers, Models, Routes, Middleware, Config).
- **Database:** MongoDB & Mongoose schemas with indexing and relations (`ObjectId` references).
- **Authentication:** Stateless JSON Web Tokens (JWT) stored in localStorage and validated via server middleware; passwords hashed using `bcryptjs` with salt rounds.
- **Upload Pipeline:** Client-side FileReader encoding directly to Base64 data streams with instant browser preview and remove toggles, with optional Cloudinary support.

### 3. Common Viva Questions & Model Answers

| Question | Answer |
|---|---|
| **Q1: Why did you choose React + Vite instead of plain HTML/JS?** | *"Vite provides instant hot-module replacement and optimized asset chunking, while React's component-based model allows reusability across cards, modals, and navigation bars with unified global state via Context API."* |
| **Q2: How is security handled during login?** | *"Passwords are never stored in plain text. When a student registers, bcrypt generates a salt and hashes the password before saving to MongoDB. On login, `bcrypt.compare()` verifies the hash, and the server signs a JWT containing the user ID and role which is verified on protected routes."* |
| **Q3: How do role permissions work?** | *"We implemented two middleware layers: `protect` (verifies valid JWT token) and `adminOnly` (checks if `req.user.role === 'admin'`). Actions like publishing official university circulars or editing department updates are locked to the admin role."* |
| **Q4: How does search and filtering work in the Library?** | *"On the backend, `/api/resources` accepts query parameters (`branch`, `semester`, `type`, and `search`). If a search term is passed, MongoDB uses regex pattern matching (`$regex`) with case-insensitivity (`$options: 'i'`) on title, subject, and description."* |
| **Q5: What happens if MongoDB goes offline during local testing?** | *"The backend includes an automatic fallback (`MongoMemoryServer`) that initializes an embedded database in memory and seeds realistic initial data, ensuring the application always works for evaluation even without an active external MongoDB daemon."* |

---

## 🔑 Pre-Seeded Teacher Demo Accounts

| Role | Email | Password | What to show the teacher |
|---|---|---|---|
| **Student** | `student@college.edu` | `student123` | Browsing & uploading notes, posting in community, claiming/reporting lost items, editing student profile. |
| **Admin** | `admin@college.edu` | `admin123` | Managing official updates, deleting inappropriate content, publishing event circulars. |
