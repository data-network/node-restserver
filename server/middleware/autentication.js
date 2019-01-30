const jwt = require('jsonwebtoken');

// Verificacion de token

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.DATA_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido.'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

    // res.json({
    //     token
    // })
};

let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    // if (!usuario) {
    //     return res.json({
    //         ok: false,
    //         err: {
    //             message: 'El usuario no es admin.'
    //         }
    //     });
    // }

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es admin.'
            }
        });
    } else {
        next()
    }
};

module.exports = {
    verificaToken,
    verificaRole
}