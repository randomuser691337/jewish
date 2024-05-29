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
                    button.addEventListener('contextmenu', function () {
                        cm(`<button class="b1 b2" onclick="delapp('${value.appn}');">Delete ${value.appn}</button><button class="b3">Close</button>`);
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
        const storeBox = document.getElementById('storebox');
        storeBox.innerHTML = "";

        if (jsonData) {
            const entries = Object.entries(jsonData);
            
            for (const [key, appData] of entries) {
                const { appn: appName, appc: appCode, appd: appDescription, apps: isSafe } = appData;
                const genId = gen(7);
                const safea = isSafe === "t" ? '<span class="safe">   Safe</span>' : '';

                const appDiv = document.createElement('div');
                appDiv.className = 'list';
                appDiv.id = genId;
                appDiv.innerHTML = `<p>${appDescription}</p>`;

                const toggleButton = document.createElement('button');
                toggleButton.className = 'b1 b2';
                toggleButton.innerHTML = appName + safea;
                toggleButton.addEventListener('click', () => toggle(genId));

                const installButton = document.createElement('button');
                installButton.className = 'b4';
                installButton.innerText = 'Install';
                installButton.addEventListener('click', () => addapp(appName, appCode));

                const deleteButton = document.createElement('button');
                deleteButton.className = 'b4';
                deleteButton.innerText = 'Delete if added';
                deleteButton.addEventListener('click', () => delapp(appName));

                appDiv.appendChild(deleteButton);
                appDiv.appendChild(installButton);

                storeBox.appendChild(toggleButton);
                storeBox.appendChild(appDiv);
            }
        } else {
            notif('The WebDesk Store cannot be accessed right now. Try again later.', 'WebDesk Services');
        }
    } catch (error) {
        console.error(`Error reading JSON file: ${error}`);
        notif(`The Store isn't working right now. Try again later.`, 'WebDesk Services');
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
