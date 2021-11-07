var Note = require('../models/note');

module.exports = function(app) {

    // create a new note 
    app.post('/notes', function (req, res, next) {
        try {
            var note = new Note(req.body);
            note.save(function (err, note) {
                if (err) {
                    return next(err);
                }
                return res.status(201).json(note);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error creating a new note'});
        }
    });

    // get all notes
    app.get('/notes', function (req, res, next) {
        try {
            Note.find(function (err, notes) {
                if (err) {
                    return next(err);
                }
                return res.json({'notes': notes});
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error fetching all notes'});
        }
    });

    //get note by id
    app.get('/notes/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Note.findById(id, function (err, note) {
                if (err) { return next(err);}
                if (note == null) {
                    return res.status(404).json({'message': 'Note not found'});
                }
                return res.json(note);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error fetching note'});
        }
    });

    // update a note
    app.put('/notes/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Note.findById(id, function (err, note) {
                if (err) { return next(err);}
                if (note == null) {
                    return res.status(404).json({'message': 'Note not found'});
                }
                note.headline = req.body.headline;
                note.content = req.body.content;
                note.writer = req.body.writer;
                note.save();
                return res.json(note);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error updating note'});
        }
    });

    // partially update specific note
    app.patch('/notes/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Note.findById(id, function (err, note) {
                if (err) {
                    return next(err);
                }
                if (note == null) {
                    return res.status(404).json({'message': 'Note not found'});
                }
                note.headline = (req.body.headline || note.headline);
                note.content = (req.body.content || note.content);
                note.writer = (req.body.writer || note.writer);
                note.save();
                return res.json(note);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error updating note'});
        }
    });

    //delete all notes
    app.delete('/notes', function (req, res, next) {
        try {
            Note.remove({}, function (err, notes) {
                if (err) {
                    return next(err);
                }
                return res.json(notes);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error deleting all notes'});
        }
    }); 
    
    // delete note by id
    app.delete('/notes/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Note.findOneAndDelete({_id: id}, function (err, note) {
                if (err) {
                    return next(err);
                }
                if (note == null) {
                    return res.status(404).json({'message': 'Note not found'});
                }
                return res.json(note);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error deleting note'});
        }
    });
};