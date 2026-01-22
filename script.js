import { db } from "./firebase/firebase-config.js";
import { collection, onSnapshot } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* ===============================
   MENU REAL-TIME LISTENER
================================ */
function listenToMenuRealtime() {
  const menuContainer = document.getElementById("menuCards");

  onSnapshot(collection(db, "menu"), (snapshot) => {
    menuContainer.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (!data.available) return;

      const itemsHTML = (data.items || [])
        .map(item => `<li>${item}</li>`)
        .join("");

      const card = document.createElement("div");
      card.className = "menu-card";

      card.innerHTML = `
        <div class="menu-card-header">
          <h3>${data.name}</h3>
          <button class="toggle-btn">+</button>
        </div>

        <ul class="meal-details">
          ${itemsHTML}
        </ul>

        <p class="price">₹ ${data.price} / day</p>

        <a
          href="https://wa.me/918080995011?text=I%20want%20to%20order%20${encodeURIComponent(data.name)}"
          target="_blank"
          class="meal-whatsapp"
        >
          Order ${data.name} on WhatsApp
        </a>
      `;

      menuContainer.appendChild(card);
    });

    // toggle logic AFTER cards exist
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest(".menu-card");
        card.classList.toggle("active");
        btn.textContent = card.classList.contains("active") ? "−" : "+";
      };
    });
  });
}

/* ===============================
   MENU OPEN / CLOSE
================================ */
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const menuOverlay = document.getElementById("menuOverlay");

openMenu.addEventListener("click", (e) => {
  e.preventDefault();
  menuOverlay.style.display = "flex";
  document.body.classList.add("menu-open");
  listenToMenuRealtime();
});

closeMenu.addEventListener("click", () => {
  menuOverlay.style.display = "none";
  document.body.classList.remove("menu-open");
});
/* ===============================
   NAV ACTIVE LINK (SCROLL SPY)
================================ */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

function setActiveLink() {
  let current = "home"; // DEFAULT

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // navbar height buffer
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

/* RUN ON LOAD + SCROLL */
window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

/* ===============================
   AUTO OPEN MENU FROM OTHER PAGES
================================ */
const params = new URLSearchParams(window.location.search);

if (params.get("openMenu") === "true") {
  window.addEventListener("load", () => {
    menuOverlay.style.display = "flex";
    document.body.classList.add("menu-open");
    listenToMenuRealtime();
  });
}
if (params.get("openMenu") === "true") {
  window.addEventListener("load", () => {
    menuOverlay.style.display = "flex";
    document.body.classList.add("menu-open");
    listenToMenuRealtime();

    // clean URL
    window.history.replaceState({}, document.title, "index.html");
  });
}
