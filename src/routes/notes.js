const express = require('express')
const router = express.Router();
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({ user: req.user.id }).sort({ date: "desc" })
        .then(documents => {
            const context = {
                notes: documents.map(document => {
                    return {
                        title: document.title,
                        description: document.description,
                        id: document.id
                    }
                })
            }
            res.render('notes/all-notes', {
                notes: context.notes
            })
        })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    console.log(note);
    res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes')
})



router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    console.log('pase por aqui')
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please Write a Title' });
    }
    if (!description) {
        errors.push({ text: 'Please Write a Description' });
    }
    if (errors.length > 0) {
        return res.render('notes/new-notes', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfuly');
        res.redirect('/notes');
    }

});

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-notes');
});




module.exports = router