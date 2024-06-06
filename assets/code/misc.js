// Code that isn't needed for WebDesk to function
window.addEventListener('DOMContentLoaded', () => {
    const batteryImage = document.getElementById("bi");
    function updateBatteryStatus() {
        navigator.getBattery().then(battery => {
            showfi('bi', '100');
            const batteryLevel = battery.level * 100;
            const charging = battery.charging;
            document.getElementById('bi').onmouseenter = function () { document.getElementById('taskapp').innerText = `Battery is at ${batteryLevel}%`; showf('taskapp'); }
            document.getElementById('bi').onmouseleave = function () { hidef('taskapp'); }
            if (charging) {
                batteryImage.src = "./assets/img/batt/bc.svg";
            } else if (batteryLevel <= 12) {
                batteryImage.src = "./assets/img/batt/be.svg";
            } else if (batteryLevel <= 38) {
                batteryImage.src = "./assets/img/batt/bl.svg";
            } else if (batteryLevel >= 75) {
                batteryImage.src = "./assets/img/batt/bf.svg";
            } else {
                batteryImage.src = "./assets/img/batt/bm.svg";
            }
        });
    }

    updateBatteryStatus();
    navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
    });
});

function handlesilly(callback) {
    // thank you gpt
    function preventDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function highlightDropArea() {
        document.body.classList.add('drag-over');
    }

    function unhighlightDropArea() {
        document.body.classList.remove('drag-over');
    }

    function handleDrop(event) {
        preventDefaults(event);
        unhighlightDropArea();

        const files = event.dataTransfer.files;

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function (event) {
                callback(file.name, event.target.result, file);
            };
            reader.readAsDataURL(file);
        }
    }

    document.addEventListener('dragover', function (event) {
        preventDefaults(event);
        highlightDropArea();
    });

    document.addEventListener('dragleave', function (event) {
        preventDefaults(event);
        unhighlightDropArea();
    });

    document.addEventListener('drop', function (event) {
        preventDefaults(event);
        handleDrop(event);
    });

    document.querySelectorAll('.code').forEach(el => {
        el.onclick = async () => {
            try {
                await navigator.clipboard.writeText(el.innerText);
                document.getElementById('message').innerText = 'Copied: ' + el.innerText;
            } catch (err) {
                document.getElementById('message').innerText = 'Failed to copy';
                console.error('Failed to copy: ', err);
            }
        };
    });
}

function upload() {
    filepick('*', async function (file, name) {await writef(`/user/files/${name}`, file);console.log(`<i> Uploaded ${name}`);});
}

function getcl(imageSrc, callback) {
    var img = new Image();
    img.crossOrigin = "Anonymous"; // to avoid CORS issue
    img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var colorCount = {};
        var maxCount = 0;
        var mostUsedColor = [0, 0, 0]; // RGB values

        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var rgb = r + ',' + g + ',' + b;
            if (r > 50 && r < 200 && g > 50 && g < 200 && b > 50 && b < 200) {
                // Avoiding gray colors (too much white or black)
                if (!colorCount[rgb]) {
                    colorCount[rgb] = 0;
                }
                colorCount[rgb]++;
                if (colorCount[rgb] > maxCount) {
                    maxCount = colorCount[rgb];
                    mostUsedColor = [r, g, b];
                }
            }
        }

        callback(mostUsedColor);
    };

    img.src = imageSrc;
}

function bgim(wl) {
    document.body.style.backgroundImage = `url(${wl})`;
    getcl(wl, function (color) {
        cv('accent', color.join(', '));
    });
}

async function guestmode() {
    dest('oobespace');
    wal(`<p>You're in Guest Mode.</p><p>Data will be destroyed on next reload.</p>`, 'reboot(300)', 'Destroy Now');
    showf('menubar'); showf('taskbar');
    await clboot();
    await readjson();
    await readapps();
    await listapps();
}

function filepickl(acceptType, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptType;

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const fileData = event.target.result;
            callback(fileData);
            input.remove();
        };

        reader.readAsArrayBuffer(file);
    }

    input.addEventListener('change', handleFileSelect);
    input.click();
}

