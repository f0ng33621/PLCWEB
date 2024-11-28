const loadData = (selector, element) => {
    setInterval(() => {
        $(selector).load("Data/dataG1.html " + element);}, 1000); // โหลดข้อมูลทุกๆ 1 วินาที
};
loadData('.PV', '.PV1');
loadData('.CO', '.CO1');
loadData('.Setpoint', '.SP1');
loadData('.Kp', '.KP1');
loadData('.Tiii', '.TI1');
loadData('.Tddd', '.TD1');
loadData('.HighH', '.TempH_D');
loadData('.LowH', '.TempL_D');
loadData('.MA_HMI', '.MA_D');
loadData('.Reset_HMI', '.Reset_D');

let MV = 0;
const highLed = document.getElementById('high-warning-led');
const lowLed = document.getElementById('low-warning-led');
const modeButton = document.getElementById("mode-button");

// UI components
function convertStringToNumber(stringValue) {
    const cleanValue = stringValue.replace(/[:="]/g, '').trim();
    return parseFloat(cleanValue) || 0;
}

function updatePvBars() {
    // Get the string values directly from the DOM
    const pvString = document.querySelector('.PV').textContent || '0';
    const pvValue = convertStringToNumber(pvString);

    // Update bars
    updateBar('pv', pvValue);

    console.log(`PV: ${pvValue}`);
}

function updateSpBars() {
    // Get the string values directly from the DOM
    const spString = document.querySelector('.Sp').textContent || '0';
    const spValue = convertStringToNumber(spString);

    // Update bars
    updateBar('sp', spValue);

    console.log(`Sp: ${spValue}`);
}


function updateCoBars() {
    // Get the string values directly from the DOM
    const coString = document.querySelector('.CO').textContent || '0';
    const coValue = convertStringToNumber(coString);

    // Update bars
    updateBar('co', coValue);

    console.log(`CO: ${coValue}`);
}

function updateBar(barId, value) {
    const maxValue = 100; // Maximum scale value
    const percentage = Math.min((value / maxValue) * 100, 100); // Cap at 100%
    const barFill = document.getElementById(`${barId}-fill`);
    barFill.style.height = `${percentage}%`;
}



function SPValue(val, op) {
    let varValue;
    if (op === 'add') {
        varValue = parseInt(document.getElementById("sp-txt").innerHTML) + val;
    } else if (op === 'sub') {
        varValue = parseInt(document.getElementById("sp-txt").innerHTML) - val;
    }

    fetch("", { method: "POST", body: '"Data_block_1".SP=' + varValue });

}

function COValue(val, op) {
    let varValue1;
    if (op === 'add') {
        varValue1 = parseInt(document.getElementById("co-txt").innerHTML) + val;
    } else if (op === 'sub') {
        varValue1 = parseInt(document.getElementById("co-txt").innerHTML) - val;
    }

    fetch("", { method: "POST", body: '"Data_block_1".CO=' + varValue1 });

    const ResetString = document.querySelector('.Reset_HMI').textContent || '0';
    ResetV = convertStringToNumber(ResetString);
}
function reset() {
    fetch("", {
        method: "POST",
        mode:"no-cors",
        body: new URLSearchParams({'"resethmi"': 1})
        })
    setTimeout(function(){
        fetch("", {
            method: "POST",
            mode:"no-cors",
            body: new URLSearchParams({'"resethmi"': 0})
        })
    } , 1000)
}

function updateWarningLEDs() {
    const pvString = document.querySelector('.PV').textContent || '0';
    const pvValue = convertStringToNumber(pvString);
    const TempHString = document.querySelector('.HighH').textContent || '0';
    const THV = convertStringToNumber(TempHString);
    const TempLString = document.querySelector('.LowH').textContent || '0';
    const TLV = convertStringToNumber(TempLString);
    const errorMessage = document.getElementById('error-message');
    console.log(`Current values - PV: ${pvValue}, High: ${THV}, Low: ${TLV}`);

    if (THV <= TLV) {
        // Display error message
        errorMessage.textContent = 'Error: TempHigh must be greater than TempLow!';
    } 

    if (pvValue > THV) {
        highLed.classList.add('high');
    } else {
        highLed.classList.remove('high');
    }
    if (pvValue < TLV) {
        lowLed.classList.add('low');
    } else {
        lowLed.classList.remove('low');
    }
}
function changeMode(mode) {
    const modeIndicator = document.getElementById('current-mode'); // เข้าถึงข้อความโหมด
    const statusIndicator = document.getElementById('status-indicator'); // เข้าถึงไฟแสดงสถานะ
    // const currentMode = document.getElementById('current-mode')
        // เปลี่ยนข้อความใน <span id="current-mode">
        modeIndicator.textContent = mode;


        // เปลี่ยนคลาสของไฟแสดงสถานะตามโหมดที่เลือก
        if (mode === 'Auto') {
            statusIndicator.className = 'status-indicator auto-mode'; // เปลี่ยนเป็นโหมด Auto (สีเขียว)
            // currentMode.textContent = 'AUTO';
        } else if (mode === 'Manual') {
            statusIndicator.className = 'status-indicator manual-mode'; // เปลี่ยนเป็นโหมด Manual (สีแดง)
            // currentMode.textContent = 'Manual'
        }


    
}


currentMode.textContent = mode;

// function modeCHECK() {
//     const MV ='.MA_HMI'
//     console.log(`Current values - MV: ${MV}`);

//     if (MV == 0) {
//         currentModeElement.textContent = 'Auto';
//         currentModeElement.className = 'auto-mode';
//     }

//     else if (MV == 1) {
//         currentModeElement.textContent = 'Manual';
//         currentModeElement.className = 'manual-mode';
//     }

//     else {
//         console.warn("Invalid Mode Value : Allowed values are 0 and 1");
//     }
// }
setInterval(updatePvBars, 1000);
setInterval(updateSpBars, 1000);
setInterval(updateCoBars, 1000);
setInterval(updateWarningLEDs, 1000);
// console.log(setInterval(updateWarningLEDs, 1000))
//setInterval(modeCHECK, 1000)
