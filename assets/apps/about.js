function getstr() {
    const progressBarElements = document.querySelectorAll('.struse');
    const usageTextElements = document.querySelectorAll('.usage-text');
    try {
        navigator.storage.estimate().then(function (estimate) {
            const usedGB = (estimate.usage / (1024 * 1024 * 1024)).toFixed(2);
            const quotaGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);

            usageTextElements.forEach(function (usageText) {
                usageText.innerHTML = `Used <span class="med">${usedGB}</span> GB out of <span class="med">${quotaGB}</span> GB`;
            });

            progressBarElements.forEach(function (progressBar) {
                const usageInPercent = (estimate.usage / estimate.quota) * 100;
                progressBar.style.width = usageInPercent + '%';
            });
        });
    } catch (error) {
        usageText.innerHTML = `Error getting storage info. Try updating your browser.`;
        panic(`${error} - getstr`);
    }
}

setInterval(getstr, 3000);

function about(value) {
    const win = `<div class="container">
        <div class="logo">
            <img style="width: 100%; box-sizing: border-box; height: auto;" src="./assets/img/favicon.png">
            <p>Ver: <span class="ver med">one sec</span></p>
        </div>
        <div class="info">
            <p>Last edit: <span class="lastedit med">one sec</span></p>
            <p class="usage-text">One sec...</p>
            <div class="progress-bar">
                <div class="progress struse"></div>
            </div>
            <a class="fucku" onclick="aboutm();">Info</a>
            <a class="fucku" onclick="doc('./assets/other/credits.txt', 'WebDesk Credits', '420px', 'auto');">Creds</a>
            <a class="fucku" onclick="doc('./assets/other/changelog.txt', 'WebDesk Changelog', '420px', '340px');">Changes</a>
        </div>
    </div>`;
    if (value === undefined) {
        mkw(win, `About`, '300px', undefined, undefined, undefined, true, './assets/img/favicon.png');
    }

    masschange('ver', ver);
    masschange('lastedit', lastedit);
}
async function aboutm() {
    let so = await readf('/system/setupon');
    if (so === null || so === undefined) {
        so = "Unknown";
    }
    let ve = await readf('/system/ogver');
    if (ve === null || ve === undefined) {
        ve = "Unknown";
    }
    let en = readpb('enc');
    if (en === "y") {
        en = "yes";
    } else {
        en = "no";
    }
    let bl = readpb('bootload');
    if (bl === null || bl === undefined) {
        bl = "no";
    } else {
        bl = 'yes';
    }
    const win = `<p><span class="med">Set up on: </span>${so}</p>
    <p><span class="med">Original version: </span>${ve}</p>
    <p onclick="rmbl();" style="cursor: pointer;"><span class="med">Startup script: </span>${bl}</p>
    <p><span class="med">Encrypting: </span>${en}</p>`
    mkw(win, 'About', '300px', undefined, undefined, undefined, true, './assets/img/apps/info.svg');
}
function cm(cont) {
    const snackElement = document.createElement("div");
    snackElement.className = "cm";
    const fuckyou = gen(7);
    snackElement.id = fuckyou;
    snackElement.innerHTML = cont;
    document.body.appendChild(snackElement);
    snackElement.onclick = function () {
        setTimeout(function () { dest(fuckyou); }, 100);
    }
}