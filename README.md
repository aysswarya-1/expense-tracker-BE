
# Backend Express Application

This is a backend Express.js application that provides authentication, dashboard, income, expense, and image upload APIs.

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:aysswary/expense-tracker-BE.git
   cd expense-tracker-BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## 👨‍💻 Development

- Start the development server with **Nodemon**:
  ```bash
  npm run dev
  ```
- For production (regular node server):
  ```bash
  npm start
  ```

---

## 📚 API Guide

### Base URL
```
http://localhost:<port>/
```

### Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/auth/login` | Login with user credentials |
| POST   | `/api/v1/auth/register` | Register a new user |
| GET    | `/api/v1/auth/getUser` | Retrieve authenticated user info |
| POST   | `/api/v1/auth/upload-image` | Upload a profile image |

---

### Dashboard APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/v1/dashboard` | Get dashboard data |

---

### Income APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/income/add` | Add new income record |
| GET    | `/api/v1/income/get` | Get all income records |
| DELETE | `/api/v1/income/:incomeid` | Delete income by ID |
| GET    | `/api/v1/income/downloadexcel` | Download income data as Excel |

---

### Expense APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/expense/add` | Add new expense record |
| GET    | `/api/v1/expense/get` | Get all expense records |
| DELETE | `/api/v1/expense/:expenseid` | Delete expense by ID |
| GET    | `/api/v1/expense/downloadexcel` | Download expense data as Excel |

---

## 🛠️ Environment Variables
Ensure you have a `.env` file at the root with necessary environment variables, for example:
```
PORT=8000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
```

---

## 📂 Project Structure (Sample)
```
/expense-tracker-BE
├── config/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── uploads/
├── server.js
└── package.json
```
