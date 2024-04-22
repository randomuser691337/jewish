const peer = new Peer(gen(4));
var fname;
var fblob;
peer.on('open', (id) => {
    masschange('mcode', id);
});

peer.on('connection', (conn) => {
    conn.on('data', (data) => {
        downloadFile(data.file, data.name);
    });
});

async function downloadFile(data, name) {
    await writevar(`/user/files/${name}`, data);
    snack(`Recieved and wrote a file to /user/files/${name}`, 4000);
}

function sendf(id) {
    const dataToSend = {
        name: fname,
        file: fblob
    };

    const conn = peer.connect(id); 

    conn.on('open', () => {
        conn.send(dataToSend); 
        snack('File has been sent.', '2500');
    });

    conn.on('error', (err) => {
        snack('An error occured while sending your file.', '2500');
    });
}