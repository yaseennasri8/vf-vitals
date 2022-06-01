const nodemailer = require("nodemailer");

async function sendEmail(attachments: any[], email : string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "devcamper123@gmaIL.com",
      pass: "devcamper1234567",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "devcamper123@gmaIL.com", // sender address
    to: email, // list of receivers
    subject: "Report", // Subject line

    html: `<b>You can view daily report of your url in following attachment </b>`, // html body
    attachments: attachments,
  });
}

export default sendEmail;
