// Create the red bar container
const redBar = document.createElement("div");
redBar.id = "red-bar";

// Create the timer element
const timer = document.createElement("span");
timer.id = "timer";
timer.textContent = "00:00"; // Initial timer value

// Create the gear icon (Unicode or FontAwesome could be used)
const gearIcon = document.createElement("span");
gearIcon.id = "gear-icon";
gearIcon.innerHTML = "&#9881;"; // Unicode for gear icon

// Append the timer and gear icon to the red bar
redBar.appendChild(timer);
redBar.appendChild(gearIcon);

// Append the red bar to the body
document.body.appendChild(redBar);

// Optionally, implement a simple timer that increments every second
let seconds = 0;
setInterval(() => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${secs}`;
  seconds++;
}, 1000);
