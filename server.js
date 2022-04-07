const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { default: mongoose } = require('mongoose');
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Mongoose
mongoose.connect("mongodb+srv://hustin-admin:w3SqCXnl4qXMJ7vt@cluster0.9qvpn.mongodb.net/checkin-and-checkout?retryWrites=true&w=majority");

// data scema and model
const userSchema = {
    course: String,
    la: String,
    user: String
}

const Users = mongoose.model("Users", userSchema);

// API routes
app.get('/users', (req, res) => {
    // res.send("express is here")
    Users.find().then(users => res.json(users));
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})