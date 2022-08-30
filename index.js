require('dotenv').config();

const express = require('express')
var cors = require('cors')
const app = express()
const Note = require('./models/Note');

app.use(cors())
app.use(express.json());
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/notes', (request, response, next) => {
  const body = request.body;
  
  const note = new Note({
    title: body.title,
    author: body.author,
    note: body.note
  });

  note.save()
    .then(savedNote => {
      response.json(savedNote);
    })
    .catch(error => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.use((request, response) => {
  response.status(404).end();
});

app.use((error, request, response, next) => {
  console.error(error.message);
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  
  next(error);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});