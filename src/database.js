const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rafaelmoreno21:21092010Rafael@cluster0.ka9et.mongodb.net/notes-app?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));