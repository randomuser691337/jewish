function eprompt() {
    wal(`<p><span class="med">Warning:</span> Erasing WebDesk will destroy all data inside of it.</p><p>After erase, you will be directed to Setup Assistant.</p>`, 'showf(`deathcurtain`, 400);eraseall(true);', 'Erase');
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

async function appear(m, no) {
    if (m === "l") {
        cv('lightdark', `rgb(255, 255, 255, 0.55)`);
        cv('lightdark2', '#fff');
        cv('lightdark3', '#ececec');
        cv('bordercolor', 'rgba(200, 200, 200, 0.5)');
        cv('bg', '#fff');
        cv('fontc', '#000');
        cv('fontc2', '#222');
        cv('inv', '0');
        cv('bgurl', 'var(--lbgurl)');
        dark = false;
        offcls('darktog', 'controlba');
        if (no === undefined) {
            await writef('/user/info/appear', 'light');
        }
    } else {
        cv('lightdark', `rgb(40, 40, 40, 0.55)`);
        cv('lightdark2', '#1a1a1a');
        cv('lightdark3', '#2a2a2a');
        cv('bordercolor', 'rgba(80, 80, 80, 0.5)');
        cv('bg', '#000');
        cv('fontc', '#fff');
        cv('fontc2', '#bbb');
        cv('inv', '1');
        cv('bgurl', 'var(--dbgurl)');
        dark = true;
        oncls('darktog', 'controlba');
        if (no === undefined) {
            await writef('/user/info/appear', 'dark');
        }
    }
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

async function docksize(v) {
    const s = await readf('/user/info/dock');
    if (v) {
        await writef('/user/info/dock', v);
        cv('ds', v);
    } else {
        if (s) {
            cv('ds', s);
        } else {
            await writef('/user/info/dock', '44px');
            cv('ds', '44px');
        }
    }
}