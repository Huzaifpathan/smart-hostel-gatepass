import { db } from "./firebase.js";
import { doc, getDoc, addDoc, collection, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ guard.js loaded");

const result = document.getElementById("scanResult");
const readerDiv = document.getElementById("reader");

if (!readerDiv) {
  console.error("❌ reader div not found");
}

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async (decodedText) => {
    console.log("📸 QR Scanned:", decodedText);

    try {
      const data = JSON.parse(decodedText);
      const passRef = doc(db, "gate_pass_requests", data.passId);
      const passSnap = await getDoc(passRef);

      if (!passSnap.exists()) {
        result.innerText = "❌ Invalid Pass";
        return;
      }

      const pass = passSnap.data();
      const now = new Date();

      // First scan → OUT
      if (pass.status === "approved") {
        await addDoc(collection(db, "entry_logs"), {
          studentId: pass.studentId,
          passId: data.passId,
          type: "OUT",
          timestamp: now
        });

        await updateDoc(passRef, { status: "out" });

        result.innerText = "✅ Exit Recorded";
        return;
      }

      // Second scan → IN
      if (pass.status === "out") {
        await addDoc(collection(db, "entry_logs"), {
          studentId: pass.studentId,
          passId: data.passId,
          type: "IN",
          timestamp: now
        });

        await updateDoc(passRef, { status: "completed" });

        result.innerText = "🏠 Return Recorded";
        return;
      }

      result.innerText = "🔒 Pass Already Completed";

    } catch (e) {
      console.error(e);
      result.innerText = "❌ Invalid QR Code";
    }
  },
  (errorMessage) => {
    // scanning failure (normal until QR is found)
    console.log("Scanning...");
  }
).catch(err => {
  console.error("Camera start error:", err);
  result.innerText = "❌ Camera access error";
});
