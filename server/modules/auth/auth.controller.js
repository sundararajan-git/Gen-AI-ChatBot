import { loginUserService, registerUserService } from "./auth.service";
import { validateLogin, validateRegister } from "./auth.validation";


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
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
