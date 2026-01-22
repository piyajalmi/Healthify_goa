import { auth } from "../firebase/firebase-config.js";
import { signInWithEmailAndPassword , signOut} from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (cred.user.email !== "piyajalmi4282@gmail.com") {
        alert("Not authorized");
        await signOut(auth);
        return;
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
});
