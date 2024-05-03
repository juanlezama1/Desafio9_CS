import local from 'passport-local'
import passport from 'passport'
import {userModel} from '../../models/users.js'
import {createHash, comparePSW} from '../../utils/bcrypt.js'

// Estrategia de autenticación (en este caso, local)
const localStrategy = local.Strategy

// Función que INICIALIZA todas las estrategias de registro/login local. 
// Al correrse la función, las estrategias ya quedan activadas

const initializatePassport = () => {

    // Defino la primera estrategia dentro de las estrategias locales (con usuario y pass) y la llamo REGISTER.
    // La función de callback recibirá 4 parámetros: req (lo habilito desde passReqToCallback),
    // el username (que en este caso le cambiamos el nombre a 'email' desde usernameField: 'email'), el password,
    // y la función done que es para devolver el estado del logueo/registro. Esta función toma 2 valores. Primero el error, si hubo, y segundo 
    // un estado que puede ser true/false de acorde a si hubo éxito en el login/registro
    // - Si no hubo ningún problema, se suele poner 'null' en el error, indicando que no lo hubo. Simplemente se pudo/no se pudo loguear/registrar.
    // Obtiene por el body el resto de los datos para registro.

    passport.use('register', new localStrategy (
        {passReqToCallback: true, usernameField: 'email'}, async (req, email, password, done) => {
            
            try {
                const {first_name, last_name, age} = req.body  
                const user = await userModel.findOne({email: email})
        
                if (user)
        
                {
                    console.log("Intento de registro con correo ya cargado")
                    return done(null, 'previously_registered')
                }

                else {
                    const my_user = await userModel.create({first_name: first_name, last_name: last_name, age: age, email: email, password: createHash(password)}) 
                    console.log("Usuario registrado con éxito en la DB!")
                    return done(null, 'registered')
                }
            }
        
            catch (error)

            {
                return done(error)
            }
        }
    )) 

    // Función para inicializar la sesión del usuario. Sólo se accede si las estrategias de registro/autenticación
    // vuelven con un usuario/valor lógico true. 

    // En caso de éxito, configura un req.user con el valor recibido desde la función 'done'

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    // Función para eliminar la sesión de un usuario
    passport.deserializeUser(async (user, done) => {
        done(null, user)
    })

    passport.use('login', new localStrategy (
        {usernameField: 'email'}, async (username, password, done) => {

            try {
                const user = await userModel.findOne({email: username}).lean()
                if (user && (comparePSW(password, user.password)))

                {
                    console.log("Logueo de usuario exitoso!")
                    return done (null, user)
                }

                else {
                    console.log("Intento de logueo de usuario sin éxito!")
                    return done (null, false)
                }
            }
        
            catch (error)
        
            {
                console.log("Error al loguear usuario!")
                return done(error)
            }}
    ))
}

export default initializatePassport