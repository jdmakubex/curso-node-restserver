const { response, request } = require ('express');
const bcryptjs = require ('bcryptjs');



const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    //const {q, nombre = 'No Name', apikey, page=1, limit} = req.query;
    //Se establecen los parametros que se esperan del body
    const { limite = 5, desde = 0} = req.query;
    //Estado = true, para mostrar solo los de estatus activo
    const query = {estado: true}

    /*
    //Primera implemenación
    //Obteniendo los registros de la base de datos
    const usuarios = await Usuario.find( query ) 
        //.skip sirve para poner desde que numero de registro comienzas a mostrar
        .skip (Number( desde )) //Se parsea a number porque es lo que espera como argumento el metodo
        //.limit sirve para mostrar un numero de registros y no traer todo de la BD
        .limit(Number(limite));
    //Haciendo get de total de documentos
    const total = await Usuario.countDocuments( query );
    */
    

    /**
     * PROMESAS
     * Este es un ejemplo claro de promesas, en el cual nos aseguraremos de que se ejecuten los callbacks
     * de las funciones: usuarios y total en forma simultanea, y cuando ambos acaben retornará la repuesta
     * el await no va a ayudar a que se espere a que espere la resolución de las dos promesas.
     * Promise.all([]) es un metodo que nos ayuda a definir un grupo de promesas que se van a ejecutar de forma simultánea
     */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query ) 
        //.skip sirve para poner desde que numero de registro comienzas a mostrar
        .skip (Number( desde )) //Se parsea a number porque es lo que espera como argumento el metodo
        //.limit sirve para mostrar un numero de registros y no traer todo de la BD
        .limit(Number(limite))

    ]);

    //Esta es la respuesta que se muestrea como json
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res) => {    

    const { nombre,correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    


    //Encriptar la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //

    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut =  async(req, res = response) => {

    const {id} = req.params;
    const { _id, password,google, correo, ...resto } =req.body;

    //TODO validar contra base de datos
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json( usuario );
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    });
}

const usuariosDelete =  async(req, res =  response) => {

    const { id } = req.params;

    const uid = req.uid;

     /**
     * Este tipo de borrado no se recomienda por que se peude peder la integridad referencial
     */
    //Borrado físico de la BD
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Esta es la forma optima de hacer el delete, solo cambiando al usuario de estatus
    const usuario = await Usuario.findByIdAndUpdate (id, { estado:false } );

    const usuariAutenticado = req.usuario;
   
    //Para mostrar en formato json los datos, hacemos los siguiente, no olvidar {}, cuando son varios datos
    res.json( usuario );
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}