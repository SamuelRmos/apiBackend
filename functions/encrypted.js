const crypto = require('crypto')

module.exports = {

genRandomString: (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0, length);
},

sha512: (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest("hex");
    return {
        salt : salt,
        passwordHash:value
    };
},

saltHashPassword(userPassword) {
    const salt = this.genRandomString(16)
    const passwordData = this.sha512(userPassword,salt)
    return passwordData;
},

checkHashPassword(userPassword,salt){

    const passwordData = this.sha512(userPassword,salt)
    return passwordData;
    }
};