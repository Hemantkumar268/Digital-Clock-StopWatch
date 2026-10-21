/*       ==========            Digital Clock           ==========      */

const digiText = document.getElementById("digi-clock-text");
const inputCheck = document.querySelector('.inputCheck');
const digiClockText = document.getElementById("digi-date-text");

// check if toggle click
inputCheck.addEventListener("change", updateClock)

// text of today (include day, date, month, year)
let date = new Date();

let fullDate = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

digiClockText.innerHTML = fullDate;

function updateClock(){
    const date = new Date();
    let hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2,"0");
    const seconds = date.getSeconds().toString().padStart(2,"0");
    let period = "";
    
    // 12 hours clock
    if(!inputCheck.checked){
      period = hour >=12 ? "PM" : "AM";
      hour = hour % 12;
      if(hour === 0) hour = 12
    }

    // Digital Clock Time Set
    digiText.innerHTML = period === '' 
            ? `${hour.toString().padStart(2,"0")} : ${minutes} : ${seconds}`
            : `${hour.toString().padStart(2,"0")} : ${minutes} : ${seconds} ${period}`
}

updateClock()

setInterval( updateClock,1000)




/*         =========              StopWatch               =========         */

// Select stopwatch display, control buttons, and lap container from the DOM
const stopwatchText = document.getElementById("stopwatch-text");
const startbtn = document.getElementById("start");
const stopbtn = document.getElementById("stop");
const resetbtn = document.getElementById("reset");
const lapbtn = document.getElementById("lap");
const lapList = document.getElementById("lapList")

// Track stopwatch state, elapsed time, interval, and saved lap timings
let isRunning = false;
let startTime;
let intervalId=null;
let elapsedTime = 0;
let lapArr = [];


// converts milliseconds into stopwatch time
let unit = {
    "hour":3600000,
    "minute":60000,
    "second":1000,
    "millisecond" : 1
}

function stopWatchStart(){
    
    // Start the stopwatch only if it is not already running
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateStopWatch,10);
        isRunning = true
    }

}

function updateStopWatch(){

    elapsedTime = Date.now() - startTime;
    stopwatchText.innerHTML = formatTime(elapsedTime)
}

function formatTime(time){
    let watchTime = {}
    for(let key in unit){
        let count = Math.floor(time / unit[key]);
        if(key === "millisecond"){
            watchTime[`${key}`] = count.toString().padStart(3,"0");
        }
        else{
            watchTime[`${key}`] = count.toString().padStart(2,"0")
        }
       
        time = time % unit[key]
    }

    return ` ${watchTime["hour"]}:${watchTime["minute"]}:${watchTime["second"]}.${watchTime["millisecond"]} `
}

function stopWatchStop(){
       clearInterval(intervalId);
       intervalId = null;
       isRunning = false;
}

function stopWatchReset(){

    // Reset the stopwatch state, display, and saved laps
    clearInterval(intervalId);
    elapsedTime = 0;
    startTime = 0;
    intervalId = null;
    isRunning = false;
    stopwatchText.innerHTML = formatTime(0);
    lapArr = []
    lapList.classList.remove("active")
}

function stopWatchLap(){

    // Save the current lap only while the stopwatch is running
    if(!isRunning) return;
    lapList.classList.add("active")
    lapArr.push(elapsedTime);

    // Keep only the three most recent lap timings
    if(lapArr.length > 3){
        lapArr.shift();
    }
    renderLap()
}

function renderLap(){

    // Rebuild the lap list using the timings stored in lapArr
    lapList.innerHTML = " ";
    for(let i=0; i<lapArr.length; i++){
        let lapItem = document.createElement("div");
        lapItem.classList.add("lapItemSet")
        lapItem.innerText = `Lap ${i+1} :-  ${formatTime(lapArr[`${i}`])}`;
        lapList.append(lapItem)
    }

}


// Connect button clicks to their corresponding stopwatch actions
startbtn.addEventListener("click", () => {
    stopWatchStart()
})

stopbtn.addEventListener("click", () => {
    stopWatchStop()
})

resetbtn.addEventListener("click", () => {
    stopWatchReset()
})

lapbtn.addEventListener("click", () => {
    console.log("lap btn clicked")
    stopWatchLap()
})


