
import "dotenv/config";
import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);


const sendMail = async (data) => {
	const email = { ...data, from: "yasyasolnyshko@gmail.com" };
	await sgMail.send(email);
	return true;
};


export default sendMail;
