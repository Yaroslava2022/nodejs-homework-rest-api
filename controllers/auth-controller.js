import {HttpError} from "../helpers/index.js";
import User from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

const signup = async(req, res) => {
    // const { email, password } = req.body;
    const newUser = await User.create(req.body);
    res.status(201).json({
        password: newUser.password,
		email: newUser.email,
    })
}
export default {
    signup: ctrlWrapper(signup),
}