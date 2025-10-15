Perfect — here’s a **clear, complete brief** for the application that will unify your blindfold-cubing memory drills, adaptive vividness/flow scoring, and automated logging.
This brief is structured as if you were handing it to a developer (or building it yourself).

---

# 🧠 **App Brief: BLD Memory Trainer**

## 🎯 Purpose

A lightweight training app that helps blindfold cubers progressively improve their **visualization speed**, **story fluency**, and **recall accuracy** using their personalized letter-pair system.
It automatically adapts the evaluation metric (Vividness or Flow) based on drill type and logs results into a local or Google Sheet-compatible CSV.

---

## 🧩 1. Core Functionality

### **Modes**

Each mode corresponds to a training drill type:

| Mode                     | Description                                 | Quality Metric  | Default #Pairs | Goal                        |
| ------------------------ | ------------------------------------------- | --------------- | -------------- | --------------------------- |
| **Flash Pairs**          | Display single letter pairs randomly        | Vividness (1–5) | 30             | Fast image association      |
| **2-Pair Fusion**        | Show 2 pairs → user forms single mini-scene | Vividness (1–5) | 10             | Small scene building        |
| **3-Pair Chain**         | Sequentially add 3 pairs into same story    | Vividness (1–5) | 5              | Progressive chaining        |
| **8-Pair Chain**         | Sequential story of 8 pairs                 | Flow (1–3)      | 8              | Continuous scene building   |
| **Journey Mode**         | Multi-scene (3–5 rooms) practice            | Flow (1–3)      | 15             | Memory Palace chaining      |
| **Full Cube Simulation** | Edge + Corner sequence simulation           | Flow (1–3)      | 20–24          | Realistic BLD memo practice |

---

## 🧭 2. User Flow

1. **Select Drill Type** → dropdown (Flash, Chain, Journey, etc.)
2. **Set Number of Pairs** (or auto-default by mode)
3. **Click “Start Session”** → pairs appear sequentially

   * User visualizes → presses “Next” when image is clear.
   * Timer records per-pair latency.
4. **After final pair:**

   * Prompt:

     * “Rate vividness (1–5)” *if short drill*
     * “Rate story flow (1–3)” *if long drill*
     * “How many pairs recalled correctly?”
   * App calculates:

     * Average time per pair
     * Recall accuracy (%)
     * Quality metric (Vividness or Flow)
5. **Save Session** → App logs row into `bld_training_log.csv`

---

## 🧾 3. Data Model (CSV Log Schema)

| Date | Drill | #Pairs | Avg Time (sec) | Recall Accuracy (%) | Vividness (1–5) | Flow (1–3) | Notes |
| ---- | ----- | ------ | -------------- | ------------------- | --------------- | ---------- | ----- |

The app writes one row per completed session.
If user runs multiple sessions per day, it simply appends.

---

## 📊 4. Dashboard / Analytics (optional v2)

* **Session Stats:** show today’s sessions (speed, accuracy, vividness/flow).
* **Progress Graphs:**

  * Line: Speed (sec/pair) over time
  * Line: Accuracy (%) over time
  * Bar: Avg vividness or flow per week
* **Summary Counters:**

  * Total pairs practiced
  * Average daily sessions
  * Best vividness/flow score this week

---

## ⚙️ 5. Technical Design

### **Frontend**

* Web-based (HTML + JS, no server required)
* Can run locally (offline)
* Minimalist interface: black text on light background, large buttons
* Uses browser `localStorage` or `indexedDB` for logs, exportable as CSV

### **Core Components**

* **Timer**: measure visualization latency per pair
* **Random Pair Generator**: from internal JSON or user’s uploaded list (e.g. `pair_reference.json`)
* **Adaptive Rating Prompt**: dynamically shows vividness or flow based on drill type
* **CSV Exporter**: generates downloadable log file or syncs with Google Sheets API (optional)

### **Optional Backend (Phase 2)**

* Google Sheets API integration → automatic cloud logging
* User authentication (Google OAuth)
* Multi-device sync

---

## 🧩 6. Example Session Flow (8-Pair Chain)

**User:** selects “8-Pair Chain” → clicks “Start Session”

| Step | Event               | Action                                        |
| ---- | ------------------- | --------------------------------------------- |
| 1    | Pair “AL” displayed | User visualizes → clicks “Next”               |
| 2    | Pair “BT” displayed | User integrates into story → clicks “Next”    |
| …    | …                   | …                                             |
| 8    | Pair “JP” displayed | User finishes story → clicks “End Session”    |
| 9    | Prompt appears      | Rates flow = 3, recalls 7/8 pairs             |
| 10   | Log saved           | `Avg=1.1s, Accuracy=87%, Flow=3` saved in CSV |

---

## 🧱 7. Future Features

| Feature                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| 🧩 Pair Library Editor  | Edit, import, or randomize your own letter-pair system |
| 🧠 Scene Recall Mode    | Shows character images instead of pairs                |
| 🔈 Audio Mode           | Reads pairs aloud for auditory practice                |
| 🧮 Auto Stats Dashboard | Graphs and averages directly inside the app            |
| 📱 PWA Export           | Installable mobile version (offline-first)             |

---

## 🧭 Design Principles

1. **Fast feedback:** No typing mid-session — just “Next” → “Rate.”
2. **Minimal friction:** Training should feel like a mini-game.
3. **Offline-capable:** No dependencies, runs in browser or local server.
4. **Data-first:** Every session produces quantifiable, exportable data.

---

Would you like me to now **generate a functional prototype** (HTML/JS) for this app that includes:

* 3 drill modes (Flash, 3-Pair Chain, 8-Pair Chain)
* Automatic vividness/flow selection
* CSV export button?
