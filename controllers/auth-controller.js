
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {HttpError} from "../helpers/index.js";
import User from "../models/user.js";
import { ctrlWrapper } from "../decorators/index.js";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";

const { JWT_SECRET }= process.env;
const avatarDir = path.resolve("public", "avatars");
const avatarSize = 250;

const signup = async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	};
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL,});

    res.status(201).json({
        
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

	const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
	await User.findByIdAndUpdate(user._id, { token });
   
	res.json({ token });
};

const getCurrent = (req, res) => {
	const { subscription, email } = req.user;

	res.json({
		email,
		subscription,
	});
};

const logout = async (req, res) => {
	const {_id} = req.user;
	await User.findByIdAndUpdate(_id, {token: ""});

	res.json({
		message: "Signout success",
	});
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: tempUpload, filename } = req.file;
	const resultUpload = path.join(avatarDir, filename);
    const avatarURL = path.join("avatars", filename);

    await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(Jimp.AUTO, avatarSize).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

	await fs.rename(tempUpload, resultUpload);
	
	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({ avatarURL });
};


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}