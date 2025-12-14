# Incubyte Assignment - Sweets Management System

A full-stack web application for managing a sweets inventory, featuring user authentication, role-based access control (Admin/User), and a responsive dashboard.

## 🚀 Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt
* **Testing:** Jest & Supertest

### Frontend
* **Framework:** React (via Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State/Routing:** React Router DOM, Context API
* **HTTP Client:** Axios
* **Notifications:** React Hot Toast

---

## ✨ Features

* **Authentication:** Secure Login and Registration system.
* **Protected Routes:** accessible only to authenticated users.
* **Dashboard:** View available sweets and inventory status.
* **Admin Operations:**
    * **Restock:** Admins can increase the quantity of existing sweets.
    * **Delete:** Admins can remove items from the inventory.
* **Responsive Design:** Built with Tailwind CSS for mobile and desktop compatibility.

---

## 🛠️ Installation & Setup

### Prerequisites
* Node.js (v18+ recommended)
* PostgreSQL installed and running

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
````

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` root and configure your environment variables:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name?schema=public"
JWT_SECRET="your_super_secret_key"
```

Run Database Migrations:

```bash
npx prisma migrate dev
```

Start the Development Server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### 2\. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Development Server:

```bash
npm run dev
```

The application will typically run on `http://localhost:5173`.

-----

## 🧪 Running Tests

The backend includes integration tests for API endpoints, specifically covering admin operations like restocking and deletion.

To run the backend tests:

```bash
cd backend
npm test
```

> **Note:** Ensure your test database is configured correctly in your environment or Prisma schema before running tests.

-----

## 📂 Project Structure

```
incubyte_assignment/
├── backend/                # Express + Prisma API
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes (Auth, Sweets)
│   │   ├── tests/          # Jest integration tests
│   │   └── index.ts        # Entry point
│   └── package.json
│
└── frontend/               # React + Vite Client
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # Auth Context
    │   ├── pages/          # Auth, Dashboard
    │   └── App.tsx         # Main component with Routing
    └── package.json
```

-----

## 👏 Acknowledgments

  * **AI Contribution:** The backend test suite (`src/tests/sweets.test.ts`) was written with the assistance of **Bard (Google Gemini)**, which also provided significant aid in debugging and error fixing during the development process.

<!-- end list -->

```
```