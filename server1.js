// ===============================
// 📚 Library Management Backend
// ===============================

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Express 5 built-in (no body-parser needed)

// ===============================
// 🧠 In-Memory Database
// ===============================

let users = [];
let books = [];
let dictionary = [];
let readingSessions = [];

// ===============================
// 📦 Sample Data
// ===============================

books = [
  {
    id: 1,
    title: "The AI Revolution",
    author: "John Smith",
    genre: "Technology",
    cover: "https://covers.openlibrary.org/b/isbn/9781260440232-L.jpg",
    content: "Artificial intelligence is transforming the world at an unprecedented pace, reshaping industries from healthcare to finance."
  },
  {
    id: 2,
    title: "Mystery of the Night",
    author: "Jane Doe",
    genre: "Mystery",
    cover: "https://covers.openlibrary.org/b/isbn/9780596009205-L.jpg",
    content: "It was a dark and stormy night when Detective Marlowe arrived at the old manor. Nothing would be the same again."
  },
  {
    id: 3,
    title: "Learning Node.js",
    author: "Dev Guru",
    genre: "Programming",
    cover: "https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg",
    content: "Node.js is a powerful runtime environment built on Chrome's V8 JavaScript engine for building scalable network applications."
  },
  {
    id: 4,
    title: "Deep Learning",
    author: "Ian Goodfellow",
    genre: "Technology",
    cover: "https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg",
    content: "Deep Learning covers the mathematical and conceptual background of neural networks, covering modern techniques used by practitioners."
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    content: "Clean Code teaches programmers how to write code that is easy to read, easy to change, easy to extend, and easy to maintain."
  },
  {
    id: 6,
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    genre: "Programming",
    cover: "https://covers.openlibrary.org/b/isbn/9781617292231-L.jpg",
    content: "Grokking Algorithms is a guide that teaches algorithms through friendly and engaging illustrations."
  }
];

users = [
  {
    id: 1,
    name: "Arpita",
    email: "arpita@smartlib.com",
    password: "password123",
    preferences: ["Technology", "Programming"],
    readingHistory: [1]
  }
];

// ===============================
// 🛠️ Utility Functions
// ===============================

// Recommendation Logic
function recommendBooks(userId) {
  const user = users.find(u => u.id == userId);
  if (!user) return [];

  return books.filter(book =>
    user.preferences.includes(book.genre) &&
    !user.readingHistory.includes(book.id)
  );
}

// Recommend by genre keyword
function recommendByGenre(genre) {
  const normalized = genre.toLowerCase();
  return books.filter(book =>
    book.genre.toLowerCase().includes(normalized) ||
    book.title.toLowerCase().includes(normalized) ||
    book.author.toLowerCase().includes(normalized)
  );
}

// Simple Summary (first 30 words)
function summarize(text) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 30) return text;
  return words.slice(0, 30).join(" ") + "...";
}

// Chat with Book (keyword matching)
function chatWithBook(bookId, question) {
  const book = books.find(b => b.id == bookId);
  if (!book) return "Book not found.";

  const q = question.toLowerCase();

  if (q.includes("author")) return `This book was written by ${book.author}.`;
  if (q.includes("genre") || q.includes("type")) return `This book belongs to the ${book.genre} genre.`;
  if (q.includes("about") || q.includes("summary")) return summarize(book.content);
  if (q.includes("ai") || q.includes("artificial intelligence")) return "This book discusses artificial intelligence concepts in depth.";
  if (q.includes("story") || q.includes("plot")) return "This book contains an engaging storyline that will keep you hooked.";
  if (q.includes("title") || q.includes("name")) return `The title of this book is "${book.title}".`;

  return `I found your book "${book.title}" by ${book.author}. Try asking about the author, genre, or summary!`;
}

// ===============================
// 🔐 Auth Routes
// ===============================

// Register new user
app.post("/register", (req, res) => {
  const { name, email, password, preferences } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "User with this email already exists." });
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password, // ⚠️ In production, hash with bcrypt
    preferences: preferences || [],
    readingHistory: []
  };

  users.push(user);
  const { password: _, ...safeUser } = user;
  res.status(201).json({ message: "Registration successful!", user: safeUser });
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const { password: _, ...safeUser } = user;
  res.json({ message: "Login successful!", user: safeUser });
});

// ===============================
// 👤 User Routes (CRUD)
// ===============================

app.get("/users", (req, res) => res.json(users.map(({ password, ...u }) => u)));

app.post("/users", (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.json(user);
});

app.put("/users/:id", (req, res) => {
  users = users.map(u =>
    u.id == req.params.id ? { ...u, ...req.body } : u
  );
  res.json({ message: "User updated" });
});

app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: "User deleted" });
});

// ===============================
// 📖 Book Routes (CRUD)
// ===============================

app.get("/books", (req, res) => res.json(books));

// Search books by query
app.get("/books/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  if (!q) return res.json(books);
  const results = books.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.genre.toLowerCase().includes(q)
  );
  res.json(results);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const book = { id: Date.now(), ...req.body };
  books.push(book);
  res.status(201).json(book);
});

app.put("/books/:id", (req, res) => {
  const idx = books.findIndex(b => b.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Book not found" });
  books[idx] = { ...books[idx], ...req.body };
  res.json({ message: "Book updated", book: books[idx] });
});

app.delete("/books/:id", (req, res) => {
  books = books.filter(b => b.id != req.params.id);
  res.json({ message: "Book deleted" });
});

// ===============================
// 🤖 Recommendation API
// ===============================

// Recommend by userId preferences
app.get("/recommend/:userId", (req, res) => {
  const recs = recommendBooks(req.params.userId);
  res.json(recs);
});

// Recommend by genre/interest keyword
app.get("/recommend", (req, res) => {
  const genre = req.query.genre || "";
  if (!genre) return res.json(books.slice(0, 4));
  const recs = recommendByGenre(genre);
  res.json(recs);
});

// ===============================
// 📚 Personalized Dictionary (CRUD)
// ===============================

// Word definition lookup (proxies to free dictionary API concept)
app.get("/dictionary/word/:word", (req, res) => {
  const word = req.params.word;
  // Check local dictionary first
  const local = dictionary.find(d => d.word && d.word.toLowerCase() === word.toLowerCase());
  if (local) return res.json(local);
  // Return a redirect hint to use free API
  res.json({ word, message: "Use https://api.dictionaryapi.dev/api/v2/entries/en/" + word + " for definitions." });
});

app.get("/dictionary/:userId", (req, res) => {
  const userWords = dictionary.filter(d => d.userId == req.params.userId);
  res.json(userWords);
});

app.post("/dictionary", (req, res) => {
  const entry = { id: Date.now(), ...req.body };
  dictionary.push(entry);
  res.status(201).json(entry);
});

app.put("/dictionary/:id", (req, res) => {
  dictionary = dictionary.map(d =>
    d.id == req.params.id ? { ...d, ...req.body } : d
  );
  res.json({ message: "Updated" });
});

app.delete("/dictionary/:id", (req, res) => {
  dictionary = dictionary.filter(d => d.id != req.params.id);
  res.json({ message: "Deleted" });
});

// ===============================
// 💬 Chat with Book
// ===============================

app.post("/chat", (req, res) => {
  const { bookId, question } = req.body;
  if (!bookId || !question) {
    return res.status(400).json({ error: "bookId and question are required." });
  }
  const answer = chatWithBook(bookId, question);
  res.json({ answer });
});

// ===============================
// 📝 Auto Summary
// ===============================

app.post("/summary", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }
  const summary = summarize(text);
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // ~200 wpm
  res.json({ summary, wordCount, readingTime });
});

// ===============================
// 🔊 Text-to-Speech (Mock)
// ===============================

app.post("/tts", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required." });

  res.json({
    message: "TTS generated (mock)",
    audioUrl: "https://example.com/audio.mp3",
    text,
    charCount: text.length
  });
});

// ===============================
// 📊 Reading Analytics
// ===============================

app.post("/reading-session", (req, res) => {
  const session = { id: Date.now(), ...req.body };
  readingSessions.push(session);
  res.status(201).json(session);
});

app.get("/analytics/:userId", (req, res) => {
  const sessions = readingSessions.filter(
    s => s.userId == req.params.userId
  );

  const totalTime = sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
  const booksCompleted = [...new Set(sessions.map(s => s.bookId))].length;

  res.json({
    totalTimeSpent: totalTime,
    booksCompleted,
    sessionsCount: sessions.length
  });
});

// ===============================
// ⚠️ Error Handling Middleware
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ===============================
// 🚀 Server Start
// ===============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SmartLIB Server running on http://localhost:${PORT}`);
  console.log(`📚 Loaded ${books.length} books | 👤 ${users.length} users`);
});
