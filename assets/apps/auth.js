var exeboot;

function pw(set, func) {
    fesw('setup1', 'setupa');
    masschange('authcont', set);
    exeboot = func;
}

async function authg() {
    const i = document.getElementById('authp');
    const letmein = await ekey(i.value);
    if (letmein === true) {
        dest('oobespace'); eval(exeboot);
    } else if (letmein === "missing") {
        const f = document.getElementById('authp').value;
        pass = f;
        const fucker = await readf(`/system/check`);
        if (fucker === "DontModifyOrYouWillBrickWebDesk") {
            fesw('setupa', 'setupca');
        } else {
            snack('Wrong password!');
        }
     } else {
        snack('Wrong password!');
    }
}