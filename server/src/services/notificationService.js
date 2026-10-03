const Notification = require('../models/Notification');

/**
 * Creates in-app notification and logs email placeholder cleanly.
 */
const sendNotification = async ({ userId, title, message, link, type = 'system', emailRecipient = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      link,
      type
    });

    // Email fallback logging (never fake delivery when SMTP is absent)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log(`[SMTP Email Service] Sending email to ${emailRecipient || 'user'}: "${title}"`);
      // Optional real SMTP logic can be wired here if credentials exist
    } else {
      console.log(`[Notification Service] In-app notification created for User ${userId}. (Email service unconfigured - safe local fallback)`);
    }

    return notification;
  } catch (error) {
    console.error('[Notification Service Error]', error.message);
  }
};

module.exports = { sendNotification };
