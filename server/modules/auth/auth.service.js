import { User } from "../../model/authModel.js"
import bcrypt from "bcryptjs"
import { generateJwtToken } from "../../utils/generateToken.js"


export const registerUserService = async ({ username, password, role }) => {
    const userExists = await User.findOne({ username });
    if (userExists) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ username, password: hashedPassword, role });

    return {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateJwtToken(user._id, user.role),
    };
}


export const loginUserService = async ({ username, password }) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('user not found !');
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        throw new Error('Invalid username or password');
    }

    return {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateJwtToken(user._id, user.role),
    };
};
