var peer;

async function dserv(id) {
    peer = new Peer(id);

    peer.on('open', (peerId) => {
        masschange('mcode', peerId);
    });

    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            if (data.name === "MigrationPackDeskFuck") {
                snack('Migrating...');
                restorefs(data.file);
            } else {
                downloadFile(data.file, data.name);
            }
        });
    });
}

async function downloadFile(data, name) {
    try {
        await writef(`/user/files/${name}`, data);
        cm(`<p>Received and wrote a file to /user/files/${name}. WebDesk may freeze for a second.</p><button class="b3">Dismiss</button>`);
    } catch (error) {
        console.error('<!> Error while writing file:', error);
        snack('An error occurred while writing the file.', 4000);
    }
}

function sends(name, file) {
    fname = name;
    fblob = file;
    opapp('sendf');
    masschange('fname', name);
}

function sendf(id) {
    const dataToSend = {
        name: fname,
        file: fblob
    };

    try {
        const conn = peer.connect(id);

        conn.on('open', () => {
            conn.send(dataToSend);
            snack('File has been sent.', 2500);
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
            snack('An error occurred while sending your file.', 2500);
        });
    } catch (error) {
        console.error('Error while sending file:', error);
        snack('An error occurred while sending your file.', 2500);
    }
}

async function compressfs() {
    const zip = new JSZip();
    await new Promise((resolve, reject) => {
        const transaction = db.transaction(['files'], 'readonly');
        const objectStore = transaction.objectStore('files');
        const request = objectStore.getAll();
        request.onsuccess = function (event) {
            const files = event.target.result;
            files.forEach(file => {
                zip.file(file.path, decrypt(file.value));
            });
            resolve();
        };
        request.onerror = function (event) {
            panic('5', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
    fname = "MigrationPackDeskFuck";
    fblob = zip.generateAsync({ type: "blob" });
}

async function restorefs(zipBlob) {
    console.log('<i> Restore Stage 1: Get zip and erase data');
    const zip = await JSZip.loadAsync(zipBlob);
    await eraseall();
    console.log('<i> Restore Stage 2: Open zip and extract to FS');
    await Promise.all(Object.keys(zip.files).map(async filename => {
      const file = zip.files[filename];
      const value = await file.async("string");
      writef(filename, value);
    }));
    
    console.log("<i> Filesystem restored successfully.");
  }
  