import { db } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onSnapshot(collection(db, "gate_pass_requests"), (snapshot) => {
  const div = document.getElementById("wardenRequests");
  if (!div) return;

  div.innerHTML = "";

  if (snapshot.empty) {
    div.innerHTML = "<p>No gate pass requests</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    if (d.status !== "pending") return;

    div.innerHTML += `
      <div class="request-card">
        <p><b>Reason:</b> ${d.reason}</p>
        <p><b>Out:</b> ${d.outTime}</p>
        <p><b>Return:</b> ${d.returnTime}</p>
        <button onclick="approve('${docSnap.id}')">Approve</button>
        <button onclick="reject('${docSnap.id}')">Reject</button>
      </div>
    `;
  });
});

window.approve = async function (id) {
  await updateDoc(doc(db, "gate_pass_requests", id), {
    status: "approved"
  });
};

window.reject = async function (id) {
  await updateDoc(doc(db, "gate_pass_requests", id), {
    status: "rejected"
  });
};
