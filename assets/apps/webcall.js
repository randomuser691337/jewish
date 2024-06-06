let currentCall;
let localStream;
let audioElement;

async function calldesk(remotePeerId) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream = stream;
        const call = peer.call(remotePeerId, localStream);
        call.on('stream', (remoteStream) => {
            handleRemoteStream(remoteStream);
            fesw('caller1', 'caller2');
        });
        call.on('close', () => {
            console.log('Call ended.');
            removeAudioElement();
        });
        currentCall = call;
    } catch (err) {
        console.error('Failed to get local stream', err);
    }
}

function startcall(call) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localStream = stream;
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
            handleRemoteStream(remoteStream);
            fesw('caller1', 'caller2');
            opapp('caller');
        });
        call.on('close', () => {
            console.log('Call ended.');
            removeAudioElement();
        });
        currentCall = call;
    }).catch((err) => {
        console.log('<!> Failed to get local stream: ', err);
    });
}

function handleRemoteStream(stream) {
    createAudioElement();
    audioElement.srcObject = stream;
    audioElement.play();
}

function createAudioElement() {
    if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.id = 'remoteAudio';
        audioElement.autoplay = true;
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);
    }
}

function removeAudioElement() {
    if (audioElement) {
        audioElement.srcObject = null;
        audioElement.remove();
        audioElement = null;
    }
}

function endCall() {
    if (currentCall) {
        currentCall.close();
        fesw('caller2', 'caller1');
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    removeAudioElement();
}
