# Nexus Gate - Secure Auth & Interactive Dashboard

A robust, production-ready authentication system built with the PERN stack (PostgreSQL, Express, React, Node.js). This project demonstrates advanced security practices mixed with high-end frontend interactions.

[Click here to view demo](https://loginsystem-mu.vercel.app/)

## 🚀 Features

### Core Security
*   **HttpOnly Cookies**: Zero reliance on `localStorage`. Tokens are stored in secure, server-side cookies to prevent XSS attacks.
*   **JWT Authentication**: Robust access and refresh token rotation system.
*   **Session Management**: Automatic silent token refreshing for seamless user experience.

### User Experience (UI/UX)
*   **Glassmorphism Design**: Modern, translucent UI components with decorative background elements.
*   **Interactive 3D Dashboard**: The user card features a physics-based 3D tilt effect that responds to:
    *   **Mouse Movement**: Smooth tracking on desktop.
    *   **Gyroscope**: Real-time tilt on mobile devices (iOS/Android).
*   **Dynamic Lighting**: "Shine" reflection effects that follow the cursor.
*   **Responsive**: Fully optimized for desktop and mobile viewports.

### Administration
*   **Role-Based Access Control (RBAC)**: Protected routes and middleware for admin actions.
*   **Admin Dashboard**: Dedicated panel to view registered users, roles, and last login activity.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Framer Motion (Animations), Axios, CSS Variables
*   **Backend**: Node.js, Express.js
*   **Database**: PostgreSQL
*   **Security**: bcrypt (Hashing), jsonwebtoken (JWT), cookie-parser

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js & npm installed
*   PostgreSQL installed and running

### 1. Database Setup
Create a PostgreSQL database and configure the schema.
```sql
CREATE DATABASE auth_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE refresh_token (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file:
    ```env
    PORT=8000
    DATABASE_URL=postgres://user:password@localhost:5432/auth_db
    JWT_SECRET=your_super_secret_key_change_this
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file if needed (or configure `src/config.js`):
    ```env
    REACT_APP_API_URL=http://localhost:8000
    ```
4.  Start the application:
    ```bash
    npm start
    ```

## 📱 Mobile Testing
To test the Gyroscope features on mobile:
1.  Ensure your phone and computer are on the same Wi-Fi.
2.  Access the app via your computer's local IP (e.g., `https://192.168.1.5:3000`).
3.  **Note**: Mobile browsers often require **HTTPS** to access motion sensors. You may need to use a tunneling service like `ngrok` or a local secure context for full functionality.
4.  If on iOS 13+, tap the **"Enable 3D Effect"** button on the dashboard to grant permission.

## 🛡️ Admin Access
To access the Admin Panel:
1.  Register a new user.
2.  Manually update the user's role in the database:
    ```sql
    UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
    ```
3.  Refresh the dashboard to see the "Admin Panel" button.
