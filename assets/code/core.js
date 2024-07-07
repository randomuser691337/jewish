function gen(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function gens(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const array = new Uint32Array(Math.ceil(length / 4));
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i].toString(16).padStart(8, '0');
    }

    return result.slice(0, length);
}

function play(filename) {
    const audio = new Audio(filename);
    audio.volume = nvol;
    audio.play();
}

function log(c) {
    console.log(c);
}

function cv(varName, varValue) {
    const root = document.documentElement;
    root.style.setProperty(`--${varName}`, `${varValue}`);
}

async function chacc(rgb) {
    cv('accent', rgb);
    await writef('/user/info/accent', rgb);
}

function fesw(d1, d2) {
    const dr1 = document.getElementById(d1);
    const dr2 = document.getElementById(d2);
    $(dr1).fadeOut(160, function () { $(dr2).fadeIn(160); });
}

function hidef(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeOut(anim);
        } else {
            $(dr1).fadeOut(210);
        }
    }
}

function showf(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeIn(anim);
        } else {
            $(dr1).fadeIn(210);
        }
    }
}

function showfi(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeIn(anim).css("display", "inline-block");
        } else {
            $(dr1).fadeIn(170).css("display", "inline-block");
        }
    }
}

function dest(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeOut(anim, function () { dr1.remove(); });
        } else {
            $(dr1).fadeOut(170, function () { dr1.remove(); });
        }
    }
}

function toggle(elementId, time3) {
    var element = document.getElementById(elementId);
    if (element) {
        if (element.style.display === '' || element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            hidef(elementId, time3);
        }
    }
}

function hidecls(className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}
function showcls(className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'inline';
    }
}

function masschange(classn, val) {
    const usernameElements = document.getElementsByClassName(classn);
    for (let i = 0; i < usernameElements.length; i++) {
        usernameElements[i].textContent = val;
    }
}

function reboot(delay) {
    if (delay) {
        setTimeout(function () { window.location.href = './index.html'; }, delay);
        showf('deathcurtain', 0, hidef('deathcurtain', delay));
    } else {
        window.location.href = './index.html';
    }
}

function short(inputString, size) {
    if (inputString.length <= size) {
        return inputString;
    } else {
        return inputString.slice(0, size - 3) + '...';
    }
}

async function setupd() {
    await writef('/system/ogver', ver);
    await writef('/system/check', 'DontModifyOrYouWillBrickWebDesk');
    await writef('/system/setupon', getdate());
}

function togcls(id, className) {
    var element = document.getElementById(id);
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}
function offcls(id, className) {
    var element = document.getElementById(id);
    element.classList.remove(className);
}
function oncls(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function filepick(acceptType, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptType;

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            callback(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }

    input.addEventListener('change', handleFileSelect);
    input.click();
}

function down(filename, filedata) {
    const blob = new Blob([filedata], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

async function lback() {
    try {
        const desk = await compressfs();
        const filename = `webdesk-backup.zip`;
        down(filename, desk);
        snack('Successfully backed up to your device.', '4000');
    } catch (error) {
        notif('An error occured while backing up. Reboot and try again.', 'WebDesk System');
    }
}


async function id() {
    return readpb('deskid');
}

function chid() {
    writepb('deskid', gen(4));
    reboot(300);
}

function idch() {
    wal(`<p>Are you sure you want to change your DeskID?</p><p>Anyone with your ID will need the new one to send files.</p>`, 'chid()', 'Change ID');
}

function getdate() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    return (`${month} ${day}, ${year}`);
}

function updateClock() {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    const elements = document.getElementsByClassName("time");
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerText = formattedTime;
    }
}
setInterval(updateClock, 1000);

function rmbl() {
    wal(`<p>Are you sure you want to delete your startup code?</p><p>Depending on your changes, WebDesk may stop working correctly.</p>`, 'delpb(`bootload`);reboot(400);', 'Delete & Reboot');
}

function panic(detail, msg) {
    if (document.getElementById('prohibit')) {
        showf('prohibit');
    } else {
        wal(`<p>WebDesk tried to crash, but is in recovery or in a special mode.<p><p>Message: <span class="med">${msg}</span></p><p>Error code: <span class="med">${detail}</span>`)
    }
    document.getElementById('perr').href = `https://errdesk.vercel.app/?e=${detail}&d=${msg}`;
    setTimeout(function () {
        Object.keys(window).forEach(key => {
            delete window[key];
        });
    }, 300);
}

function idk(path) {
    const script = document.createElement('script');
    script.src = path;
    document.head.appendChild(script);
}

async function json(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Failed to fetch JSON');
        }
        return await response.json();
    } catch (error) {
        console.error('Error reading JSON:', error);
        return null;
    }
}

async function clboot() {
    const fuck = await readf('/system/apps.json');
    const fuck2 = await readf('/user/oldhosts.json');
    const fuck3 = await readf('/user/info/prevcall.json');
    if (fuck === undefined) {
        console.log(`<!> /system/apps.json doesn't exist, creating...`);
        await writef('/system/apps.json', '');
    }
    if (fuck2 === undefined) {
        console.log(`<!> /system/oldhosts.json doesn't exist, creating...`);
        await writef('/user/oldhosts.json', '');
    }
    if (fuck3 === undefined) {
        console.log(`<!> /user/info/prevcall.json doesn't exist, creating...`);
        await writef('/user/info/prevcall.json', '');
    }
}

function urlv(varname) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) === varname) {
            return decodeURIComponent(pair[1]);
        }
    }

    return undefined;
}

async function unencrypt() {
    showf('oobespace');
    wal('<p>Decrypting. Leaving, reloading or stopping WebDesk will result in you losing data.</p>');
    await setTimeout(async function () {
        const backup = await compressfs();
        eraseall();
        enc = "n";
        await restorefs(backup);
        wal('<p>Completed decryption. Please restart.</p>', 'reboot(300)', 'Restart', './assets/img/setup/enc.svg');
    }, 500);
}

async function decryw() {
    wal('<p>Are you sure you wish to unencrypt?</p><p>WebDesk will no longer be password protected, but reading/writing files will be much faster.</p>', 'unencrypt();', 'Yes');
}

async function encdesk() {
    mkw('<p>Enter a password to encrypt WebDesk with.</p><p>Note: Reading/writing files will become much slower after encrypting.</p><input class="i1" id="encdesk" placeholder="Password here"></input><button class="b1" onclick="encryptn(document.getElementById(`encdesk`).value);">To encryption and beyond!</button>', 'Encryption Assistant', '340px', 'auto', undefined, true, true, './assets/img/setup/enc.svg', 'encwizard');
}

async function encryptn(pass2) {
    showf('oobespace');
    const backup = await compressfs();
    eraseall();
    enc = "y";
    writepb('enc', 'y');
    await setupde(pass2);
    await restorefs(backup);
    wal('<p>Completed encryption. Please restart.</p>', 'reboot(300)', 'Restart');
}

async function changepass2() {
    mkw('<p>Enter new password. The longer, the better!</p><input class="i1" id="passch" placeholder="Password here"></input><button class="b1" onclick="changepass(document.getElementById(`passch`).value);">Change password</button>', 'Encryption Assistant', '340px', 'auto', undefined, true, true, './assets/img/setup/enc.svg', 'passwiz');
}

async function updateck() {
    const m = await readf('/system/ver');
    if (m) {
        if (m !== ver) {
            notif(`WebDesk was updated to ${ver}. Have fun!`, 'WebDesk Updater');
            await writef('/system/ver', ver);
        } else {
            console.log('<i> On latest version.');
        }
    } else {
        await writef('/system/ver', ver);
    }
}