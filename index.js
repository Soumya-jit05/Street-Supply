const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const Request = require('./models/Request');

const app = express();
const PORT = process.env.PORT || 4001;

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Database connection error:', err));

// ✅ GET: Render Dashboard
app.get('/', async (req, res) => {
  const requests = await Request.find().sort({ date: -1 });
  res.render('dashboard', { requests });
});

// ✅ POST: Save new customer request
app.post('/request', async (req, res) => {
  const { customerName, product } = req.body;
  const newRequest = new Request({ customerName, product });
  await newRequest.save();
  res.redirect('/');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
