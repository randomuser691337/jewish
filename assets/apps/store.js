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
            snack('App not installed.');
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
