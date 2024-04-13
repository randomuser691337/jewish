let db;
let currentDir = '/';
const request = window.indexedDB.open('FileSystemDB', 1);

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

function cd(directory) {
  currentDir = directory;
}

function writef(name, value) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const path = currentDir + name;
  const file = { path, value };
  objectStore.put(file);
}

function readf(name) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const objectStore = transaction.objectStore('files');
    const path = currentDir + name;
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

function deleteFile(name) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const path = currentDir + name;
  objectStore.delete(path);
}

function renameFile(name, newName) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const oldPath = currentDir + name;
  const newPath = currentDir + newName;
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
