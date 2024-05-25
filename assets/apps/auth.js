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
    } else {
        snack('Wrong password!');
    }
}