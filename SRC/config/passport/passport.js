import local from 'passport-local'
import passport from 'passport'
import {userModel} from '../../models/users.js'
import {createHash, comparePSW} from '../../utils/bcrypt.js'
import GitHubStrategy from 'passport-github2'
import crypto from 'crypto'

// Estrategia de autenticación (en este caso, local)
const localStrategy = local.Strategy

// Función que INICIALIZA todas las estrategias de registro/login local. 
// Al correrse la función, las estrategias ya quedan activadas

const initializatePassport = () => {

    // Defino la primera estrategia dentro de las estrategias locales (con usuario y pass) y la llamo REGISTER.
    // La función de callback recibirá 4 parámetros: req (lo habilito desde passReqToCallback),
    // el username (que en este caso le cambiamos el nombre a 'email' desde usernameField: 'email'), el password,
    // y la función done que es para devolver el estado del logueo/registro. Esta función toma 2 valores. Primero el error, si hubo, y segundo 
    // un estado que puede ser true/false de acorde a si hubo éxito en el login/registro. Se suele poner false y el valor del usuario logueado (equivalente a true)
    // Si no hubo ningún problema, se suele poner 'null' en el error, indicando que no lo hubo. Simplemente se pudo/no se pudo loguear/registrar.
    // Obtiene por el body el resto de los datos para registro.

    passport.use('register', new localStrategy (
        {passReqToCallback: true, usernameField: 'email'}, async (req, email, password, done) => {
            
            try {
                // Solicito el resto de los valores, sacando username (email en este caso) y password
                const {first_name, last_name, age} = req.body  
                const user = await userModel.findOne({email: email})
        
                if (user)
        
                // Si ya lo tenía cargado, devuelvo "true" con su código asociado
                {
                    console.log("Intento de registro con correo ya cargado")
                    return done(null, 'previously_registered')
                }

                // Caso contrario, lo creo y devuelvo "true" con su código correspondiente.
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

    passport.deserializeUser(async (user, done) => {
        done(null, user)
    })

    // Función para loguear al usuario. Devuelve un código 401 con texto "Unauthorized" en caso de usuario
    // y contraseña incorrecta o el usuario en cuestión en caso de éxito 

    passport.use('login', new localStrategy (
        {usernameField: 'email'}, async (email, password, done) => {

            try {
                const user = await userModel.findOne({email: email}).lean()
                if (user && (comparePSW(password, user.password)))

                {
                    console.log("Logueo de usuario exitoso!")
                    return done (null, user)
                }

                else {
                    console.log("Intento de logueo de usuario sin éxito!")
                    return done(null, false);
                }
            }
        
            catch (error)
        
            {
                console.log("Error al loguear usuario!")
                return done(error)
            }}
    ))

    // Estrategia para autenticar a un usuario a través de GitHub.
    // Aclaración: Se solicita el email, pero es posible que el usuario no tenga su email
    // configurado de manera pública. Para este trabajo se considera EL EMAIL ES PÚBLICO

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liAMlvc8ItBq5qT5",
        clientSecret: "42807b3021eae3e7ad77f5adde3a0ed06292814f",
        callbackURL: "http://localhost:8080/sessions/githubSession",
        scope: ['user:email'] // Solicitud del email
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Caso que su email no sea público

            if (!profile._json.email)

            {
                console.log("Logueo con GitHub usando email en privado"),
                done(null, false)
            }

            else

            {
                // Caso que ya esté guardado el usuario
                const user = await userModel.findOne({email: profile._json.email}).lean()
                if (user) {
                    console.log("Cliente logueado con GitHub: previamente cargado")
                    done(null, user)
                }

                // Caso que sea un usuario nuevo
                else {
                    const randomString = crypto.randomBytes(10).toString('hex')

                    let first_name = profile._json.name
                    
                    // Caso que el nombre esté vacío (por default viene vacío)
                    !first_name && (first_name = profile._json.login)

                    // La contraseña será la combinación del nombre(ó usuario) + caracteres aleatorios
                    let password = createHash(first_name + randomString)

                    const userCreated = await userModel.create({ first_name: first_name, last_name: ' ', email: profile._json.email, age: 18, password: password})
                    console.log("Cliente logueado con GitHub: primer login, cargado en DB")
                    done(null, userCreated)
                }
            }
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializatePassport