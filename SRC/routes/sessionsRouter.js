import { Router } from "express"
import { userModel } from '../models/users.js'

const sessionsRouter = Router ()

// Ruta para cargar una sesión activa en caso de login exitoso.
sessionsRouter.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email: email})
        user && (user.password === password)? 
        (
            req.session.email = email,
            console.log("Logueo de usuario exitoso!"),
            res.status(200).redirect('/products')
        ):

        (
            res.status(401).send("Usuario o contraseña incorrecta!"),
            console.log("Intento de logueo de usuario sin éxito!")
        )
    }

    catch (error)

    {
        console.log("Error al loguear usuario!")
    }
})

// Ruta para registrar un usuario.
sessionsRouter.post('/register', async (req, res) => {
    try {
        const {first_name, last_name, age, email, password} = req.body
        const user = await userModel.findOne({email: email})

        if (user)

        {
            res.status(400).send("Correo electrónico ya registrado!")
            console.log("Intento de registro con correo ya cargado")
            return
        }

        await userModel.create({first_name, last_name, age, email, password}) 
        res.status(200).send("Usuario creado exitosamente!")
        console.log("Usuario registrado en DB!")
    }

    catch (error)

    {
        console.log("Error al registrar usuario!")
    }
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/register', async (req, res) => {
    
        res.status(200).render('templates/user_registration')
        console.log("Usuario por registrarse...")
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/login', async (req, res) => {

        res.status(200).render('templates/user_login')
        console.log("Usuario por loguearse...")
})

sessionsRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.status(200).send("Sesión finalizada con éxito!")
    }

    catch (error)

    {
        res.status(500).send("Error al finalizar sesión!")
        console.log("Error al finalizar la sesión del usuario")
    }
})

export default sessionsRouter