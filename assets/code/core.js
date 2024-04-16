$(document).ready(touch);

function touch() {
    $('.titlebar').not('.dragged').on('mousedown touchstart', function (event) {
        var $window = $(this).closest('.window');
        var offsetX, offsetY;
        var resistance = 3;

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
            } else if (event.type === 'touchmove') {
                var touch = event.originalEvent.touches[0];
                newX = touch.clientX - offsetX;
                newY = touch.clientY - offsetY;
            }

            if (Math.abs(newX - $window.offset().left) > resistance ||
                Math.abs(newY - $window.offset().top) > resistance) {
                $window.offset({ top: newY, left: newX });
            }
        });

        $(document).on('mouseup touchend', function () {
            $(document).off('mousemove touchmove');
        });

        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, { passive: false });

        $window.addClass('dragged');
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

function mkw(contents, titlebar, width, height) {
    var windowDiv = document.createElement('div');
    windowDiv.classList.add('window');
    windowDiv.style.width = width;
    windowDiv.style.height = height;
    var titlebarDiv = document.createElement('div');
    titlebarDiv.classList.add('titlebar');
    titlebarDiv.textContent = titlebar;
    var contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    windowDiv.appendChild(titlebarDiv);
    windowDiv.appendChild(contentDiv);
    document.body.appendChild(windowDiv);
    contentDiv.innerHTML = contents;
    touch();
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

function guestmode() {
    dest('oobespace');
    mkw(`<p>You're in Guest Mode.</p><p>Data will be destroyed on next reload.</p>`, 'WebDesk Setup');
}