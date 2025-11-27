const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("session");

// ==== CANVAS ====
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pencil";
let startX = 0, startY = 0;
let snapshot;
let history = [];
let redoList = [];

// Toolbar elements
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraser");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const clearBtn = document.getElementById("clearBoard");
const downloadBtn = document.getElementById("downloadBtn");

// Tool buttons
document.querySelectorAll(".toolBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        tool = btn.getAttribute("data-tool");
    });
});

// ==== WebSocket ====
const socket = new WebSocket(`ws://${window.location.host}/ws/whiteboard`);

socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join", session: sessionId }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "shape" && data.session === sessionId) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;

        if (data.shape === "pencil") drawLine(data.x1, data.y1, data.x2, data.y2);
        if (data.shape === "line") drawStraight(data.x1, data.y1, data.x2, data.y2);
        if (data.shape === "rect") ctx.strokeRect(data.x1, data.y1, data.x2 - data.x1, data.y2 - data.y1);
        if (data.shape === "circle") {
            const r = Math.sqrt((data.x2 - data.x1) ** 2 + (data.y2 - data.y1) ** 2);
            ctx.beginPath(); ctx.arc(data.x1, data.y1, r, 0, Math.PI * 2); ctx.stroke();
        }
        if (data.shape === "arrow") drawArrow(data.x1, data.y1, data.x2, data.y2);
    }
};

// ==== Drawing Utilities ====
function takeSnapshot() {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    ctx.putImageData(snapshot, 0, 0);
}

function saveState() {
    history.push(canvas.toDataURL());
    redoList = [];
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawStraight(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawArrow(x1, y1, x2, y2) {
    const headlen = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    drawStraight(x1, y1, x2, y2);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

// ==== Mouse Events ====
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    saveState();
    takeSnapshot();
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;

    restoreSnapshot();

    if (tool === "pencil") drawLine(startX, startY, x, y), ([startX, startY] = [x, y]);
    if (tool === "line") drawStraight(startX, startY, x, y);
    if (tool === "rect") ctx.strokeRect(startX, startY, x - startX, y - startY);
    if (tool === "circle") {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        ctx.beginPath(); ctx.arc(startX, startY, radius, 0, Math.PI * 2); ctx.stroke();
    }
    if (tool === "arrow") drawArrow(startX, startY, x, y);
});

canvas.addEventListener("mouseup", (e) => {
    drawing = false;
    sendShape(tool, startX, startY, e.offsetX, e.offsetY);
});

// ==== WebSocket Sender ====
function sendShape(shape, x1, y1, x2, y2) {
    socket.send(JSON.stringify({
        type: "shape",
        shape,
        session: sessionId,
        x1, y1, x2, y2,
        color: colorPicker.value,
        size: brushSize.value
    }));
}

// ==== Eraser ====
eraserBtn.addEventListener("click", () => {
    tool = "pencil";
    colorPicker.value = "#ffffff";
});

// ==== Undo / Redo ====
undoBtn.addEventListener("click", () => {
    if (history.length === 0) return;
    redoList.push(canvas.toDataURL());
    const img = new Image();
    img.src = history.pop();
    img.onload = () => ctx.drawImage(img, 0, 0);
});

redoBtn.addEventListener("click", () => {
    if (redoList.length === 0) return;
    history.push(canvas.toDataURL());
    const img = new Image();
    img.src = redoList.pop();
    img.onload = () => ctx.drawImage(img, 0, 0);
});

// ==== Clear Canvas ====
clearBtn.addEventListener("click", () => {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// ==== Download ====
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "whiteboard.png";
    link.click();
});
document.querySelectorAll(".toolBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".toolBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});


// ==== SAVE / LOAD (stays same for your backend) ====
async function saveCanvas() {
    const img = canvas.toDataURL();
    await fetch(`/canvas/save?session_id=${encodeURIComponent(sessionId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img })
    });
    alert("Canvas saved");
}

async function loadCanvas() {
    const res = await fetch(`/canvas/load/${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    if (data.data && data.data.image) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = data.data.image;
    } else {
        alert("Nothing saved yet");
    }
}
window.saveCanvas = saveCanvas;
window.loadCanvas = loadCanvas;