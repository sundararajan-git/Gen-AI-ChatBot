import { loginUserService, registerUserService } from "./auth.service.js";
import { validateLogin, validateRegister } from "./auth.validation.js";


export const registerUser = async (req, res) => {
    try {
        const error = validateRegister(req.body)
        if (error) return res.status(400).json({ message: error })

        const result = await registerUserService(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


export const loginUser = async (req, res) => {
    try {
        const error = validateLogin(req.body);
        if (error) return res.status(400).json({ message: error });

        const result = await loginUserService(req.body);
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: err.message });
    }
};


export const checkUser = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            username: req.user.username,
            role: req.user.role,
            token: req.headers.authorization.split(' ')[1]
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
