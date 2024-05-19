var canvas;
        
function stcam() {
    var video = document.querySelector("#videl");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (error) {
                alert(`Something went wrong. Make sure that you granted WebDesk camera permissions. Error: ${error}`);
            });
    }
}

function nocam() {
    try {
        var video = document.querySelector("#videl");
        var tracks = video.srcObject.getTracks();

        tracks.forEach(function (track) {
            track.stop();
        });

        video.srcObject = null;
    } catch (error) {
        console.log(`<!> Camera isn't started, or got nuked.`);
    }
}

function snap() {
    try {
        showf('flash', 1);
        hidef('flash', 700);
        var video = document.querySelector("#videl");
        canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        masschange('camtime', 'Camera');
        fesw('cameraitself', 'savewherecam');
    } catch (error) {
        console.log(`<!> ${error}`);
    }
}

function tsnap(time, s) {
    setTimeout(snap, time);
    fesw('snapper', 'cameraitself');
    masschange('camtime', `Snapping in ${s}s...`);
}

function savetodev() {
    try {
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const num = gen(7);
        link.download = `WebDesk Capture ${num}.png`;
        link.click();
    } catch (error) {
        console.error(`Error saving to device: ${error}`);
    }
}

var mainpartdone = false;

async function savetofiles() {
    try {
        const silly = canvas.toDataURL('image/png');
        const num = gen(7);
        const bruh = `Capture ${num}.png`;
        const wowzers = `/user/files/${bruh}`;
        await writef(wowzers, silly);
        snack('Saved picture to WebDesk', '3000');
        mainpartdone = true;
        const content = await readf(wowzers);
        viewmed(content, bruh, 'i');
        mainpartdone = false;
    } catch (error) {
        if (mainpartdone == false) {
            mkw(`<p>An error happened. Try saving to device.</p>`, 'Camera - Error');
        }
        console.log(`<!> ${error}`);
    }
}
