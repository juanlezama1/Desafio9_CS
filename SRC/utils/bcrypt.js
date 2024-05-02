import bcrypt, { hash } from 'bcrypt'

const hash_cost = 12 // Variable que determina la 'cantidad de rondas de encriptación' que sufrirá la pass

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(hash_cost))
}

const comparePSW = (psw_preHash, psw_postHash) => {
    return bcrypt.compareSync(psw_preHash, psw_postHash)
} 

// EJEMPLOS

// console.log('Resultado de Hashear "frida1308": ', createHash('frida1308')) // choclazo
// const hashed_PSW = createHash('frida1308')
// console.log("¿La contraseña era 1234? ", comparePSW('1234', hashed_PSW)) // false
// console.log("¿La contraseña era frida1308? ", comparePSW('frida1308', hashed_PSW)) // true

export {createHash, comparePSW}
