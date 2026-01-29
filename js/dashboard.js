import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const role = localStorage.getItem("role");

  if (role === "student") {
    document.getElementById("studentDashboard").classList.remove("hidden");
  } 
  else if (role === "warden") {
    document.getElementById("wardenDashboard").classList.remove("hidden");
  } 
  else if (role === "guard") {
    document.getElementById("guardDashboard").classList.remove("hidden");
  }
});

window.logout = function () {
  signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
};
