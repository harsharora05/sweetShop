#  Sweet Store 

## 📖 Overview  
**Sweet Store** is a full-stack web application built using the **MERN Stack**.  
It allows users to browse, search, and purchase sweets while admins can manage sweets, categories, and pricing.  

The project demonstrates complete CRUD operations, JWT-based authentication, RESTful API integration, and responsive UI.

---

## ⚙️ Features

### 👤 User
- Register and login securely using JWT.
- Browse all sweets.
- Filter sweets by **name**, **category**, and **price range**.
- View detailed information about each sweet.
- Purchase sweets

### 🧑‍💼 Admin
- Add new sweets.
- Edit or delete sweets.
- Restock sweets and manage inventory.
- Search sweets by name or category.


---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, TypeScript, Zustand, TailwindCSS, React Toastify |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT |
| **Deployment** | Backend (AWS EC2) • Frontend (Vercel) |

---

## 📁 Project Structure

```
sweet-store/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── tests/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/harsharora05/sweetShop.git
cd sweetShop
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/sweetstore
JWT_SECRET=supersecret
```

Run backend:
```bash
npm run start
```

Backend runs at ➜ `http://localhost:3000`

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```


Run frontend:
```bash
npm run dev
```

Frontend runs at ➜ `http://localhost:5173`

---

## 🧪 Testing

To run backend tests:
```bash
cd backend
npm run test
```

Expected Output:
```
PASS  tests/user.test.ts
PASS  tests/sweet.test.ts
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

📄 Test report Image included at:  
<img width="1440" height="876" alt="Screenshot 2025-11-02 at 8 04 10 PM" src="https://github.com/user-attachments/assets/eb0dea75-4ca6-40dc-88fe-216fa784451d" />



---

## 📸 Screenshots

| Feature | Screenshot |
|----------|-------------|


| 🏠 Home Page
<img width="1440" height="834" alt="Screenshot 2025-11-02 at 8 06 12 PM" src="https://github.com/user-attachments/assets/2142a8eb-8a73-4c5f-9b44-898209912254" />

| 🔐 Login/Register Page 
<img width="1440" height="834" alt="Screenshot 2025-11-02 at 8 05 40 PM" src="https://github.com/user-attachments/assets/a5f8586c-2019-4ba3-965e-8f280fef65bf" />
<img width="1440" height="834" alt="Screenshot 2025-11-02 at 8 05 51 PM" src="https://github.com/user-attachments/assets/19792743-1d7f-4874-a060-6017b40144d4" />
| ⚙️ Admin Dashboard 
<img width="1440" height="834" alt="Screenshot 2025-11-02 at 8 06 49 PM" src="https://github.com/user-attachments/assets/6f2d9e1c-55d6-440c-8b69-9e0e1b64e104" />

---

## 🤖 My AI Usage

I used **ChatGPT (GPT-5)** to:
- Generate basic sweets card and filter bar.  
- Debug small issues in TypeScript and responses.
- Writing test cases
- Draft the structure for this README file.  

All backend logic, authentication flow, frontend integration, and database setup were implemented manually by **me (Harsh Arora)**.

---

## 🌍 Deployment Links

| Service | URL |
|----------|-----|
| **Frontend** | [https://sweetfrontend.glitchharsh.com/](https://sweetfrontend.glitchharsh.com/) |
| **Backend** | [https://sweetbackend.glitchharsh.com/](https://sweetbackend.glitchharsh.com/) |

---

## 📦 Public Repository

🔗 **GitHub Link:**  
https://github.com/harsharora05/sweetShop.git

---

## 🧑‍💻 Author
**Harsh Arora**  
MCA Student @ MIT Manipal  
📧 harsharora2407@gmail.com  

---

⭐ If you like this project, consider giving it a star on GitHub!
