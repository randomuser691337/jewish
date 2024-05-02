var peer;

async function dserv(id) {
    peer = new Peer(id);

    peer.on('open', (peerId) => {
        masschange('mcode', peerId);
    });

    peer.on('connection', (conn) => {
        fesw('setupqs', 'setuprs');
        conn.on('data', (data) => {
            if (data.name === "MigrationPackDeskFuck") {
                if (sdone === false) {
                    fesw('setupqs', 'setuprs');
                    restorefs(data.file);
                } else {
                    cm(`<p>A migration was attempted. Erase this WebDesk to migrate here.</p><p>If this wasn't you, you should <a onclick="idch();">change your ID.</a></p><button class="b1 b2">Close</button>`, '270px');
                }
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

async function migaway(id) {
    snack('Preparing to migrate, this might take a bit...', '3000');
    fname = "MigrationPackDeskFuck";
    fblob = await compressfs();
    sendf(id);
}

async function compressfs() {
    return new Promise(async (resolve, reject) => {
        try {
            const zip = new JSZip();
            const transaction = db.transaction(['files'], 'readonly');
            const objectStore = transaction.objectStore('files');
            const request = objectStore.getAll();
            request.onsuccess = function (event) {
                const files = event.target.result;
                files.forEach(file => {
                    zip.file(file.path, decrypt(file.value));
                });
                resolve(zip.generateAsync({ type: "blob" }));
            };
            request.onerror = function (event) {
                panic('5', event.target.errorCode);
                reject(event.target.errorCode);
            };
        } catch (error) {
            reject(error);
        }
    });
}

async function restorefs(zipBlob) {
    console.log('<i> Restore Stage 1: Prepare zip');
    try {
        const zip = await JSZip.loadAsync(zipBlob);
        const fileCount = Object.keys(zip.files).length;
        let filesDone = 0;
        console.log(`<i> Restore Stage 2: Open zip and extract ${fileCount} files to FS`);
        await Promise.all(Object.keys(zip.files).map(async filename => {
            const file = zip.files[filename];
            const value = await file.async("string");
            writef(filename, value);
            filesDone++;
            masschange('restpg', `Restoring ${filesDone}/${fileCount}: ${filename}`);
        }));
        reboot(400);
    } catch (error) {
        panic
    }
}
