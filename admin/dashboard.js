import { auth, db } from "../firebase/firebase-config.js";
import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { addDoc, serverTimestamp } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
  doc,
  setDoc,
  getDocs,
  collection
} from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  onSnapshot,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let editingTestimonialId = null;
const ADMIN_EMAILS = [
  "piyajalmi4282@gmail.com"
];

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

onAuthStateChanged(auth, (user) => {
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    window.location.href = "login.html";
  }
});


/* SAVE / UPDATE MEAL */
async function saveMeal() {
  const id = docId.value.trim();
  if (!id) return alert("Document ID required");

 await setDoc(
  doc(db, "menu", id),
  {
    price: Number(price.value),
    available: available.checked
  },
  { merge: true } // ⭐ CRITICAL
);


  showToast("Meal updated successfully");

  loadMenu();
}

/* LOAD MENU */
async function loadMenu() {
  const list = document.getElementById("menuList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "menu"));

  snapshot.forEach(d => {
    const m = d.data();

    list.innerHTML += `
      <div style="margin-bottom:10px">
        <strong>${m.name}</strong> — ₹${m.price}
        (${m.available ? "Available" : "Hidden"})
      </div>
    `;
  });
}

window.saveMeal = saveMeal;
loadMenu();

async function loadItems() {
  const category = document.getElementById("itemCategory").value;
  const ref = doc(db, "menu", category);
  const snap = await getDoc(ref);

  const list = document.getElementById("itemsList");
  list.innerHTML = "";

  if (!snap.exists()) return;

  const items = snap.data().items || [];

  items.forEach((item, index) => {
    list.innerHTML += `
      <li>
        ${item}
        <button onclick="removeItem(${index})">❌</button>
      </li>
    `;
  });
}

document.getElementById("itemCategory").addEventListener("change", loadItems);
async function addItem() {
  const category = document.getElementById("itemCategory").value;
  const item = document.getElementById("newItem").value.trim();
  if (!item) return;

  const ref = doc(db, "menu", category);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Meal document does not exist");
    return;
  }

  const items = snap.data().items || [];

  if (items.includes(item)) {
    alert("Item already exists");
    return;
  }

  items.push(item);

  await updateDoc(ref, { items });
  document.getElementById("newItem").value = "";
  loadItems();
}

async function removeItem(index) {
  const category = document.getElementById("itemCategory").value;
  const ref = doc(db, "menu", category);
  const snap = await getDoc(ref);

  const items = snap.data().items || [];
  items.splice(index, 1);

  await updateDoc(ref, { items });
  loadItems();
}
window.addItem = addItem;
window.removeItem = removeItem;
loadItems();



const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
async function addTestimonial() {
   const payload = {
    name: tName.value,
    location: tLocation.value,
    text: tText.value,
    mealType: tMeal.value,
    rating: Number(tRating.value),
    approved: true,
    createdAt: serverTimestamp()
  };

  if (editingTestimonialId) {
    await updateDoc(
      doc(db, "testimonials", editingTestimonialId),
      payload
    );
    editingTestimonialId = null;
    showToast("Testimonial updated");
  } else {
    await addDoc(collection(db, "testimonials"), payload);
    showToast("Testimonial added");
  }

  tName.value = "";
  tLocation.value = "";
  tText.value = "";
  editingTestimonialId = null;

  // 🔁 RESET BUTTON
  submitBtn.textContent = "Add Testimonial";
}
  
window.addTestimonial = addTestimonial;

const testimonialList = document.getElementById("testimonialList");
const submitBtn = document.querySelector(".admin-form.grid-3 button");


onSnapshot(collection(db, "testimonials"), (snapshot) => {
  testimonialList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "testimonial-admin";

    div.innerHTML = `
      <p><strong>${data.name}</strong> (${data.location})</p>
      <p>"${data.text}"</p>
      <p>⭐ ${data.rating} — ${data.mealType}</p>

      <div class="testimonial-actions">
        <button class="edit-btn" onclick="editTestimonial('${docSnap.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTestimonial('${docSnap.id}')">Delete</button>
      </div>
    `;

    testimonialList.appendChild(div);
  });
});
async function deleteTestimonial(id) {
  if (!confirm("Delete this testimonial?")) return;

  await deleteDoc(doc(db, "testimonials", id));
  showToast("Testimonial deleted");
}

window.deleteTestimonial = deleteTestimonial;


async function editTestimonial(id) {
  const ref = doc(db, "testimonials", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    showToast("Testimonial not found");
    return;
  }

  const data = snap.data();

  // Fill form
  tName.value = data.name || "";
  tLocation.value = data.location || "";
  tText.value = data.text || "";
  tMeal.value = data.mealType || "Veg Meal";
  tRating.value = data.rating || 5;

  editingTestimonialId = id;

 submitBtn.textContent = "Update Testimonial";

  showToast("Editing testimonial");
}
window.editTestimonial = editTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.addTestimonial = addTestimonial;


