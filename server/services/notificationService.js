const admin = require('../config/firebase');

const sendAdminNotification = async (title, body) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      topic: 'admin-alerts', // Admins will subscribe to this topic
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendAdminNotification };
