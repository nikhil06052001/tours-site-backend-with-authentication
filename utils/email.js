const nodemailer = require('nodemailer');


const sendEmail = async options=>{
    //1 create transpoter
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: // use your own
          pass: // use your own
        }
      });
        // activate in gamil 'less secure app 'option
    // define email option
    const mailOptions = {
        from:'NIKHIL TYAGI <nikTestgmail.com>',
        to: options.email,
        subject:options.subject,
        Text:options.message
    };
    await transport.sendMail(mailOptions)

    // actually send mail
};



module.exports = sendEmail;
