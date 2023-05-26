const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

// Model ToDoList
const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// Sinkronisasi model dengan database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use(express.json());

// Read all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read a single todo
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a todo
app.post('/todos', async (req, res) => {
  const { title, completed } = req.body;
  try {
    const todo = await Todo.create({ title, completed });
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      todo.title = title;
      todo.completed = completed;
      await todo.save();
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware untuk autentikasi menggunakan JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'secretKey', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };
  
  // Middleware untuk otorisasi admin
  const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
  // Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Simpan data pengguna baru ke database
      // ...
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Ambil data pengguna berdasarkan username dari database
      // ...
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Buat token JWT
      const token = jwt.sign({ username, role: user.role }, 'secretKey');
      res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Create a todo
app.post('/todos', authenticateToken, async (req, res) => {
    // Hanya pengguna yang terautentikasi yang dapat membuat todo
    // ...
  });
  
  // Read all todos
  app.get('/todos', authenticateToken, async (req, res) => {
    // Hanya pengguna yang terautentikasi yang dapat melihat semua todos
    // ...
  });
  
  // Read a single todo
  app.get('/todos/:id', authenticateToken, async (req, res) => {
    // Hanya pengguna yang terautentikasi yang dapat melihat detail todo
    // ...
  });
  
  // Update a todo
  app.put('/todos/:id', authenticateToken, async (req, res) => {
    // Hanya pengguna yang terautentikasi yang dapat mengubah todo
    // ...
  });
  
  // Delete a todo
  app.delete('/todos/:id', authenticateToken, async (req, res) => {
    // Hanya pengguna yang terautentikasi yang dapat menghapus todo
    // ...
  });
  
  // Delete all todos (admin only)
  app.delete('/todos', authenticateToken, authorizeAdmin, async (req, res) => {
    // Hanya pengguna admin yang dapat menghapus semua todos
    // ...
  });
  
  res.status(201).json(todo); // Created
  res.status(200).json(todos); // OK
  res.status(204).end(); // No Content
  res.status(401).json({ error: 'Unauthorized' }); // Unauthorized
  res.status(403).json({ error: 'Forbidden' }); // Forbidden
  res.status(404).json({ error: 'Todo not found' }); // Not Found
  res.status(500).json({ error: 'Internal server error' }); // Internal Server Error
  