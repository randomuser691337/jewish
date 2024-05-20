async function addapp(name, cont) {
    try {
        const existingData = await readf('/system/apps.json');
        const jsonData = existingData ? JSON.parse(existingData) : {};
        jsonData[name] = { appn: name, appc: cont };
        const json = JSON.stringify(jsonData);
        await writef('/system/apps.json', json);
        await readapps();
        snack(`Installed ${name} successfully`);
    } catch (error) {
        console.log(`Error writing JSON file: ${error}`);
    }
}

async function delapp(name) {
    try {
        const existingData = await readf('/system/apps.json');
        const jsonData = JSON.parse(existingData);
        if (jsonData.hasOwnProperty(name)) {
            delete jsonData[name];
            const json = JSON.stringify(jsonData);
            await writef('/system/apps.json', json);
            snack(`Uninstalled ${name} successfully.`);
            fucker2(name, 'yes');
        } else {
            snack('App not installed/already deleted.');
        }
    } catch (error) {
        console.log(`<!> Error deleting app ${name}: ${error}`);
    }
}

async function readapps() {
    try {
        const fileData = await readf('/system/apps.json');
        if (fileData) {
            const jsonData = JSON.parse(fileData);
            const entries = Object.entries(jsonData);
            for (const [key, value] of entries) {
                const buttonText = `${value.appn}`;
                if (!fucker2(buttonText)) {
                    const button = document.createElement('button');
                    button.classList = "b1";
                    button.addEventListener('click', function () {
                        idk(value.appc);
                    });
                    button.innerText = buttonText;
                    document.getElementById('applist').appendChild(button);
                }
            }
        } else {
            console.log(`<!> File not found or empty`);
        }
    } catch (error) {
        console.log(`Error reading JSON file: ${error}`);
        notif(`Couldn't get installed apps. Any apps you installed will not show up.`, 'WebDesk Services');
    }
}

async function listapps() {
    try {
        const jsonData = await json('./assets/apps/applist.json');
        document.getElementById('storebox').innerHTML = "";
        if (jsonData) {
            const entries = Object.entries(jsonData);
            for (const [key, value] of entries) {
                const buttonText = `${value.appn}`;
                const gen1 = gen(7);
                const button = document.createElement('button');
                button.classList = "b1 b2";
                button.addEventListener('click', function () {
                    toggle(gen1);
                });
                button.innerText = buttonText;
                const button2 = document.createElement('button');
                button2.classList = "b4";
                button2.addEventListener('click', function () {
                    addapp(value.appn, value.appc);
                });
                button2.innerText = "Install";
                const button3 = document.createElement('button');
                button3.classList = "b4";
                button3.addEventListener('click', function () {
                    delapp(value.appn);
                });
                button3.innerText = "Delete if added";
                const div = document.createElement('div');
                div.classList = "list";
                div.id = gen1;
                div.innerHTML = `<p>${value.appd}</p>`;
                document.getElementById('storebox').appendChild(button);
                div.appendChild(button3);
                div.appendChild(button2);
                document.getElementById('storebox').appendChild(div);
            }
        } else {
            console.log(`<!> File not found or empty`);
        }
    } catch (error) {
        console.log(`Error reading JSON file: ${error}`);
        notif(`The Store isn't working. Make sure WebDesk is being hosted by a webserver.`, 'WebDesk Services');
    }
}


function fucker2(text, byebye) {
    const buttons = document.querySelectorAll('#applist button');
    for (const button of buttons) {
        if (button.innerText === text) {
            if (byebye === "yes") {
                button.remove();
            } else {
                return true;
            }
        }
    }
    return false;
}
