const { response, request, json } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

/**
 * Desde el postman en el delete, enviamos en header key: x-tokeb y su valor,
 * por lo que esta vez, ya no recibiremos los datos del body, si no del header, como se muestra en la siguiente funcion
 */
const validarJWT = async(req= request, res = response, next) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            msg: 'No hay roken en la petición'
        });
    }

    try {
        //Esta función sirve para verificar el JWTconst 
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        //Validar que el usuario existe
        if (!usuario){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existente en BD'
            })
        }

        // Verificar si el UID tiene estado en true
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }



        //console.log(payload);
        req.usuario = usuario;
        next();
    } catch (error){
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })

    }

}


module.exports = {
    validarJWT
}
