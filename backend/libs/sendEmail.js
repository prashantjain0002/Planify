import ejs from "ejs";
import axios from "axios";
import path from "path";

export const sendEmail = async (to, subject, templatePath, templateData) => {
  try {
    const emailHtml = await ejs.renderFile(
      path.resolve(templatePath),
      templateData
    );

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "prashantjain8120@gmail.com", name: "Planify" },
        to: [{ email: to }],
        subject,
        htmlContent: emailHtml,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Email sent to ${to}`);

    return { success: true };
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
};
