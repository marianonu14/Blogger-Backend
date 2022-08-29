const mongoose = require('mongoose');

const url = process.env.MONGO_DB_URI;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    title: String,
    author: String,
    note: String
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;