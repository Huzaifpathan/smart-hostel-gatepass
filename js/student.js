import { auth, db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ student.js loaded");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("❌ No user logged in");
    return;
  }

  console.log("🟢 Student UID:", user.uid);

  const qrDiv = document.getElementById("qrSection");
  if (!qrDiv) {
    console.error("❌ qrSection div not found in HTML");
    return;
  }

  const q = query(
    collection(db, "gate_pass_requests"),
    where("studentId", "==", user.uid),
    where("status", "==", "approved")
  );

  onSnapshot(q, (snapshot) => {
    console.log("📦 Snapshot size:", snapshot.size);

    qrDiv.innerHTML = "";

    if (snapshot.empty) {
      console.log("ℹ️ No approved gate pass found");
      return;
    }

    snapshot.forEach(docSnap => {
      const d = docSnap.data();

      const qrData = JSON.stringify({
        passId: docSnap.id,
        studentId: d.studentId,
        returnTime: d.returnTime
      });

      qrDiv.innerHTML = `
        <h3>🎟 Approved Gate Pass</h3>
        <div id="qrcode"></div>
      `;

      new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 180,
        height: 180
      });

      console.log("✅ QR Generated");
    });
  });
});
