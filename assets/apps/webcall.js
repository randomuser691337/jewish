let currentCalls = [];
let localStream;
let audioElements = {};
let isMuted = false;
let callid;

async function calldesk(omfg) {
    try {
        let remotePeerIds = omfg.split(',').map(id => id.trim());
        console.log('<i> Calling the following peer IDs:', remotePeerIds); 
        fesw('caller1', 'caller3');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream = stream;
        remotePeerIds.forEach(remotePeerId => {
            const call = peer.call(remotePeerId, localStream);
            call.on('stream', (remoteStream) => {
                hrs(remoteStream, remotePeerId);
                fesw('caller3', 'caller2');
                play('./assets/apps/webcall/pickup.ogg');
            });

            call.on('close', () => {
                removeAudioElement(remotePeerId);
                endcall();
            });

            call.on('error', (err) => {
                console.error(`<!> Failed to call peer ${remotePeerId}:`, err);
                snack(`Couldn't call peer ${remotePeerId}. Try reloading both WebDesks.`);
            });

            currentCalls.push(call);
            custf(remotePeerId, 'WebCallName-WebKey', user);
        });

    } catch (err) {
        console.error('<!> Failed to get local stream', err);
        fesw('caller3', 'caller1');
        endcall();
        snack(`Couldn't call. Try reloading both WebDesks.`);
    }
}

function startcall(call) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localStream = stream;
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
            hrs(remoteStream, call.peer);
            fesw('caller1', 'caller2');
            opapp('caller');
            play('./assets/apps/webcall/pickup.ogg');
        });
        call.on('close', () => {
            endcall();
            removeAudioElement(call.peer);
        });
        call.on('error', (err) => {
            console.error(`Failed to start call with peer ${call.peer}:`, err);
            snack(`Couldn't connect with peer ${call.peer}. Try reloading both WebDesks.`);
        });
        currentCalls.push(call);
        custf(callid, 'WebCallName-WebKey', user);
    }).catch((err) => {
        console.error('<!> Failed to get local stream: ', err);
    });
}

function hrs(stream, id) {
    createAudioElement(id);
    audioElements[id].srcObject = stream;
    audioElements[id].play();
}

function createAudioElement(id) {
    if (!audioElements[id]) {
        const audioElement = document.createElement('audio');
        audioElement.id = `remoteAudio-${id}`;
        audioElement.autoplay = true;
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);
        audioElements[id] = audioElement;
    }
}

function removeAudioElement(id) {
    if (audioElements[id]) {
        audioElements[id].srcObject = null;
        audioElements[id].remove();
        delete audioElements[id];
    }
}

function endcall(lol) {
    currentCalls.forEach(call => {
        call.close();
        removeAudioElement(call.peer);
    });
    currentCalls = [];
    fesw('caller2', 'caller1');
    if (lol !== "no") {
        play('./assets/apps/webcall/hangup.ogg');
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    audioElements = {};
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