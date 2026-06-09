// config.example.js — SAFE TO COMMIT. This is the template.
// ─────────────────────────────────────────────────────────────────────────────
// To run locally:
//   1. Copy this file and rename the copy to config.js
//   2. Replace the placeholder values below with your real credentials
//   3. config.js is in .gitignore so your keys will NEVER be committed
//
// For GitHub Pages deployment:
//   Store your real values as GitHub Repository Secrets and the
//   Actions workflow (.github/workflows/deploy.yml) will inject them
//   automatically at deploy time.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // EmailJS Configuration
  // Find these in https://www.emailjs.com/
  emailjs: {
    serviceId:  "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey:  "YOUR_EMAILJS_PUBLIC_KEY"
  },

  // Firebase Configuration (optional — for dynamic content)
  // Find in Firebase Console -> Project Settings -> Web App
  firebase: {
    apiKey:            "YOUR_FIREBASE_API_KEY",
    authDomain:        "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId:         "YOUR_FIREBASE_PROJECT_ID",
    storageBucket:     "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId:             "YOUR_FIREBASE_APP_ID"
  },

  // Cloudinary Configuration
  // Cloud Name: Cloudinary Dashboard top-left
  // Upload Preset: Settings -> Upload -> Add Upload Preset (UNSIGNED)
  // These are safe to be public — unsigned presets are designed for client-side use.
  cloudinary: {
    cloudName:    "YOUR_CLOUD_NAME",
    uploadPreset: "YOUR_UPLOAD_PRESET"
  }
};

// ── EMAILJS HELPER ──────────────────────────────────────────────────────────
function sendEmailjsForm(templateParams) {
  if (!CONFIG.emailjs.publicKey || CONFIG.emailjs.publicKey.startsWith("YOUR_")) {
    console.warn("EmailJS is not configured. Form details logged below:");
    console.log(templateParams);
    return new Promise((resolve) => setTimeout(() => resolve({ mock: true }), 1000));
  }

  return fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:      CONFIG.emailjs.serviceId,
      template_id:     CONFIG.emailjs.templateId,
      user_id:         CONFIG.emailjs.publicKey,
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
    console.warn("Firebase config not set. Dynamic features will use fallback data.");
  }
}
