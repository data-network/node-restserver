require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Hola Mundo')
})

app.get('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Get Usuario')
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.Nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es requerido'
        });
    } else {
        res.json({
            body
        });
    }

    res.json('Post Usuario')
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id

    res.json({
        id
    });

    res.json('Put Usuario')
})

app.delete('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})