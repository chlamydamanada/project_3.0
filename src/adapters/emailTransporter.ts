import nodemailer from "nodemailer";

export const emailTransporter = async (email: string, message: string) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_EMAIL, //  email
            pass: process.env.PASS, //  password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Kek 👻" <codeSender>', // sender address
        to: email, // list of receivers
        subject: "Your code is here", // Subject line
        html: message, // html body
    });

    if (info) {
        return true;
    }
}