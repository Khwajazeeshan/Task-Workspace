# 🚀 Premium Task Workspace

A state-of-the-art, professional Task Management application built with **Next.js 15**, **TypeScript**, and **MongoDB**. This project features a high-end dark workspace aesthetic with glassmorphism, real-time statistics, and a secure passwordless authentication flow.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)

---

## ✨ Features

### 🔐 Secure Passwordless Authentication
- **Magic Link Login**: No more passwords. Enter your email and receive a secure verification link.
- **Auto-Provisioning**: New users are automatically registered upon first email verification.
- **JWT Protection**: Secure session management using HTTP-only cookies and JSON Web Tokens.
- **Verified Flow**: Prevents unverified access with specialized middleware-level checks.

### 📋 Advanced Task Management
- **Full CRUD Operations**: Add, Edit, Delete, and Toggle task completion.
- **Live Search & Fetch**: Tasks are automatically fetched and associated with the user's primary email.
- **Dashboard Stats**: Real-time visualization of productivity metrics:
    - **Total Tasks**: Overall workload count.
    - **Completed**: Number of goals achieved.
    - **Pending**: Items remaining in the queue.
    - **Efficiency**: Percentage-based progress indicator.

### 🎨 Premium UI/UX
- **Unified Design System**: Consistent professional aesthetic across all pages.
- **Glassmorphism**: Modern frosted-glass cards with backdrop filters.
- **Responsive Architecture**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Smooth Animations**: Integrated `tailwindcss-animate` for fluid page transitions and interactions.
- **Status Indicators**: Real-time pulses and progress tracks for a "living" interface.

---

## 📂 Folder Structure

```text
Task Manager/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Backend API Routes
│   │   │   ├── auth/           # Login, Logout, Verify, User Info
│   │   │   └── tasks/          # Task CRUD endpoints
│   │   ├── auth/               # Authentication Pages
│   │   │   ├── checkemail/     # Magic link sent notice
│   │   │   ├── login/          # Primary entry point
│   │   │   ├── UserTask/       # Main Workspace Page
│   │   │   └── verifyemail/    # Token verification landing
│   │   ├── globals.css         # Design System & Tailwind v4
│   │   ├── layout.tsx          # Root layout with Toaster
│   │   └── page.tsx            # Root redirect logic
│   ├── config/                 # Database & App configurations
│   ├── models/                 # Mongoose Data Models (User, Task)
│   ├── services/               # Internal services (Mailer, etc.)
│   ├── utils/                  # Shared utilities (JWT Logic)
│   └── proxy.ts                # Auth-checking middleware-style logic
├── public/                     # Static assets
├── .env                        # Environment variables (Sensitive)
├── tailwind.config.ts          # Styles Configuration
└── tsconfig.json               # TypeScript Configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB (via Mongoose) |
| **Styling** | Tailwind CSS v4 & Lucide Icons |
| **Auth** | JWT & HTTP-Only Cookies |
| **Notifications** | React Hot Toast |
| **Mailing** | Nodemailer |

---


## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (Atlas or local)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Khwajazeeshan/Task-Workspace
   cd Task-Workspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
    Create a `.env` file in the root with:
   ```env
   MONGODB_URL=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   DOMAIN=http://localhost:3000
   EMAIL_HOST=your_smtp_host
   EMAIL_PASS=your_smtp_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

---


## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Khawaja Zeeshan]
