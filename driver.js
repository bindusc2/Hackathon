import { db } from './firebase.js';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const form = document.getElementById('ambulanceRequestForm');
const driverStatus = document.getElementById('driverStatus');

if (form && driverStatus) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const driverName = document.getElementById('driverName').value.trim();
    const ambulanceNo = document.getElementById('ambulanceNo').value.trim();
    const patientName = document.getElementById('patientName').value.trim();
    const source = document.getElementById('source').value.trim();
    const hospital = document.getElementById('hospital').value.trim();
    const emergency = document.getElementById('emergency').value.trim();

    if (!driverName || !ambulanceNo || !patientName || !source || !hospital || !emergency) {
      driverStatus.textContent = 'Please fill in all required fields before sending the emergency request.';
      driverStatus.classList.add('error');
      driverStatus.classList.remove('success');
      return;
    }

    try {
      await addDoc(collection(db, 'ambulanceRequests'), {
        driverName,
        ambulanceNo,
        patientName,
        source,
        hospital,
        emergency,
        status: 'Pending',
        timestamp: serverTimestamp(),
      });

      driverStatus.textContent = 'Emergency request sent successfully!';
      driverStatus.classList.remove('error');
      driverStatus.classList.add('success');
      form.reset();
    } catch (error) {
      driverStatus.textContent = 'Unable to send the emergency request. Please check your Firebase connection and try again.';
      driverStatus.classList.add('error');
      driverStatus.classList.remove('success');
      console.error('Firebase addDoc error:', error);
    }
  });
}
