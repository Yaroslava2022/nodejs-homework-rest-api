import {HttpError} from "../helpers/index.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../decorators/index.js";

const {JWT_SECRET}= process.env;

const signup = async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	};
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        // password: newUser.password,
		email: newUser.email,
        subscription: newUser.subscription,
    })
}

const signin = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

    const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "email or password is wrong");
	}

    const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
	// await User.findByIdAndUpdate(user._id, { token });

	res.json({ token });
};

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
}