const ok = gen(6);
const senderPeer = new Peer(); 
let connect; 

function sendFile(filePath) {
    const receiverId = connect;

    readf(filePath)
        .then(fileData => {
            senderPeer.connect(receiverId, { reliable: true }); 

            senderPeer.on('connection', function (connection) {
                connection.send({ type: 'file', name: filePath.split('/').pop(), data: fileData }); 
            });
        })
        .catch(error => console.error("Error reading file:", error));
}


const receiverPeer = new Peer(ok);

receiverPeer.on('open', function (peerId) {
    console.log('Receiver peer ID:', peerId);
});

receiverPeer.on('connection', function (connection) {
    connection.on('data', function (data) {
        if (data.type === 'file') {
            console.log('File received!');
            const fileName = data.name;
            const fileData = data.data;
            saveFile(fileName, fileData);
        }
    });
});

function saveFile(fileName, fileData) {
    writef(fileName, fileData);
}
