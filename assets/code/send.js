var peer;

async function dserv(id) {
    peer = new Peer(id);

    peer.on('open', (peerId) => {
        masschange('mcode', peerId);
    });

    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            downloadFile(data.file, data.name);
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
