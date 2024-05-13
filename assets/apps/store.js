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
                    button.classList = "b1 b2";
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
        panic('5', error.message);
    }
}

function fucker2(text) {
    const buttons = document.querySelectorAll('#applist button');
    for (const button of buttons) {
        if (button.innerText === text) {
            return true;
        }
    }
    return false;
}
