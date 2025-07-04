const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const challengeList = document.getElementById("challenge-list");
const logOutput = document.getElementById("log-output");

let services = {};
let vulns = [];
let score = 0;
let level = 1;

const challenges = [
  { name: "Find open port", done: false },
  { name: "Exploit SQLi", done: false },
  { name: "Trigger XSS", done: false },
  { name: "Use LFI", done: false },
  { name: "Bypass Login with SQLi", done: false },
  { name: "Command Injection", done: false }
];

function log(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  terminalOutput.appendChild(div);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  addToLog("[TERMINAL] " + msg);
}

function addToLog(msg) {
  const line = document.createElement("div");
  line.textContent = msg;
  logOutput.appendChild(line);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function updateScoreboard() {
  scoreDisplay.textContent = `Score: ${score}`;
  levelDisplay.textContent = `Level: ${level}`;
}

function updateChallenges() {
  challengeList.innerHTML = "";
  challenges.forEach((c, i) => {
    const li = document.createElement("li");
    li.textContent = c.name;
    if (c.done) li.classList.add("complete");
    challengeList.appendChild(li);
  });
}

function resetLab() {
  services = {};
  vulns = [];
  score = 0;
  level = 1;
  challenges.forEach(c => c.done = false);
  terminalOutput.innerHTML = "";
  logOutput.innerHTML = "";
  log("💥 Lab has been reset.");
  updateScoreboard();
  updateChallenges();
}

function launchService(name) {
  if (services[name]) return log(`⚠️ ${name} already running.`);
  services[name] = true;
  log(`✅ ${name} service started on port ${getFakePort(name)}.`);
}

function injectVuln(type) {
  if (vulns.includes(type)) return log(`⚠️ ${type} already injected.`);
  vulns.push(type);
  log(`🕳️ ${type} vulnerability injected.`);
}

function getFakePort(service) {
  return {
    HTTP: 80,
    FTP: 21,
    SSH: 22,
    DB: 3306
  }[service] || 8080;
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = terminalInput.value.trim();
    if (cmd) runCommand(cmd);
    terminalInput.value = "";
  }
});

function runCommand(cmd) {
  log("> " + cmd);
  const [base, arg] = cmd.split(" ");

  switch (base) {
    case "scan":
      return scanPort(arg || "80");

    case "sqlmap":
      return tryExploit("SQLi", "🔥 SQL Injection successful!", 50, 1);

    case "xss":
      return tryExploit("XSS", "💥 XSS payload executed!", 50, 2);

    case "lfi":
      return tryExploit("LFI", "📂 Accessed /etc/passwd (simulated)", 40, 3);

    case "inject":
      return tryExploit("CMD", "💣 Remote Command Executed", 60, 5);

    case "status":
      showStatus();
      break;

    case "help":
      showHelp();
      break;

    case "missions":
      updateChallenges();
      log("🎯 Challenge list updated.");
      break;

    case "levelup":
      if (score >= 150 && level === 1) {
        level = 2;
        log("🔓 Level 2 unlocked! New features coming...");
        updateScoreboard();
      } else {
        log("🛑 Not enough score to level up.");
      }
      break;

    case "reset":
      resetLab();
      break;

    default:
      log("❌ Unknown command. Type 'help' for list.");
  }
}

function scanPort(port) {
  const open = Object.keys(services).length > 0;
  if (!challenges[0].done) {
    challenges[0].done = true;
    score += 10;
  }
  log(open ? `🟢 Port ${port} appears OPEN.` : `🔴 Port ${port} is CLOSED.`);
  updateScoreboard();
  updateChallenges();
}

function tryExploit(type, msg, pts, challengeIndex) {
  if (!vulns.includes(type)) return log(`❌ ${type} not active.`);
  log(msg);
  if (!challenges[challengeIndex].done) {
    challenges[challengeIndex].done = true;
    score += pts;
    updateScoreboard();
    updateChallenges();
  }
}

function showStatus() {
  log(`🛠 Services: ${Object.keys(services).join(", ") || "None"}`);
  log(`🕳 Vulns: ${vulns.join(", ") || "None"}`);
  log(`📊 Score: ${score}`);
  log(`🚀 Level: ${level}`);
}

function showHelp() {
  log(`
📚 Available Commands:
• scan [port]     — Port scanner
• sqlmap          — Exploit SQLi
• xss             — Trigger XSS
• lfi             — Try Local File Inclusion
• inject          — Simulate Command Injection
• missions        — View challenges
• status          — Show current state
• levelup         — Try to level up
• reset           — Reset everything
`);
}

// 🛡️ Fake Login Handler
function attackLogin(e) {
  e.preventDefault();
  const u = document.getElementById("login-username").value;
  const p = document.getElementById("login-password").value;
  const output = document.getElementById("login-result");

  if (!services.HTTP) return (output.textContent = "❌ HTTP not running.");

  if (vulns.includes("SQLi") && (p.includes("'") || p.includes("1=1"))) {
    output.textContent = "🛡️ SQL Injection Successful! Bypassed login.";
    if (!challenges[4].done) {
      challenges[4].done = true;
      score += 60;
      updateScoreboard();
      updateChallenges();
    }
  } else if (vulns.includes("XSS") && u.includes("<script>")) {
    output.textContent = "💥 XSS Triggered in login field.";
    if (!challenges[2].done) {
      challenges[2].done = true;
      score += 50;
      updateScoreboard();
      updateChallenges();
    }
  } else {
    output.textContent = "⛔ Invalid login.";
  }
  addToLog(`[LOGIN] Username: ${u}, Password: ${p}`);
}

// 🧰 Exploit Builder UI
function runExploitBuilder() {
  const type = document.getElementById("exploit-type").value;
  const target = document.getElementById("exploit-target").value.toUpperCase();
  const output = document.getElementById("exploit-result");

  if (!services[target]) {
    output.textContent = `❌ ${target} service not active.`;
    return;
  }

  if (!vulns.includes(type)) {
    output.textContent = `❌ ${type} not present in ${target}.`;
    return;
  }
+${target}.`;
  addToLog(`[EXPLOIT] ${type} launched on ${target}`);
  runCommand(type.toLowerCase());
}

// Init
updateScoreboard();
updateChallenges();
