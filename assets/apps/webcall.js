let currentCall;
let localStream;
let audioElement;
let isMuted = false;
let callid;

async function calldesk(remotePeerId) {
    try {
        fesw('caller1', 'caller3');
        custf(remotePeerId, 'WebCallName-WebKey', user);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream = stream;
        const call = peer.call(remotePeerId, localStream);
        call.on('stream', (remoteStream) => {
            hrs(remoteStream);
            fesw('caller3', 'caller2');
            play('./assets/apps/webcall/pickup.ogg');
        });
        call.on('close', () => {
            removeAudioElement();
            endcall();
        });
        currentCall = call;
    } catch (err) {
        fesw('caller3', 'caller1');
        endcall();
        console.log('<!> Failed to get local stream', err);
        snack(`Couldn't call. Try reloading both WebDesks.`);
    }
}

function startcall(call) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localStream = stream;
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
            hrs(remoteStream);
            fesw('caller1', 'caller2');
            opapp('caller');
            play('./assets/apps/webcall/pickup.ogg');
        });
        call.on('close', () => {
            endcall(); removeAudioElement();
        });
        currentCall = call;
        custf(callid, 'WebCallName-WebKey', user);
    }).catch((err) => {
        console.log('<!> Failed to get local stream: ', err);
    });
}

function hrs(stream) {
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

function endcall(lol) {
    if (currentCall) {
        currentCall.close();
        fesw('caller2', 'caller1');
        if (lol !== "no") {
            play('./assets/apps/webcall/hangup.ogg');
        }
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    removeAudioElement();
}

function togglemute() {
    if (localStream) {
        isMuted = !isMuted;
        localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
        masschange('mutestat', `${isMuted ? 'Muted' : 'Unmuted'}`);
    }
}

async function readcall() {
    try {
        document.getElementById('prevcall').innerHTML = "";
        const fileData = await readf('/user/info/prevcall.json');
        if (fileData) {
            const jsonData = JSON.parse(fileData);
            const entries = Object.entries(jsonData);
            for (const [key, value] of entries) {
                const buttonText = `${value.appn}`;
                if (!fucker2(buttonText)) {
                    const button = document.createElement('button');
                    button.classList = "b4";
                    button.addEventListener('click', function () {
                        calldesk(value.appc);
                    });
                    button.addEventListener('contextmenu', function () {
                        cm(`<button class="b1 b2" onclick="delcall('${value.appn}');">Delete ${value.appn}</button><button class="b3">Close</button>`);
                    });
                    button.innerText = buttonText;
                    document.getElementById('prevcall').appendChild(button);
                }
            }
        } else {
            console.log(`<!> File not found or empty`);
        }
    } catch (error) {
        console.log(`<!> Error reading JSON file: ${error}`);
    }
}

async function addcall(name, cont) {
    try {
        const existingData = await readf('/user/info/prevcall.json');
        const jsonData = existingData ? JSON.parse(existingData) : {};
        jsonData[name] = { appn: name, appc: cont };
        const json = JSON.stringify(jsonData);
        await writef('/user/info/prevcall.json', json);
        await readcall();
    } catch (error) {
        console.log(`<!> Error writing JSON file: ${error}`);
    }
}

async function delcall(name) {
    try {
        const existingData = await readf('/user/info/prevcall.json');
        const jsonData = JSON.parse(existingData);
        if (jsonData.hasOwnProperty(name)) {
            delete jsonData[name];
            const json = JSON.stringify(jsonData);
            await writef('/user/info/prevcall.json', json);
            await readcall();
        }
    } catch (error) {
        console.log(`<!> Error deleting caller ${name}: ${error}`);
    }
}