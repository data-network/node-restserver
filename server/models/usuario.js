const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesVarios = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesVarios
    },
    estado: {
        type: Boolean,
        default: true
    },
    goolge: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;

    return userObj;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' });
module.exports = mongoose.model('Usuario', usuarioSchema);