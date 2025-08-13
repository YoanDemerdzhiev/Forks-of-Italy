import User from '../models/User.js';
import { generateToken } from '../utils/userUtils.js';
import bcrypt from 'bcrypt';

export default {
    async register(userData) {
        const { username, email, password,repassword } = userData;
        
        if (password !== repassword) {
            throw new Error('Passwords do not match');
        }
        
        const newUser = await User.create(userData);
        const token = generateToken(newUser);
        return token;
    },
    async login(email, password) {
        const user = await User.findOne({email});
        
        if (!user) {
            throw new Error('No such user exists!');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Incorrect email or password!');
        }

        const token = generateToken(user);
        return token;
    }
}