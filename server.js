const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { default: mongoose } = require('mongoose');
// Setting up socket.io
const socketIo = require('socket.io');
const http = require('http');
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
    asset: { type: String, required: false },
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
    const asset = req.body.asset;
    const user = req.body.user;

    const newUser = new Users ({
        course,
        la,
        asset,
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

// Creating socket connection
const server = http.createServer(app)
const io = socketIo(server);
io.on('connection', client => {
  console.log('connected')

  client.on('event', data => { console.log("this is the data: ",data)
  
  io.emit('getUser', data)

  io.emit('saveUser', data)
  
  });

  
  client.on('disconnect', () => { console.log('disconnect')});
});

server.listen(port, () => {
    console.log(`running on port ${port}`)
})