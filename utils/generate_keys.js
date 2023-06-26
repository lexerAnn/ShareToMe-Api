const cryto = require('crypto')

const access_key = cryto.randomBytes(32).toString('hex')
const refresh_key = cryto.randomBytes(32).toString('hex')
console.table({access_key, refresh_key})