/* =========================================================
   GURU DOSAI RESTAURANT – script.js
   Shared by all pages. Plain JavaScript, no libraries.
   ========================================================= */

/* ---------------------------------------------------------
   SETTINGS – edit these to match the restaurant
   --------------------------------------------------------- */
const SETTINGS = {
  // Opening hours used for the "Open now / Closed" badge.
  // Keys: 0 = Sunday ... 6 = Saturday. Values: [open hour, close hour] in 24h time.
  // Use null for a closed day, and decimals for half hours (e.g. 10.5 = 10:30 AM).
  // ⚠️ If you change these, also update the visible hours in index.html, contact.html and the footers.
  hours: {
    0: [11, 22], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 22], 6: [11, 22],
  },
  timeZone: "Asia/Colombo", // Sri Lanka time

  // CONTACT FORM DESTINATION
  // Option A (recommended): paste a Formspree / Getform / Web3Forms URL here, e.g. "https://formspree.io/f/abcdwxyz"
  // Option B: leave empty "" and the form will open the visitor's email app instead (mailto).
  formEndpoint: "",
  contactEmail: "info@your-domain.com", // ← replace with the restaurant's real email address
};

/* ---------------------------------------------------------
   Mobile navigation (hamburger)
   --------------------------------------------------------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setOpen(false); toggle.focus(); } });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-inner")) setOpen(false);
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", () => setOpen(false));
})();

/* Header shadow once the page is scrolled */
(function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

/* Footer year */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------------------------------------------------------
   "Open now" badge + highlight today's row in the hours table
   --------------------------------------------------------- */
(function initOpenStatus() {
  const badges = document.querySelectorAll("[data-open-status]");
  const rows = document.querySelectorAll("tr[data-day]");
  if (!badges.length && !rows.length) return;

  const dayNames = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function nowInColombo() {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: SETTINGS.timeZone, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      return { day: dayNames[get("weekday")], time: (Number(get("hour")) % 24) + Number(get("minute")) / 60 };
    } catch (err) {
      const d = new Date();
      return { day: d.getDay(), time: d.getHours() + d.getMinutes() / 60 };
    }
  }

  const { day, time } = nowInColombo();
  rows.forEach((row) => row.classList.toggle("is-today", Number(row.dataset.day) === day));

  const today = SETTINGS.hours[day];
  const isOpen = Array.isArray(today) && time >= today[0] && time < today[1];
  badges.forEach((badge) => {
    badge.classList.remove("is-open", "is-closed");
    badge.classList.add(isOpen ? "is-open" : "is-closed");
    badge.textContent = isOpen ? "Open now" : "Closed right now";
  });
})();

/* ---------------------------------------------------------
   Menu page: highlight the category chip for the section in view
   --------------------------------------------------------- */
(function initMenuNav() {
  const links = document.querySelectorAll(".cat-nav a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map();
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) map.set(target, a);
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        const link = map.get(entry.target);
        link.classList.add("is-active");
        // keep the active chip visible in the horizontally scrolling bar (mobile)
        link.scrollIntoView({ block: "nearest", inline: "center" });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  map.forEach((_, section) => observer.observe(section));
})();

/* Print button on menu.html */
document.querySelectorAll("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));

/* ---------------------------------------------------------
   Contact form: validation + sending
   --------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."),
    // Phone is optional. If filled in it must have 7–15 digits (spaces, +, - and brackets allowed).
    phone: (v) => {
      if (!v.trim()) return "";
      const digits = v.replace(/\D/g, "");
      return /^[+\d\s\-()]+$/.test(v) && digits.length >= 7 && digits.length <= 15 ? "" : "Please enter a valid phone number, like 076 397 3883.";
    },
    message: (v) => (v.trim().length >= 10 ? "" : "Please write a message of at least 10 characters."),
  };

  function validateField(field) {
    const error = rules[field.name](field.value);
    const msg = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", error ? "true" : "false");
    if (msg) msg.textContent = error;
    return !error;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validateField(field); });
  });

  function showStatus(type, text) {
    status.className = "form-status is-" + type;
    status.textContent = text;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements["company"].value) return; // honeypot filled in → bot, ignore silently

    const fields = Object.keys(rules).map((n) => form.elements[n]);
    const results = fields.map(validateField);
    if (results.includes(false)) {
      showStatus("error", "Please fix the highlighted fields and try again.");
      fields[results.indexOf(false)].focus();
      return;
    }

    const data = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));

    if (SETTINGS.formEndpoint) {
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      try {
        const res = await fetch(SETTINGS.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        fields.forEach((f) => f.setAttribute("aria-invalid", "false"));
        showStatus("success", "Thank you! Your message was sent. We'll get back to you soon.");
      } catch (err) {
        showStatus("error", "Your message could not be sent. Please call us on 076 397 3883 instead.");
      } finally {
        button.disabled = false;
      }
    } else {
      // Fallback: open the visitor's email app with the message filled in
      const subject = encodeURIComponent("Website enquiry from " + data.name);
      const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "-"}\n\n${data.message}`);
      window.location.href = `mailto:${SETTINGS.contactEmail}?subject=${subject}&body=${body}`;
      showStatus("success", "Your email app should open with your message ready to send. If it doesn't, please call us on 076 397 3883.");
    }
  });
})();
