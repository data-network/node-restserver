const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImage } = require('../middleware/autentication');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImage, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = app;