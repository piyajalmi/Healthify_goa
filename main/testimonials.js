import { db } from "../firebase/firebase-config.js";

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* ===============================
   SAFE STAR RENDERING
================================ */
function renderStars(count = 0) {
  const rating = Math.max(0, Math.min(5, count)); // clamp 0–5
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

/* ===============================
   LOAD TESTIMONIALS (REALTIME)
================================ */
const container = document.getElementById("testimonialsContainer");

// 🚨 SAFETY CHECK
if (!container) {
  console.error("testimonialsContainer not found in HTML");
}

/* ✅ Query only approved testimonials, newest first */
const testimonialsQuery = query(
  collection(db, "testimonials"),
  where("approved", "==", true),
  orderBy("createdAt", "desc")
);

onSnapshot(testimonialsQuery, (snapshot) => {
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>No testimonials yet.</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "testimonial-card";

    card.innerHTML = `
      <p class="review">"${data.text || ""}"</p>

      <div class="stars">
        ${renderStars(data.rating)}
      </div>

      <h4 class="name">— ${data.name || "Anonymous"}</h4>

      ${data.location ? `<span class="location">${data.location}</span>` : ""}
    `;

    container.appendChild(card);
  });

  animateTestimonials();
});

/* ===============================
   FADE-IN ANIMATION
================================ */
function animateTestimonials() {
  const cards = document.querySelectorAll(".testimonial-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 120);
  });
}
