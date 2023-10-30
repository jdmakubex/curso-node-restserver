
const { Router } = require ('express');
const { check } =  require ('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//Aqui falta todavía un argumento
router.post('/login', [
    check('correo', 'El corrreo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos

],login );


module.exports = router;