# 🚀 Deployment Guide: Kids Shopping App

This guide will help you deploy your **Full Stack Application** to the web!

We will use:
1.  **Render** for the Backend (Node.js/Express + MongoDB)
2.  **Vercel** for the Frontend (React + Vite)

---

## Part 1: Deploy Backend to Render

1.  **Push your latest code to GitHub** (We just did this!).
2.  Go to [dashboard.render.com](https://dashboard.render.com/) and create a free account.
3.  Click **"New +"** -> **"Web Service"**.
4.  Connect your GitHub repository: `fahxm/kids-shopping`.
5.  Render will ask for configuration. **Scroll down to "Root Directory"**.
    *   **Root Directory:** `backend` (Important! This tells Render to look inside the backend folder).
6.  The other settings should auto-fill, but verify:
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
7.  **Environment Variables**:
    You need to add your secrets here. Scroll down to the "Environment Variables" section and add:
    *   `MONGO_URI`: (Paste your MongoDB connection string here)
    *   `JWT_SECRET`: (Paste your secret key, e.g., `mysecretkey123`)
    *   `PORT`: `10000` (Render usually sets this, but good to have)
8.  Click **"Create Web Service"**.
9.  Wait for it to build. Once live, Render will give you a URL like: `https://kids-shopping-backend.onrender.com`.
    *   **Copy this URL!** You need it for the frontend.

---

## Part 2: Deploy Frontend to Vercel

1.  Go to [vercel.com](https://vercel.com/) and create a free account.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository: `kids-shopping`.
4.  **Configure Project:**
    *   **Framework Preset:** Vite (Should detect automatically).
    *   **Root Directory:** `./` (Default is fine).
5.  **Environment Variables:**
    *   Expand the "Environment Variables" section.
    *   Key: `VITE_API_URL`
    *   Value: `https://your-backend-url.onrender.com` (Paste the Render URL you copied earlier).
    *   **Important:** Do NOT add a trailing slash `/` at the end.
6.  Click **"Deploy"**.

---

## Part 3: Verify & Celebrate! 🎉

1.  Visit your new Vercel URL.
2.  Try to Sign Up / Login.
3.  If it works, congratulations! Your app is live on the internet.

---

## 🛠 Troubleshooting

### "When I run backend locally it opens VS Code?"
This usually happens if you try to "open" the script file instead of "running" it with Node using `npm`.
*   **Correct way:**
    1.  Open terminal in VS Code.
    2.  `cd backend`
    3.  `npm run dev` (This runs `nodemon server.js`).
*   **If it still happens:**
    *   Ensure `nodemon` is installed: `npm install` inside the `backend` folder.
    *   If `npm run dev` fails, try running `node server.js` strictly.

### CORS Errors
If you see "CORS" errors in the browser console:
1.  Go to `backend/server.js`.
2.  Update the `cors` configuration to allow your specific Vercel URL.
    ```javascript
    app.use(cors({
      origin: ['http://localhost:5173', 'https://your-project.vercel.app'],
      credentials: true
    }));
    ```
3.  Push changes to GitHub -> Render will auto-deploy.
