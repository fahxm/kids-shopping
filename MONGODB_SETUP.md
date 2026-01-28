# MongoDB Connection Setup & Troubleshooting

If you are seeing a "Cluster" or "Connection" error, it is usually because your **IP Address** is not allowed to connect to the database.

## 1. Fix "Cluster" or "Network" Errors (IP Whitelist)

1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  On the left sidebar, under **Security**, click **Network Access**.
3.  Click the green **+ ADD IP ADDRESS** button.
4.  Choose one of these options:
    *   **Allow Access from Anywhere** (Recommended for beginners/testing): This adds `0.0.0.0/0`.
    *   **Add Current IP Address**: This only allows your *current* location. (You will have to do this again if you move to a cafe or different wifi).
5.  Click **Confirm**.
6.  Wait 1-2 minutes for the changes to deploy.
7.  Restart your backend server (`Ctrl+C` then `node server.js`).

## 2. Check Username & Password

Ensure your `.env` file has the correct password.
*   **Username**: `fahimptrippanachi_db_user`
*   **Password**: Is it really `fahim`? If not, update it in `.env`.

## 3. Check Database User

1.  On the left sidebar, under **Security**, click **Database Access**.
2.  Make sure the user `fahimptrippanachi_db_user` exists.
3.  If you forgot the password, click **Edit** (pencil icon) -> **Edit Password** and set a new one.
4.  **Important:** If you change the password, you MUST update your `.env` file!
