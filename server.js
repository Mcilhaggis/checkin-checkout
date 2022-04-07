const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { default: mongoose } = require('mongoose');
require('dotenv').config({ path: "./config.env"});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 3001;


// Mongoose
mongoose.connect(MONGO_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// data scema and model
const userSchema = {
    course: String,
    la: String,
    user: String
}

const Users = mongoose.model("Users", userSchema);

// API routes
// Get data
app.get('/users', (req, res) => {
    Users.find().then(users => res.json(users));
})

// Add user
app.post('/newuser', (req, res) => {
    const course = req.body.course;
    const la = req.body.la;
    const user = req.body.user;

    const newUser = new Users ({
        course,
        la,
        user
    });

    newUser.save()
    .then(() => res.json({ success: true }))
    .catch(err => res.send("Error"))
})

// Delete user
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    Users.findById(id)
      .then(item => item.remove()
          .then(() => res.json({ success: true })))
      .catch(err => res.send("Error"))
  });

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(port, () => {
    console.log(`running on port ${port}`)
})