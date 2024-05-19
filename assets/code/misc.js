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
}

function upload() {
    function handleFiles(files) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function (event) {
                writef(`/user/files/${file.name}`, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function openFilePicker() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        input.addEventListener('change', function (event) {
            handleFiles(event.target.files);
        });

        input.click();
    }

    openFilePicker();
}
