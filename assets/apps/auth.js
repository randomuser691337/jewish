function pw(set, func) {
    fesw('setup1', 'setupa');
}

async function authg() {
    const i = document.getElementById('authp');
    pass = i.value;
    const ok = await readf('/system/check');
    if (ok === 'DontModifyOrYouWillBrickWebDesk') {
        dest('oobespace');
    } else {
        snack('Incorrect password.');
    }
}