$(document).ready(touch);

function touch() {
    $('.d').not('.dragged').on('mousedown touchstart', function (event) {
        var $window = $(this).closest('.window');
        if (!$window.hasClass('max')) {
            var offsetX, offsetY;
            var highestZIndex = Math.max.apply(null, $('.window').map(function () {
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

function wal(content, btn1, n) {
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
    touch(); opapp(windowId, 'Alert');
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
    if (div && !check) {
        centerel(id);
        showf(id);
        const btn = document.createElement('img');
        btn.className = "tbi";
        btn.id = "btn_" + id;
        if (img) {
            btn.src = img;
        } else {
            btn.src = "./assets/img/apps/notfound.svg";
        }
        btn.onclick = function () {
            maxi(id);
        };
        if (document.getElementById('taskbara')) {
            document.getElementById('taskbara').appendChild(btn);
        }
    } else {
        log('<!> Error making window.');
        log('   <i> Window: ' + div);
        log('   <i> Button: ' + check);
    }
}

function log(c) {
    console.log(c);
}

function clapp(id) {
    const div = document.getElementById(id);
    if (div) {
        hidef(id);
        const fuck = "btn_" + id;
        if (document.getElementById(fuck)) {
            dest(fuck);
        }
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
    $(dr1).fadeOut(140, function () { $(dr2).fadeIn(140); });
}

function hidef(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeOut(anim);
        } else {
            $(dr1).fadeOut(170);
        }
    }
}

function showf(d1, anim) {
    const dr1 = document.getElementById(d1);
    if (dr1) {
        if (anim) {
            $(dr1).fadeIn(anim);
        } else {
            $(dr1).fadeIn(170);
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

function masschange(classn, val) {
    const usernameElements = document.getElementsByClassName(classn);
    for (let i = 0; i < usernameElements.length; i++) {
        usernameElements[i].textContent = val;
    }
}

function guestmode() {
    dest('oobespace');
    mkw(`<p>You're in Guest Mode.</p><p>Data will be destroyed on next reload.</p>`, 'WebDesk Setup', undefined, undefined, undefined, true, undefined);
}

function reboot(delay) {
    if (delay) {
        setTimeout(function () { window.location.reload(); }, delay);
        showf('deathcurtain', 0, hidef('deathcurtain', delay));
    } else {
        window.location.reload();
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
        cv('lightdark3', '#ddd');
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

    fullBg.style.transition = `transform 0.5s ease`;
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