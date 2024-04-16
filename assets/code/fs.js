let db;
const request = window.indexedDB.open('WebDeskDB', 1);
function initializeDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
    } else {
      const request = window.indexedDB.open('WebDeskDB', 1);
      request.onerror = function (event) {
        reject("<!> shit:" + event.target.errorCode);
      };
      request.onsuccess = function (event) {
        db = event.target.result;
        resolve();
      };
      request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'path' });
        }
      };
    }
  });
}

request.onerror = function (event) {
  console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
  db = event.target.result;
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const objectStore = db.createObjectStore('files', { keyPath: 'path' });
};

function writepb(key, value) {
  localStorage.setItem(key, value);
}

function readpb(key) {
  return localStorage.getItem(key);
}

function delpb(key) {
  localStorage.removeItem(key);
}

function erasepb() {
  localStorage.clear();
}

function writef(name, value) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const path = name;
  const file = { path, value };
  objectStore.put(file);
}

function readf(name) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const objectStore = transaction.objectStore('files');
    const path = name;
    const request = objectStore.get(path);
    request.onsuccess = function (event) {
      const file = event.target.result;
      if (file) {
        resolve(file.value);
      } else {
        reject("File not found");
      }
    };
    request.onerror = function (event) {
      reject("Error reading file");
    };
  });
}

function eraseall() {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  objectStore.clear();
}

function delf(name) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const path = name;
  objectStore.delete(path);
}

function renf(name, newName) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const oldPath = name;
  const newPath = newName;
  const request = objectStore.get(oldPath);
  request.onsuccess = function (event) {
    const file = event.target.result;
    if (file) {
      file.path = newPath;
      objectStore.put(file);
    } else {
      console.log("File not found");
    }
  };
}
