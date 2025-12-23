# Live Browser Artefact Analysis Tool 🌐🔍

A Chrome-based forensic tool designed to perform **live analysis of browser artefacts**, focusing on cookies and website behavior.  
The tool helps users understand **what data is stored in their browser**, **how long it persists**, and **what privacy risks it introduces**.

---

## 📌 Project Motivation

Modern websites heavily rely on browser artefacts such as cookies for analytics, personalization, and advertising.  
Most users unknowingly consent to long-term tracking by clicking **“Accept All Cookies”** without understanding the implications.

This tool brings **browser-level forensic visibility** to users and security learners.

---

## 🚀 Key Features

### 🍪 Live Cookie Artefact Analysis
- Extracts cookies from the currently active website in real time
- Identifies cookie purpose using known definitions and heuristic inference
- Categorizes cookies into:
  - Necessary
  - Analytics
  - Marketing
  - Tracking
  - Unknown

---

### ⚠️ Privacy & Risk Assessment
- Assigns a **risk priority** to each cookie:
  - 🟢 Low Risk
  - 🟠 Medium Risk
  - 🔴 High Risk
- Highlights cookies that may compromise:
  - User privacy
  - Confidentiality
- Displays cookie **expiry timelines**, indicating tracking persistence

---

### 📊 Site-Level Risk Overview
- Total cookies detected
- Count of High / Medium / Low risk cookies
- Unknown cookie count
- Overall **Site Risk Score (0–100)**

---

### 🚨 Suspicious Website Detection
- Flags potentially suspicious or unsafe domains
- Uses rule-based URL pattern analysis
- Intended for awareness and forensic education (not malware detection)

---

### 🧠 User Awareness & Education
- Explains cookie behavior in simple, human-readable language
- Clearly states that **“Unknown” does not imply malicious intent**
- Encourages informed consent over blind acceptance

---

## 🛠️ Technology Stack

- JavaScript (ES6 Modules)
- Chrome Extension API (Manifest V3)
- Chromium Cookies API
- HTML & CSS

---

## 🔐 Privacy & Ethical Considerations

- ❌ No user data collection
- ❌ No external data transmission
- ✅ All processing occurs locally within the browser
- Built strictly for educational and forensic awareness purposes

---

## 🧪 Known Limitations

- Cookie creation time is not exposed by Chromium APIs
- Some cookies are site-specific and require manual interpretation
- Suspicious site detection is heuristic-based

---

## 🧠 Learning Outcomes

- Browser forensics fundamentals
- Live artefact analysis techniques
- Cookie tracking and privacy risks
- Risk scoring logic
- Chrome extension development (MV3)

---

## 📸 Screenshots
<img width="1549" height="777" alt="image" src="https://github.com/user-attachments/assets/902deba5-728d-494a-b3b2-9d456d31be4d" />

<img width="1559" height="796" alt="image" src="https://github.com/user-attachments/assets/756e9edc-a200-4ae2-8fc6-f92b22f102a1" />




---

## 🧑‍💻 Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project directory

---

## 📄 Use Cases

- Cybersecurity and Digital Forensics mini-project
- Browser artefact analysis demonstrations
- Privacy awareness sessions
- SOC / DFIR foundational learning
- Portfolio and GitHub showcase

---

## 👩‍💻 Author

**Pratheeka** – Project lead, core idea, design, forensic logic, implementation, documentation


## 🤝 Contributions

- **Anas** – Extension concept discussion and coding assistance

---

## 📜 License

This project is intended for educational and research purposes only.









