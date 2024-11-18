// const express = require('express');
// const router = express.Router();
// const noteController = require('../controllers/notecontroller');
// const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

// // Define routes with authentication middleware
// router.post('/notes', authMiddleware, noteController.createNote);
// router.get('/notes',  noteController.getNotes);
// router.put('/notes/:id',  noteController.updateNote);
// router.delete('/notes/:id',  noteController.deleteNote);

// module.exports = router;
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get Notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Note
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = new Note({
      title,
      content,
      user: req.user.id,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Note
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Note
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
