var peer;
var recn;
var recb;
var deskid;
var webdrop = true;
var globcall;

async function dserv(id) {
    let retryc = 0;

    async function attemptConnection() {
        peer = new Peer(id);

        peer.on('open', (peerId) => {
            masschange('mcode', peerId);
            deskid = peerId;
            console.log('<i> DeskID is online. ID: ' + deskid);
        });

        peer.on('error', async (err) => {
            console.log(`<!> whoops: ${err}`);
            if (!deskid && retryc < 5) {
                console.log('<!> DeskID failed to register, trying again...');
                retryc++;
                setTimeout(attemptConnection, 10000);
            } else if (retryc >= 5) {
                console.log('<!> Maximum retry attempts reached. DeskID registration failed.');
                wal(`<p class="h3">WebDesk to WebDesk services are disabled</p><p>Your DeskID didn't register for some reason, therefore you can't use WebDrop, WebCall or Migration Assistant.</p><p>If you'd like, you can reboot to try again. Check your Internet too.</p>`, 'reboot()', 'Reboot');
            } else {
                snack('Failed to connect.');
            }
        });

        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                handleData(conn, data);
            });
        });

        peer.on('call', (call) => {
            globcall = call;
            opapp('calleri');
            play('./assets/other/webdrop.ogg');
        });
    }

    attemptConnection();
}

function handleData(conn, data) {
    if (webdrop === true) {
        if (data.name === "MigrationPackDeskFuck") {
            if (sdone === false) {
                fesw('setupqs', 'setuprs'); restorefs(data.file);
            } else {
                cm(`<p>A migration was attempted. Erase this WebDesk to migrate here.</p><p>If this wasn't you, you should <a onclick="idch();">change your ID.</a></p><button class="b1 b2">Close</button>`, '270px');
            }
        } else if (data.name === "YesImAlive-WebKey") {
            notif(`${data.uname} accepted your WebDrop.`, 'WebDesk Services');
        } else if (data.name === "DesktoDeskMsg-WebKey") {
            notif(data.file, 'WebDesk Services');
        } else if (data.name === "DeclineCall-WebKey") {
            fesw('caller3', 'caller1');
            snack('Your call was declined.');
        } else if (data.name === "WebCallName-WebKey") {
            masschange('callname', data.file);
            callid = data.id;
            addcall(data.file, callid);
            console.log('<i> bounced names');
            setInterval(function () {masschange('callname', data.file);}, 300);
        } else {
            recb = data.file;
            recn = data.name;
            play('./assets/other/webdrop.ogg');
            wal(`<p class="h3">WebDrop</p><p><span class="med dropn">what</span> would like to share <span class="med dropf">what</span></p>`, `acceptdrop();custf('${data.id}', 'YesImAlive-WebKey');`, 'Accept', './assets/img/apps/webdrop.svg');
            masschange('dropn', data.uname);
            masschange('dropf', data.name);
        }
    } else {
        custf(data.id, 'DesktoDeskMsg-WebKey', `${deskid} isn't accepting WebDrops right now.`);
    }
}

async function acceptdrop() {
    await downf(recb, recn); opapp('filem'); dfm('/user/files');
}

async function downf(data, name) {
    try {
        await writef(`/user/files/${name}`, data);
        snack(`WebDrop successful.`);
        play('./assets/other/complete.ogg');
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
    try {
        custf(id, fname, fblob);
        snack('File has been sent.', 2500);
        play('./assets/other/woosh.ogg');
    } catch (error) {
        console.log('<!> Error while sending file:', error);
        snack('An error occurred while sending your file.', 2500);
    }
}

function custf(id, fname2, fblob2) {
    const dataToSend = {
        name: fname2,
        file: fblob2,
        uname: user,
        id: deskid
    };

    try {
        const conn = peer.connect(id);

        conn.on('open', () => {
            conn.send(dataToSend);
            writejson(id);
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
    fblob = await compressfs();
    custf(id, "MigrationPackDeskFuck", fblob);
    masschange('moveprog', `Migration complete on this end! Check other WebDesk.`);
}

async function compressfs() {
    return new Promise(async (resolve, reject) => {
        try {
            const zip = new JSZip();
            const transaction = db.transaction(['files'], 'readonly');
            const objectStore = transaction.objectStore('files');
            const request = objectStore.getAll();
            let prog = 0;
            request.onsuccess = function (event) {
                const files = event.target.result;
                files.forEach(file => {
                    zip.file(file.path, decrypt(file.value));
                    masschange('moveprog', `Moving file ${prog}: ${file.path}`);
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
        fesw('setupqs', 'setuprs');
        const zip = await JSZip.loadAsync(zipBlob);
        const fileCount = Object.keys(zip.files).length;
        let filesDone = 0;
        console.log(`<i> Restore Stage 2: Open zip and extract ${fileCount} files to FS`);
        await Promise.all(Object.keys(zip.files).map(async filename => {
            console.log(`<i> Restoring file: ${filename}`);
            if (filename === "/system/enckey") {
                console.log(`<i> Skipped a file: ${filename}`);
                masschange('restpg', `Restoring ${filesDone}/${fileCount}: Skipped file: WebDesk specific`);
            } else {
                const file = zip.files[filename];
                const value = await file.async("string");
                writef(filename, value);
                filesDone++;
                masschange('restpg', `Restoring ${filesDone}/${fileCount}: ${filename}`);
            }
        }));
        fesw('setuprs', 'setupf');
        masschange('optnote', `Restore successful, delete any backups because they're unsafe.'`);
    } catch (error) {
        console.error('Error during restoration:', error);
    }
}

async function writejson(name) {
    try {
        const existingData = await readf('/user/oldhosts.json');
        const jsonData = existingData ? JSON.parse(existingData) : {};
        jsonData[name] = { id: name };
        const json = JSON.stringify(jsonData);
        await writef('/user/oldhosts.json', json);
        await readjson();
    } catch (error) {
        console.log(`Error writing JSON file: ${error}`);
    }
}

async function readjson() {
    try {
        document.getElementById('prevsend').innerHTML = ""
        const fileData = await readf('/user/oldhosts.json');
        if (fileData) {
            const jsonData = JSON.parse(fileData);
            const entries = Object.entries(jsonData);
            for (const [key, value] of entries) {
                const fucker = document.createElement('button');
                fucker.classList = "b4";
                fucker.addEventListener('click', function () {
                    sendf(value.id);
                }); fucker.innerText = `${value.id}`;
                document.getElementById('prevsend').appendChild(fucker);
            }
        } else {
            console.log(`<!> File not found or empty`);
        }
    } catch (error) {
        console.log(`Error reading JSON file: ${error}`);
        notif(`Couldn't get previous WebDrop recievers. Your WebDrop ID list will not appear.`, 'WebDesk Services');
    }
}