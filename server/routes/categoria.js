const express = require('express');
//const _ = require('underscore');

const { verificaToken, verificaRole } = require('../middleware/autentication');
const app = express();
const Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })
        });
});

// ============================
// Mostrar una categoria por Id
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(.....);
    let id = req.params.id;

    Categoria.findById(id, (err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El Id no es correcto'
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaDB
        })
    })
});

// ============================
// Crear una categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    //regresar la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: CategoriaDB
        });
    });
});

// ============================
// Actualizar una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'usuario']);
    let body = req.body;
    let nombreCategoria = {
        nombre: body.nombre
    }

    Categoria.findByIdAndUpdate(id, nombreCategoria, { new: true, runValidators: true }, (err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: CategoriaDB
        });
    });
});

// ============================
// Eliminar una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    //solo admin puede borrar
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    let cambioEstado = { estado: false };

    Categoria.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, CategoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'La categoria ha sido borrada.'
        });
    });
});

module.exports = app;