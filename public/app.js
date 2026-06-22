const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const routes = $$(".page").map((page) => page.id);
const gemBalance = $("#gemBalance");
let gems = 420;

function routeTo(route) {
  const target = routes.includes(route) ? route : "landing";
  $$(".page").forEach((page) => page.classList.toggle("active", page.id === target));
  $$("[data-route]").forEach((link) => link.classList.toggle("active", link.dataset.route === target));
  location.hash = target;
  $(".sidebar").classList.remove("open");
  if (target === "dashboard") drawChart();
}

function toast(message) {
  const box = $("#toast");
  box.textContent = message;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2400);
}

function spendGems(amount = 25) {
  gems = Math.max(0, gems - amount);
  gemBalance.textContent = gems;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function applyLogin(user, token) {
  localStorage.setItem("examnotes_user", JSON.stringify(user));
  if (token) localStorage.setItem("examnotes_token", token);
  gems = Math.max(gems, user.gems || 100) + 100;
  gemBalance.textContent = gems;
  toast("Google login successful. 100 gems added.");
  routeTo("dashboard");
}

function loading(target) {
  target.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
}

function formDataObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderNotes(target, data) {
  const output = data.output;
  target.innerHTML = `
    <h3>${output.subject || "Computer Networks"}: ${output.mode || "Complete Notes"}</h3>
    <ul class="result-list">
      ${(output.notes || []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <h3>Important Questions</h3>
    <ul class="result-list">
      ${(output.questions || []).map((q) => `<li><strong>${q.probability}%</strong> probability - ${q.question} (${q.marks} marks)</li>`).join("")}
    </ul>
  `;
}

function renderPyq(target, data) {
  const output = data.output;
  target.innerHTML = `
    <h3>Most Asked Topic: ${output.mostAskedTopic}</h3>
    <p>Appeared ${output.appeared} times with expected weightage of ${output.weightage}%.</p>
    <ul class="result-list">
      ${output.repeatedQuestions.map((q) => `<li>${q.question} - ${q.probability}% confidence</li>`).join("")}
    </ul>
  `;
}

function renderHeatmap() {
  const topics = [
    ["CPU Scheduling", 92],
    ["Transport", 84],
    ["DBMS Joins", 77],
    ["CRC", 70],
    ["Deadlock", 66],
    ["Normalization", 81],
    ["OSI Model", 61],
    ["Paging", 73],
    ["SQL", 88],
    ["Routing", 69]
  ];
  $("#heatmap").innerHTML = topics.map(([topic, hot]) => `<span style="--hot:${hot}"><strong>${hot}%</strong><br>${topic}</span>`).join("");
}

function drawChart() {
  const canvas = $("#weightageChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const data = [
    ["Data Link", 18, "#38d6ff"],
    ["Network", 22, "#8b5cf6"],
    ["Transport", 25, "#34d399"],
    ["DBMS", 20, "#f7c948"],
    ["OS", 15, "#f472b6"]
  ];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  data.forEach(([label, value, color], index) => {
    const x = 50 + index * 116;
    const height = value * 8;
    ctx.fillStyle = "rgba(255,255,255,.08)";
    ctx.fillRect(x, 30, 64, 220);
    ctx.fillStyle = color;
    ctx.fillRect(x, 250 - height, 64, height);
    ctx.fillStyle = "#eef4ff";
    ctx.font = "700 16px Inter";
    ctx.fillText(`${value}%`, x + 10, 250 - height - 10);
    ctx.fillStyle = "#9aa8bd";
    ctx.font = "500 13px Inter";
    ctx.fillText(label, x - 4, 278);
  });
}

function typewriter() {
  const lines = ["Analyzing PYQ patterns...", "Scoring question probability...", "Building your 15-day plan..."];
  const node = $("#typewriter");
  let line = 0;
  setInterval(() => {
    line = (line + 1) % lines.length;
    node.textContent = lines[line];
  }, 2200);
}

$$("[data-route]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    routeTo(link.dataset.route);
  });
});

$("#menuToggle").addEventListener("click", () => $(".sidebar").classList.toggle("open"));

$("#demoLogin").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Connecting...";

  try {
    const data = await postJson("/api/auth/demo-login", {});
    applyLogin(data.user, data.token);
  } catch (_error) {
    applyLogin({
      id: "demo-user",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      gems: 100
    });
  } finally {
    button.disabled = false;
    button.textContent = "Continue with Google";
  }
});

$("#notesForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const target = $("#notesOutput");
  loading(target);
  const data = await postJson("/api/ai/notes", formDataObject(event.currentTarget));
  spendGems(data.gemsSpent);
  renderNotes(target, data);
  toast("Notes generated.");
});

$("#pyqForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const target = $("#pyqOutput");
  loading(target);
  const body = new FormData(event.currentTarget);
  const response = await fetch("/api/ai/pyq-analysis", { method: "POST", body });
  const data = await response.json();
  spendGems(data.gemsSpent);
  renderHeatmap();
  renderPyq(target, data);
  toast("PYQ analysis ready.");
});

$("#planForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await postJson("/api/ai/study-plan", formDataObject(event.currentTarget));
  spendGems(data.gemsSpent);
  $("#planOutput").innerHTML = data.output.plan.map((item) => `
    <article><strong>Day ${item.day}: ${item.focus}</strong><span>${item.task}</span></article>
  `).join("");
  toast("Study plan created.");
});

$("#quizForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const target = $("#quizOutput");
  loading(target);
  const data = await postJson("/api/ai/quiz", formDataObject(event.currentTarget));
  spendGems(data.gemsSpent);
  target.innerHTML = `
    <h3>${data.output.title}</h3>
    <ul class="result-list">${data.output.questions.map((q) => `<li><strong>${q.type}</strong>: ${q.question}<br>Answer: ${q.answer}</li>`).join("")}</ul>
  `;
  toast("Quiz generated.");
});

$("#flashBtn").addEventListener("click", async () => {
  const data = await postJson("/api/ai/flashcards", {});
  spendGems(data.gemsSpent);
  $("#flashOutput").innerHTML = data.output.map((card) => `
    <article class="flash-card"><strong>${card.front}</strong><p>${card.back}</p></article>
  `).join("");
  toast("Flashcards generated.");
});

$$(".pricing-grid button").forEach((button) => {
  button.addEventListener("click", () => toast("Razorpay order endpoint is ready in /api/payments/create-order."));
});

routeTo(location.hash.replace("#", "") || "landing");
renderHeatmap();
typewriter();
