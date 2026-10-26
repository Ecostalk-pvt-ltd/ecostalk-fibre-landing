/* ==========================================================================
   Ecostalk Fibre Pvt. Ltd. — EDITABLE SITE CONFIGURATION
   Update the values below; no other code changes are needed.
   Never put passwords, API keys or secrets in this file: it is public.
   ========================================================================== */
window.SITE_CONFIG = {
  companyName: "Ecostalk Fibre Pvt. Ltd.",

  // Set automatically by `node scripts/set-domain.mjs https://your-domain` for SEO files.
  // Kept here for reference only (leave as-is until the domain is registered).
  productionDomain: "",

  // BUSINESS EMAIL — supplied by the company. Enquiry buttons and the form open a mailto: draft to it.
  // If set to "", enquiry buttons send visitors to the Contact page and the form
  // offers "copy enquiry text" instead of opening an email app. Nothing is faked.
  businessEmail: "ecostalkfibre01@gmail.com",

  // ENQUIRY FORM DELIVERY — sends the Contact form to the business email through FormSubmit.co
  // (a free third-party form-to-email service; this site has no backend of its own).
  // FIRST USE: submit one test enquiry, then open the activation email FormSubmit sends to the
  // business inbox and click "Activate". Until then enquiries are not delivered.
  // Set to "" to go back to the mailto: draft method.
  formEndpoint: "https://formsubmit.co/ajax/ecostalkfibre01@gmail.com",

  // TELEPHONE — supplied by the company (also shown on the company signboard artwork).
  // Set to "" to hide it everywhere.
  businessTelephone: "+91 72648 34082",

  // Official address (as supplied).
  address: {
    line1: "Industrial Shed, Plot No. A-152",
    line2: "Shirpur Kanhala Shivar, Kinhi MIDC",
    line3: "Bhusawal, Jalgaon, Maharashtra – 425201, India",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" +
             encodeURIComponent("Ecostalk Fibre Pvt. Ltd., Industrial Shed Plot No A-152, Shirpur Kanhala Shivar, Kinhi MIDC, Bhusawal, Jalgaon, Maharashtra 425201, India")
  },

  // Social links — leave "" to hide a link.
  social: { linkedin: "", facebook: "", instagram: "", youtube: "" }
};
