// Code that isn't needed for WebDesk to function
window.addEventListener('DOMContentLoaded', () => {
    const batteryImage = document.getElementById("bi");
    function updateBatteryStatus() {
        navigator.getBattery().then(battery => {
            const batteryLevel = battery.level * 100;
            const charging = battery.charging;

            if (charging) {
                batteryImage.src = "./assets/img/batt/bc.svg";
            } else if (batteryLevel <= 33) {
                batteryImage.src = "./assets/img/batt/bl.svg";
            } else if (batteryLevel >= 70) {
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
