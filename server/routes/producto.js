const express = require('express');
const { verificaToken } = require('../middleware/autentication');

let app = express();
let Producto = require('../models/producto');

// ================================
// Obtener Productos
// ================================
app.get('/productos', verificaToken, (req, res) => {
    // traer todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        //.sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .limit(limite)
        .skip(desde)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ================================
// Obtener un Prodcuto por id
// ================================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    err: 'El id no es valido'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ================================
// Buscar Prductos
// ================================
app.get('/productos/buscar/:dato', verificaToken, (req, res) => {
    let dato = req.params.dato;
    let regex = new RegExp(dato, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ================================
// Crear un Prducto
// ================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// ================================
// Actualizar Prodcuto
// ================================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;
    let updateProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    }


    //let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

    Producto.findByIdAndUpdate(id, updateProducto, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: 'Error al actualizar el producto'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ================================
// Borrar un producto
// ================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let estadoProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, estadoProducto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'El producto ha sido borrado.'
        });
    });
});

module.exports = app;