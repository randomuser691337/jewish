$(document).ready(touch);
var highestZIndex;
function touch() {
    $('.d').not('.dragged').on('mousedown touchstart', function (event) {
        var $window = $(this).closest('.window');
        if (!$window.hasClass('max')) {
            var offsetX, offsetY;
            var windows = $('.window');
            highestZIndex = Math.max.apply(null, windows.map(function () {
                var zIndex = parseInt($(this).css('z-index')) || 0;
                return zIndex;
            }).get());
            $window.css('z-index', highestZIndex + 1);
            $('.window').removeClass('winf');
            $window.addClass('winf');

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

        }
    });
}

function mkw(contents, titlebarText, width, height, c, m, a, icon, id) {
    var windowDiv = document.createElement('div');
    windowDiv.classList.add('window');
    if (id) {
        if (document.getElementById(id)) {
            console.log(`<!> Refusing to create ${id}, already exists`);
        } else {
            windowDiv.id = id;
        }
    } else {
        windowDiv.id = gen(8);
    }
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
    titleDiv.innerHTML = titlebarText;
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
        div.style.display = "block";
        centerel(id);
        div.style.zIndex = highestZIndex + 1;
        $('.window').removeClass('winf');
        div.classList.add('winf');
        const btn = document.createElement('img');
        btn.className = "tbi";
        btn.id = "btn_" + id;
        btn.addEventListener('mouseover', function () { showf('taskapp', 0); document.getElementById('taskapp').innerHTML = name; });
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

function notif(message, name, onclick) {
    const note = document.createElement('div');
    note.classList = "notif";
    note.innerHTML = `${name} - ${message}`;
    const id = gen(7);
    note.id = id;
    const note2 = document.createElement('div');
    note2.classList = "notif2";
    const id2 = gen(7);
    note2.id = id2;
    note2.innerText = `${name} - ${message}`;
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
        log(`<!> Error closing window. Window: ${div} - Button: ${document.getElementById(fuck)}`);
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
