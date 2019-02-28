const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));
//app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado el archivo.'
            }
        });
    }

    let tiposValdation = ['productos', 'usuarios'];

    if (tiposValdation.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValdation.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArr = archivo.name.split('.');
    let ext = nombreArr[nombreArr.length - 1];

    let extValidation = ['jpg', 'png', 'gif', 'jpeg'];

    if (extValidation.indexOf(ext) <= 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extValidation.join(', '),
                ext
            }
        });
    }

    //
    let uniqueName = `${id}-${new Date().getMilliseconds()}.${ext}`;

    archivo.mv(`uploads/${tipo}/${uniqueName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'productos') {
            imagenProducto(id, res, uniqueName);
        } else {
            imagenUsuario(id, res, uniqueName);
        }

        /*res.json({
            ok: true,
            message: 'El archivo se ha subido correctamente'
        });*/
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioSave) => {
            res.json({
                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSave) => {
            res.json({
                ok: true,
                producto: productoSave,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo(nombreImg, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;