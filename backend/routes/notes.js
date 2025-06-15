import express from 'express';
import Note from '../models/Note.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Get all notes
router.get('/', async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

// Get one note
router.get('/:id', async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
  note ? res.json(note) : res.status(404).json({ message: 'Note not found' });
});

// Create note
router.post('/', async (req, res) => {
  const note = await Note.create({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
  });
  res.status(201).json(note);
});

// Edit note
router.put('/:id', async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  updated ? res.json(updated) : res.status(404).json({ message: 'Note not found' });
});

// Delete note
router.delete('/:id', async (req, res) => {
  const deleted = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  deleted ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Note not found' });
});

export default router;
