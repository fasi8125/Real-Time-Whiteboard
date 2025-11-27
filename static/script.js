const API = `http://${window.location.host}`;
let token = "";
let sessionId = "";

// ===== AUTH =====
async function registerUser() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;

    if (!u || !p) {
        alert("Please enter username and password");
        return;
    }

    const res = await fetch(`${API}/auth/register?username=${encodeURIComponent(u)}&password=${encodeURIComponent(p)}`, {
        method: "POST"
    });
    const data = await res.json();
    if (data.error) {
        alert(data.error);
    } else {
        alert("Registered successfully! Now login.");
    }
}

async function loginUser() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;

    if (!u || !p) {
        alert("Please enter username and password");
        return;
    }

    const res = await fetch(`${API}/auth/login?username=${encodeURIComponent(u)}&password=${encodeURIComponent(p)}`, {
        method: "POST"
    });
    const data = await res.json();

    if (!data.access_token) {
        alert(data.error || "Login failed");
        return;
    }

    token = data.access_token;
    alert("Login successful!");

    document.getElementById("auth-section").style.display = "none";
    document.getElementById("session-section").classList.remove("hidden");
}

// ===== SESSIONS =====
async function createSession() {
    if (!token) {
        alert("Please login first");
        return;
    }

    const res = await fetch(`${API}/sessions/create?token=${encodeURIComponent(token)}`, {
        method: "POST"
    });
    const data = await res.json();

    if (!data.session_id) {
        alert("Failed to create session");
        return;
    }

    sessionId = data.session_id;
    document.getElementById("sessionId").value = sessionId;
    alert("Session created: " + sessionId);
}

async function joinSession() {
    if (!token) {
        alert("Please login first");
        return;
    }

    const id = document.getElementById("sessionId").value.trim();
    if (!id) {
        alert("Please enter Session ID");
        return;
    }

    sessionId = id;

    await fetch(`${API}/sessions/join/${encodeURIComponent(sessionId)}?token=${encodeURIComponent(token)}`, {
        method: "POST"
    });

    // open whiteboard page for this session
    window.location.href = `/whiteboard?session=${encodeURIComponent(sessionId)}`;
}
