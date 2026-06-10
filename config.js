// Central Configuration for Anubhuti Healing Space
// Swapping in your actual credentials here will make the website fully functional!
const CONFIG = {
  // EmailJS Configuration
  // ---------------------
  // Service ID: Find in EmailJS Dashboard -> Email Services
  // Template ID: Find in EmailJS Dashboard -> Email Templates
  // Public Key: Find in EmailJS Dashboard -> Account -> API Keys
  emailjs: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
  },

  // Firebase Configuration
  // ----------------------
  // Find this in your Firebase Console -> Project Settings -> General -> Web Apps config object.
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },

  // Cloudinary Configuration
  // ------------------------
  // Cloud Name:     Cloudinary Dashboard top-left
  // Upload Preset:  Settings → Upload → Add Upload Preset (set to UNSIGNED)
  // These values are SAFE to be public — Cloudinary unsigned presets are designed for client-side use.
  cloudinary: {
    cloudName: "YOUR_CLOUD_NAME",      // ← replace with your Cloudinary cloud name
    uploadPreset: "YOUR_UPLOAD_PRESET"    // ← replace with your unsigned upload preset name
  }
};


// ── EMAILJS HELPER ──────────────────────────────────────────────────────────
// Submits template fields directly to EmailJS REST API.
// Works seamlessly on any page that includes config.js without adding other SDK scripts.
function sendEmailjsForm(templateParams) {
  if (!CONFIG.emailjs.publicKey || CONFIG.emailjs.publicKey.startsWith("YOUR_")) {
    console.warn("EmailJS is not configured in config.js. Form details logged below:");
    console.log(templateParams);
    // Return a resolved mock promise for testing when keys are unconfigured
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ mock: true });
      }, 1000);
    });
  }

  return fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: CONFIG.emailjs.serviceId,
      template_id: CONFIG.emailjs.templateId,
      user_id: CONFIG.emailjs.publicKey,
      template_params: templateParams
    })
  }).then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || "Failed to send email through EmailJS");
      });
    }
    return response;
  });
}

// ── FIREBASE INITIALIZATION ─────────────────────────────────────────────────
let db = null;
if (typeof firebase !== "undefined") {
  if (CONFIG.firebase.projectId && !CONFIG.firebase.projectId.startsWith("YOUR_")) {
    try {
      firebase.initializeApp(CONFIG.firebase);
      db = firebase.firestore();
      console.log("Firebase Firestore initialized successfully.");
    } catch (e) {
      console.error("Error initializing Firebase:", e);
    }
  } else {
    console.warn("Firebase is loaded but config is unconfigured in config.js. Storing or retrieving data will fall back to local mock data.");
  }
}
