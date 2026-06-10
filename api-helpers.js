// Central API and Service Helpers for Anubhuti Healing Space
// Placeholders are dynamically replaced at build time by GitHub Actions!
const CONFIG = {
  emailjs: {
    serviceId: "EMAILJS_SERVICE_ID_PLACEHOLDER",
    templateId: "EMAILJS_TEMPLATE_ID_PLACEHOLDER",
    publicKey: "EMAILJS_PUBLIC_KEY_PLACEHOLDER"
  },
  firebase: {
    apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
    authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
    projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
    storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
    messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
    appId: "FIREBASE_APP_ID_PLACEHOLDER"
  },
  cloudinary: {
    cloudName: "CLOUDINARY_CLOUD_NAME_PLACEHOLDER",
    uploadPreset: "CLOUDINARY_UPLOAD_PRESET_PLACEHOLDER"
  }
};

// ── EMAILJS HELPER ──────────────────────────────────────────────────────────
function sendEmailjsForm(templateParams) {
  if (!CONFIG.emailjs.publicKey || CONFIG.emailjs.publicKey.includes("_PLACEHOLDER")) {
    console.warn("EmailJS is not configured. Form details logged below:");
    console.log(templateParams);
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
  if (CONFIG.firebase.projectId && !CONFIG.firebase.projectId.includes("_PLACEHOLDER")) {
    try {
      firebase.initializeApp(CONFIG.firebase);
      db = firebase.firestore();
      console.log("Firebase Firestore initialized successfully.");
    } catch (e) {
      console.error("Error initializing Firebase:", e);
    }
  } else {
    console.warn("Firebase is loaded but config is unconfigured. Storing or retrieving data will fall back to local mock data.");
  }
}
