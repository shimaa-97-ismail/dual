import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config(); 

export const sendEmail = async (to, subject, text) => {
  // إنشاء transporter في كل مرة لضمان وجود القيم
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "✅ موجودة" : "❌ غير موجودة"
  );
  await transporter.sendMail(mailOptions);
};
// // تهيئة ناقل البريد الإلكتروني (استخدم متغيرات البيئة)
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//    host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /**
//  * إرسال بريد إلكتروني
//  * @param {string} to - البريد الإلكتروني للمستقبل
//  * @param {string} subject - موضوع الرسالة
//  * @param {string} text - محتوى الرسالة النصي
//  */
// export const sendEmail = async (to, subject, text) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };
//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log(
//     "EMAIL_PASS:",
//     process.env.EMAIL_PASS ? "✅ موجودة" : "❌ غير موجودة",
//   );
//   await transporter.sendMail(mailOptions);
// };
