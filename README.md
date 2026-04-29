# 📚 Library Management Backend

A prototype backend for a Library Management System built using Node.js and Express.js. This project demonstrates RESTful API design, modular backend structure, and multiple smart features.

---

## 🚀 Features

### 🤖 AI Book Recommendation

* Recommends books based on user preferences and reading history
* Uses simple keyword matching logic

### 📖 Personalized Dictionary

* Save words with meaning and examples
* Full CRUD support (Create, Read, Update, Delete)

### 💬 Chat with Book

* Ask questions about a book
* Simulated responses using keyword matching

### 📝 Auto Summary

* Generates short summaries from book content

### 🔊 Text-to-Speech (TTS)

* Converts text to speech (mock API response)

### 📊 Reading Analytics Dashboard

* Tracks reading time
* Tracks books completed

---

## 🛠 Tech Stack

* Node.js
* Express.js
* In-memory database

---

## 📂 Project Structure

library-backend/
│
├── server.js
├── package.json
├── README.md

---

## ▶️ How to Run

1. Install dependencies:
   npm install

2. Start server:
   node server.js

3. Server runs at:
   http://localhost:3000

---

## 📡 API Endpoints

### 👤 Users

* GET /users
* POST /users
* PUT /users/:id
* DELETE /users/:id

### 📚 Books

* GET /books
* POST /books
* PUT /books/:id
* DELETE /books/:id

### 🤖 Recommendation

* GET /recommend/:userId

### 📖 Dictionary

* POST /dictionary
* GET /dictionary/:userId
* PUT /dictionary/:id
* DELETE /dictionary/:id

### 💬 Chat

* POST /chat

### 📝 Summary

* POST /summary

### 🔊 Text-to-Speech

* POST /tts

### 📊 Analytics

* POST /reading-session
* GET /analytics/:userId

---

## 💡 Future Improvements

* Add MongoDB integration
* Add JWT Authentication
* Integrate real AI APIs
* Build frontend using React

---

## 👩‍💻 Author

Arpita Sharma
