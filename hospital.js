import { db } from './firebase.js';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const tableBody = document.getElementById('requestTableBody');
const statusMessage = document.getElementById('hospitalStatus');

function formatDate(value) {
  if (!value) {
    return 'Just now';
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return new Date(value).toLocaleString();
}

function setStatusMessage(message, type = '') {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.className = 'status-message';

  if (type) {
    statusMessage.classList.add(type);
  }
}

if (tableBody) {
  const requestsRef = collection(db, 'ambulanceRequests');
  const requestsQuery = query(requestsRef, orderBy('timestamp', 'desc'));

  onSnapshot(
    requestsQuery,
    (snapshot) => {
      if (snapshot.empty) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" class="empty-state">No emergency requests available.</td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = '';

      snapshot.forEach((requestDoc) => {
        const request = requestDoc.data();
        const row = document.createElement('tr');
        const currentStatus = request.status || 'Pending';

        row.innerHTML = `
          <td>${request.driverName || 'N/A'}</td>
          <td>${request.ambulanceNo || 'N/A'}</td>
          <td>${request.patientName || 'N/A'}</td>
          <td>${request.source || 'N/A'}</td>
          <td>${request.hospital || 'N/A'}</td>
          <td>${request.emergency || 'N/A'}</td>
          <td>${formatDate(request.timestamp)}</td>
          <td>
            <div class="status-controls">
              <select class="status-select" data-doc-id="${requestDoc.id}" aria-label="Update request status">
                <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Accepted" ${currentStatus === 'Accepted' ? 'selected' : ''}>Accepted</option>
                <option value="Rejected" ${currentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
                <option value="Completed" ${currentStatus === 'Completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
          </td>
        `;

        tableBody.appendChild(row);
      });

      const statusSelects = document.querySelectorAll('.status-select');
      statusSelects.forEach((select) => {
        select.addEventListener('change', async (event) => {
          const selectedStatus = event.target.value;
          const docId = event.target.dataset.docId;

          if (!docId) {
            return;
          }

          try {
            await updateDoc(doc(db, 'ambulanceRequests', docId), {
              status: selectedStatus,
            });

            setStatusMessage(`Request status updated to ${selectedStatus}.`, 'success');
          } catch (error) {
            setStatusMessage('Failed to update request status. Please try again.', 'error');
            console.error('Firestore updateDoc error:', error);
          }
        });
      });
    },
    (error) => {
      setStatusMessage('Unable to load emergency requests from Firestore.', 'error');
      console.error('Firestore onSnapshot error:', error);
    }
  );
}
