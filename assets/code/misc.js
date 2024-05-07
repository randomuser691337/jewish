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