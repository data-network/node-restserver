require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        //throw new Error(err);
        console.log('Error: ', err);
    }

    console.log('Base de datos online!');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});