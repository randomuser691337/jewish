var exeboot;

function pw(set, func) {
    fesw('setup1', 'setupa');
    masschange('authcont', set);
    exeboot = func;
}

async function authg() {
    const i = document.getElementById('authp');
    pass = i.value;
    const ok = await readf('/system/check');
    if (ok === 'DontModifyOrYouWillBrickWebDesk') {
        dest('oobespace'); eval(exeboot);
    } else if (ok === undefined) {
        panic('6', '/system/check is corrupted.');
    } else {
        snack('Incorrect password.');
    }
}