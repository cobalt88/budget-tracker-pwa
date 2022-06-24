let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('transactions', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    saveRecord();
  }
};

request.onerror = function(event) {
  console.log('Error opening database');
};

function saveRecord(record) {
  const transaction = db.transaction(['transactions'], 'readwrite');
  const store = transaction.objectStore('transactions');
  store.add(record);
};

function uploadRecords(){
  const transaction = db.transaction(['transactions'], 'readwrite');
  const store = transaction.objectStore('transactions');
  const getAll = store.getAll();

  getAll.onsuccess = function(event) {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result)
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.errors) {
          console.log('Error uploading data');
        }
        else {
          // clear db
          const transaction = db.transaction(['transactions'], 'readwrite');
          const store = transaction.objectStore('transactions');
          store.clear();
        }
      })
      .catch(err => {
        console.log('Error uploading data');
      }
      );
    }
  }
};

window.addEventListener('online', uploadRecords);
      