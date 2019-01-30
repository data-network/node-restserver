const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole } = require('../middleware/autentication');
const app = express();

app.get('/', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Hola Mundo')
})

app.get('/usuario', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // res.json({
            //     ok: true,
            //     usuarios
            // });

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                });
            });
        });
    //res.send('Hola Mundo');
    //res.json('Get Usuario LOCAL!')
})

app.post('/usuario', [verificaToken, verificaRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

app.put('/usuario/:id', [verificaToken, verificaRole], function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // res.json('Put Usuario')
})

app.delete('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambioEstado = { estado: false }

    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: { message: 'El usuario no existe' }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
})

module.exports = app;