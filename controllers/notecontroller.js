const db = require('../config/db');
const Note = require('../models/note');

exports.createNote = async (req, res) => {
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
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        await Note.findByIdAndDelete(id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};