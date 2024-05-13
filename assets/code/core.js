$(document).ready(touch);
var highestZIndex;
function touch() {
    $('.d').not('.dragged').on('mousedown touchstart', function (event) {
        var $window = $(this).closest('.window');
        if (!$window.hasClass('max')) {
            var offsetX, offsetY;
            highestZIndex = Math.max.apply(null, $('.window').map(function () {
                return parseInt($(this).css('z-index')) || 1;
            }).get());

            $window.css('z-index', highestZIndex + 1);

            if (event.type === 'mousedown') {
                offsetX = event.clientX - $window.offset().left;
                offsetY = event.clientY - $window.offset().top;
            } else if (event.type === 'touchstart') {
                var touch = event.originalEvent.touches[0];
                offsetX = touch.clientX - $window.offset().left;
                offsetY = touch.clientY - $window.offset().top;
            }

            $(document).on('mousemove touchmove', function (event) {
                var newX, newY;
                if (event.type === 'mousemove') {
                    newX = event.clientX - offsetX;
                    newY = event.clientY - offsetY;
                    $window.addClass('dragging');
                } else if (event.type === 'touchmove') {
                    var touch = event.originalEvent.touches[0];
                    newX = touch.clientX - offsetX;
                    newY = touch.clientY - offsetY;
                    $window.addClass('dragging');
                }

                $window.offset({ top: newY, left: newX });
            });

            $(document).on('mouseup touchend', function () {
                $(document).off('mousemove touchmove');
                $window.removeClass('dragging');
            });

            document.body.addEventListener('touchmove', function (event) {
                event.preventDefault();
            }, { passive: false });

            $window.addClass('dragged');
        }
    });
}

function gen(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mkw(contents, titlebarText, width, height, c, m, a, icon) {
    var windowDiv = document.createElement('div');
    windowDiv.classList.add('window');
    windowDiv.id = gen(8);
    windowDiv.style.width = width;
    windowDiv.style.height = height;
    var titlebarDiv = document.createElement('div');
    titlebarDiv.classList.add('d');
    titlebarDiv.classList.add('tb');
    var navigationButtonsDiv = document.createElement('div');
    navigationButtonsDiv.classList.add('tnav');
    var closeButton = document.createElement('div');
    closeButton.classList.add('winb');
    if (c === undefined) {
        closeButton.classList.add('red');
        closeButton.addEventListener('mousedown', function () {
            clapp(windowDiv.id); dest(windowDiv.id, 100);
        });
    }

    var minimizeButton = document.createElement('div');
    minimizeButton.classList.add('winb');
    if (m === undefined) {
        minimizeButton.classList.add('yel');
        minimizeButton.addEventListener('mousedown', function () {
            mini(windowDiv.id);
        });
    }
    var maximizeButton = document.createElement('div');
    maximizeButton.classList.add('winb');
    if (a === undefined) {
        maximizeButton.classList.add('gre');
        maximizeButton.addEventListener('mousedown', function () {
            max(windowDiv.id);
        });
    }
    navigationButtonsDiv.appendChild(closeButton);
    navigationButtonsDiv.appendChild(minimizeButton);
    navigationButtonsDiv.appendChild(maximizeButton);
    titlebarDiv.appendChild(navigationButtonsDiv);
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titlebarText;
    titlebarDiv.appendChild(titleDiv);
    windowDiv.appendChild(titlebarDiv);
    var contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    windowDiv.appendChild(contentDiv);
    document.body.appendChild(windowDiv);
    contentDiv.innerHTML = contents;
    touch(); opapp(windowDiv.id, titlebarText, icon);
}

function wal(content, btn1, n, icon) {
    const windowId = gen(6);
    const windowContainer = document.createElement('div');
    windowContainer.className = 'window';
    windowContainer.id = windowId;
    windowContainer.style.display = "block";
    windowContainer.style.zIndex = 2;
    windowContainer.style.width = '300px';
    windowContainer.style.height = 'auto';
    const titleBar = document.createElement('div');
    titleBar.className = 'd';
    titleBar.style.border = "none";
    titleBar.style.borderRadius = "12px";
    titleBar.style.padding = "10px";
    if (!n) { n = "Okay" }
    titleBar.innerHTML = content + `<p style="display: flex; justify-content: space-between;"><button class="b1 wc" style="flex: 1;" onmousedown="clapp('${windowId}');dest('${windowId}');">Close</button><button class="b1 wc" style="flex: 1; ${btn1 ? '' : 'display: none;'}" onmousedown="clapp('${windowId}');dest('${windowId}');${btn1}">${n}</button></p>`;
    windowContainer.appendChild(titleBar);
    document.body.appendChild(windowContainer);
    touch();
    if (icon) {
        opapp(windowId, 'Alert', icon);
    } else {
        opapp(windowId, 'Alert');
    }
}

function centerel(el) {
    const element = document.getElementById(el);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const leftPosition = (screenWidth - elementWidth) / 2;
    const topPosition = (screenHeight - elementHeight) / 2;
    element.style.left = `${leftPosition}px`;
    element.style.top = `${topPosition}px`;
}

function opapp(id, name, img) {
    hidef('gomenu');
    const div = document.getElementById(id);
    const check = document.getElementById("btn_" + id);
    const switcher = document.getElementById('taskbara');
    if (div && !check) {
        centerel(id);
        showf(id);
        div.style.zIndex = highestZIndex + 1;
        const btn = document.createElement('img');
        btn.className = "tbi";
        btn.id = "btn_" + id;
        btn.addEventListener('mouseover', function () { showf('taskapp', 0); document.getElementById('taskapp').innerText = name; });
        switcher.addEventListener('mouseleave', function () { hidef('taskapp', 140); });
        if (img) {
            btn.src = img;
        } else {
            btn.src = "./assets/img/apps/notfound.svg";
        }
        btn.onclick = function () {
            maxi(id);
        };
        if (switcher) {
            document.getElementById('taskbara').appendChild(btn);
        }
    } else {
        log('<!> Error making window.');
        log('   <i> Window: ' + div);
        log('   <i> Button: ' + check);
    }
}

function play(filename) {
    const audio = new Audio(filename);
    audio.volume = nvol;
    audio.play();
}

function log(c) {
    console.log(c);
}

function notif(message, name, onclick) {
    const note = document.createElement('div');
    note.classList = "notif";
    note.innerHTML = `<p class="smt">${name}</p>${message}`;
    const id = gen(7);
    note.id = id;
    const note2 = document.createElement('div');
    note2.classList = "notif2";
    const id2 = gen(7);
    note2.id = id2;
    note2.innerHTML = `<p class="smt">${name}</p>${message}`;
    document.getElementById('notif').appendChild(note);
    document.getElementById('notifold').appendChild(note2);
    play('./assets/other/webdrop.ogg');
    note.addEventListener('click', function () { dest(id, '100'); });
    note2.addEventListener('click', function () { dest(id2, '100'); });
    setTimeout(function () { dest(id, '100'); }, 20000);
    dest('defnotif');
}

function clapp(id) {
    const div = document.getElementById(id);
    if (div) {
        hidef(id);
        const fuck = "btn_" + id;
        if (document.getElementById(fuck)) {
            dest(fuck);
        }
    } else {
        log('<!> Error closing window.');
        log('   <i> Window: ' + div);
        log('   <i> Button: ' + document.getElementById(fuck));
    }
}

function max(id) {
    const wid = document.getElementById(id);
    if (wid) {
        wid.classList.toggle('max');
        if (!wid.classList.contains('max')) {
            wid.classList.add('unmax');
            setTimeout(() => {
                wid.classList.remove('unmax');
            }, 301);
        }
    }
}

function mini(window) {
    hidef(window, 120);
}

function maxi(window) {
    showf(window, 0);
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

function guestmode() {
    dest('oobespace');
    mkw(`<p>You're in Guest Mode.</p><p>Data will be destroyed on next reload.</p>`, 'WebDesk Setup', undefined, undefined, undefined, true, undefined);
    showf('menubar'); showf('taskbar');
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

async function appear(m, no) {
    if (m === "l") {
        cv('lightdark', `rgb(255, 255, 255, 0.65)`);
        cv('lightdark2', '#fff');
        cv('lightdark3', '#ececec');
        cv('bordercolor', 'rgba(160, 160, 160, 0.2)');
        cv('bg', '#fff');
        cv('fontc', '#000');
        cv('fontc2', '#222');
        cv('inv', '0');
        cv('bgurl', 'url("./wall/light.png")');
        if (no === undefined) {
            await writef('/user/info/appear', 'light');
        }
    } else {
        cv('lightdark', `rgb(40, 40, 40, 0.65)`);
        cv('lightdark2', '#1a1a1a');
        cv('lightdark3', '#2a2a2a');
        cv('bordercolor', 'rgba(120, 120, 120, 0.2)');
        cv('bg', '#000');
        cv('fontc', '#fff');
        cv('fontc2', '#bbb');
        cv('inv', '1');
        cv('bgurl', 'url("./wall/dark.png")');
        if (no === undefined) {
            await writef('/user/info/appear', 'dark');
        }
    }
}

function togcls(id, className) {
    var element = document.getElementById(id);
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
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
            const fileData = event.target.result;
            callback(fileData);
            input.remove();
        };

        reader.readAsArrayBuffer(file);
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

function snack(cont, t) {
    if (!t) { t = 2500 }
    var snackElement = document.createElement("div");
    snackElement.className = "snack";
    const fuckyou = gen(7);
    snackElement.id = fuckyou;
    snackElement.innerHTML = cont;
    document.body.appendChild(snackElement);
    snackElement.onclick = function () {
        dest(fuckyou);
    }
    setTimeout(function () { dest(fuckyou); }, t);
}

function cm(cont, size) {
    const snackElement = document.createElement("div");
    snackElement.className = "cm";
    const fuckyou = gen(7);
    if (size) { snackElement.style.width = size; }
    snackElement.id = fuckyou;
    snackElement.innerHTML = cont;
    document.body.appendChild(snackElement);
    snackElement.onclick = function () {
        setTimeout(function () { dest(fuckyou); }, 100);
    }
}

function getdate() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    return (`${month} ${day}, ${year}`);
}

async function unlock(yeah) {
    const fullBg = document.getElementById(yeah);
    const windowHeight = window.innerHeight;
    const transitionEndPromise = new Promise(resolve => {
        fullBg.addEventListener('transitionend', function transitionEndHandler() {
            fullBg.removeEventListener('transitionend', transitionEndHandler);
            resolve();
        });
    });

    fullBg.style.transition = `transform 0.7s ease`;
    fullBg.style.transform = `translateY(-${windowHeight}px)`;
    await transitionEndPromise;
    fullBg.style.display = 'none';
    fullBg.style.transform = 'translateY(0)';
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

function eprompt() {
    wal(`<p><span class="med">Warning:</span> Erasing WebDesk will destroy all data inside of it.</p><p>After erase, you will be directed to Setup Assistant.</p>`, 'showf(`deathcurtain`, 400);eraseall(true);', 'Erase');
}

function framecon(cont) {
    const random = gen(8);
    const iframe = `<iframe class="embed" id="${random}" srcdoc="${cont}" height="500px"></iframe>`;
    mkw(iframe, 'Files - Website', '600px');
}

function doc(path, title, width, height) {
    fetch(path)
        .then(response => response.text())
        .then(data => {
            mkw(data, title, width, height);
        })
        .catch(error => {
            mkw(`<p>Couldn't load doc; check console.</p>`, 'Document Error', '270px');
        });
}

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

async function clboot() {
    const fuck = await readf('/system/apps.json');
    const fuck2 = await readf('/user/oldhosts.json');
    if (fuck === undefined) {
        console.log(`<!> /system/apps.json doesn't exist, creating...`);
        await writef('/system/apps.json', '');
    }
    if (fuck2 === undefined) {
        console.log(`<!> /system/oldhosts.json doesn't exist, creating...`);
        await writef('/user/oldhosts.json', '');
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
