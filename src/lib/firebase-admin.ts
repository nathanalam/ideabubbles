import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (!getApps().length) {
  admin.initializeApp({
    // Since this will be running in a Google Cloud environment (App Hosting),
    // the SDK will automatically detect the project credentials.
  });
}

export const adminDb = admin.firestore();
