let db;
var pass = "def";
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

function encrypt(value) {
  const enc = readpb('enc');
  if (enc === "y") {
    if (pass === "def") {
      console.log(`<!> STOP: Password is unset. Attempted read: ${value}`);
      return;
    }
    return CryptoJS.AES.encrypt(value, pass).toString();
  } else {
    return value;
  }
}

function decrypt(value) {
  const enc = readpb('enc');
  if (enc === "y") {
    try {
      if (pass === "def") {
        console.log(`<!> STOP: Password is unset. Attempted read: ${value}`);
        return;
      }
      return CryptoJS.AES.decrypt(value, pass).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error.message);
      return null;
    }
  } else {
    return value;
  }
}

function writef(name, value) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  const enc = encrypt(value);
  const file = { path: name, value: enc };
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
        resolve(decrypt(file.value));
      } else {
        console.log(`<!> Couldn't find "${name}"`);
        resolve(undefined);
      }
    };
    request.onerror = function (event) {
      wal(`<p>A severe FS error has occured.</p><p>WebDesk might not be able to continue safely.</p>', 'send("${event}");wal("${target.event}");`, 'View & Report');
    };
  });
}

async function eraseall(reb = false) {
  const transaction = db.transaction(['files'], 'readwrite');
  const objectStore = transaction.objectStore('files');
  await erasepb();
  await objectStore.clear();
  if (reb) {
    reboot(400);
  }
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
