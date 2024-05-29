const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors());

const users = [];

const secretKey = 'A123456,';

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
