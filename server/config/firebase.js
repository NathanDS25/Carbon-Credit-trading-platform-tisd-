const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, 'firebase-key.txt');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

module.exports = admin;
