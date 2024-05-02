import local from 'passport-local'
import passport from 'passport'
import {userModel} from '../../models/users.js'
import {createHash, comparePSW} from '../../utils/bcrypt.js'

// Estrategia de autenticación (en este caso, local)
const localStrategy = local.Strategy

// Función que INICIALIZA todas las estrategias de registro/login local. 
// Al correrse la función, las estrategias ya quedan activadas

const initializatePassport = () => {

    // Defino la primera estrategia dentro de las estrategias locales, y la llamo REGISTER.
    // Obtiene por el body los datos para registro.

    passport.use('register', new localStrategy (
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            
            try {
                const {first_name, last_name, age, email, password} = req.body  
                const user = await userModel.findOne({email: email})
        
                if (user)
        
                {
                    console.log("Intento de registro con correo ya cargado")
                    return done(null, false)
                }

                else {
                    await userModel.create({first_name: first_name, last_name: last_name, age: age, email: email, password: createHash(password)}) 
                    console.log("Usuario registrado con éxito en la DB!")
                    return done(null, true)
                }
            }
        
            catch (error)

            {
                return done(error)
            }
        }
    )) 

    // Función para inicializar la sesión del usuario

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