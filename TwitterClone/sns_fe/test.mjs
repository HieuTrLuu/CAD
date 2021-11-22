import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userInfo } from 'os';
dotenv.config();
console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`)
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log(`hash ${hash}`)
        // Store hash in your password DB.
    });
});

const token = JWT.sign({email,id:userInfo.id}, JWT_SECRET,{expiresIn:'1d'})
// jwt.verify(token, secretOrPublicKey, [options, callback]) => this is how you verify the json token
// We can go on and send the token with every request inside the HTTP authorization header

// https://github.com/auth0/node-jsonwebtoken
// https://www.npmjs.com/package/bcrypt

// atm all user are the same
