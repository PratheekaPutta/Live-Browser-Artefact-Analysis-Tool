let cookieDefinitions = {};
let suspiciousSites = [];

/* ---------------------- Fetch Dynamic Rules ---------------------- */
async function fetchRules() {
  try {
    const response = await fetch('https://YOUR_HOST/cookies_and_sites.json'); // Replace with your hosted JSON URL
    const data = await response.json();
    cookieDefinitions = data.cookies;
    suspiciousSites = data.suspicious_sites;
  } catch (err) {
    console.error('Failed to fetch dynamic rules:', err);
    cookieDefinitions = {
      "_ga": {category:"Analytics", purpose:"Used by Google Analytics to distinguish users."},
      "_gid": {category:"Analytics", purpose:"Used by Google Analytics to store and update page views."},
      "PHPSESSID": {category:"Necessary", purpose:"Maintains user session status."},
      "default": {category:"Unknown", purpose:"General site functionality or uncategorized tracker."}
    };
    suspiciousSites = [];
  }
}

/* ---------------------- Helper Functions ---------------------- */
function inferPurpose(cookieName) {
  const name = cookieName.toLowerCase();
  if (name.includes('session') || name.includes('sess')) return { category: 'Necessary', purpose: 'Maintains user session.' };
  if (name.includes('geo') || name.includes('location')) return { category: 'Analytics', purpose: 'Used for analytics or location tracking.' };
  if (name.includes('id') || name.includes('uuid')) return { category: 'Tracking', purpose: 'Likely used to uniquely identify the user.' };
  if (name.includes('ads') || name.includes('ad')) return { category: 'Marketing', purpose: 'Likely used for advertising.' };
  return null;
}

function getRiskInfo(cookieName, category) {
  const riskyKeywords = ['id','uuid','device','shared','panorama'];
  const isHigh = (category === 'Tracking' || category === 'Marketing') &&
                  riskyKeywords.some(k => cookieName.toLowerCase().includes(k));
  if(isHigh) return {priority: 'High', color: 'red', msg: 'May compromise privacy/confidentiality', clickable: true};
  if(category === 'Analytics') return {priority: 'Medium', color: 'orange', msg: 'Used for analytics or tracking', clickable: false};
  return {priority: 'Low', color: 'green', msg: 'Necessary for site functionality', clickable: false};
}

function formatTimestamp(timestamp) {
  if(!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function analyzeURL(url) {
  const reasons = [];
  suspiciousSites.forEach(site => {
    if (url.includes(site)) reasons.push(`Matches suspicious site: ${site}`);
  });
  return { suspicious: reasons.length > 0, reasons };
}

function calculateRiskScore(summary) {
  const total = summary.total || 1;
  const score = (
    (summary.highRisk / total) * 70 + 
    ((summary.tracking + summary.analytics) / total) * 20 + 
    (summary.necessary / total) * 10
  );
  return Math.min(Math.round(score), 100);
}

function getRiskColor(score) {
  if(score >= 70) return 'red';
  if(score >= 40) return 'orange';
  return 'green';
}

/* ---------------------- Animated Risk Meter ---------------------- */
function animateRiskMeter(bar, targetWidth) {
  let width = 0;
  const id = setInterval(frame, 10);
  function frame() {
    if(width >= targetWidth) clearInterval(id);
    else {
      width++;
      bar.style.width = width + '%';
    }
  }
}

/* ---------------------- Main Function ---------------------- */
async function displayCookies() {
  await fetchRules(); // fetch latest dynamic rules

  let summary = { total:0, analytics:0, marketing:0, tracking:0, necessary:0, unknown:0, highRisk:0 };
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const container = document.getElementById('cookie-list');

  container.innerHTML = '';
  const infoNote = document.createElement('div');
  infoNote.style.fontSize = '0.85em';
  infoNote.style.color = '#555';
  infoNote.style.marginBottom = '8px';
  infoNote.innerHTML = `
    Many cookies are site-specific.<br>
    "Unknown" does not mean malicious — it requires manual/contextual analysis.
    <hr>
  `;
  container.appendChild(infoNote);

  const analysis = analyzeURL(tab.url);
  if (analysis.suspicious) {
    const alert = document.createElement('div');
    alert.style.color = 'red';
    alert.innerHTML = `
      ⚠️ <b>Suspicious Site Detected</b><br>
      Reasons: ${analysis.reasons.join(', ')}
      <hr>
    `;
    container.appendChild(alert);
  }

  const cookies = await chrome.cookies.getAll({ url: tab.url });
  if (cookies.length === 0) {
    container.innerHTML += "No cookies found for this site.";
    return;
  }

  cookies.forEach(cookie => {
    let info = cookieDefinitions[cookie.name] || inferPurpose(cookie.name) || cookieDefinitions['default'];

    summary.total++;
    if (info.category.includes('Analytics')) summary.analytics++;
    else if (info.category.includes('Marketing')) summary.marketing++;
    else if (info.category.includes('Tracking')) summary.tracking++;
    else if (info.category.includes('Necessary')) summary.necessary++;
    else summary.unknown++;

    const risk = getRiskInfo(cookie.name, info.category);
    if(risk.priority === 'High') summary.highRisk++;

    const div = document.createElement('div');
    div.className = 'cookie-item';
    div.style.borderLeft = `4px solid ${risk.color}`;
    div.style.paddingLeft = '6px';
    div.style.marginBottom = '4px';
    div.innerHTML = `
      <div class="name">${cookie.name}
        <span class="category">${info.category}</span>
      </div>
      <div class="purpose">${info.purpose}</div>
      <div style="font-size:0.8em; color:${risk.color}">
        Priority: ${risk.priority} — ${risk.msg}<br>
        Created: ${formatTimestamp(cookie.creationDate)} | Expires: ${formatTimestamp(cookie.expirationDate)}
      </div>
    `;

    // Make high-risk cookies clickable for more info
    if(risk.clickable){
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        alert(`High-Risk Cookie: ${cookie.name}\nPurpose: ${info.purpose}\nCategory: ${info.category}\nThis cookie may compromise your privacy/confidentiality.`);
      });
    }

    container.appendChild(div);
  });

  // Calculate overall risk score
  const riskScore = calculateRiskScore(summary);
  const riskColor = getRiskColor(riskScore);

  // Site Risk Summary + Animated Meter
  const siteRiskDiv = document.createElement('div');
  siteRiskDiv.style.fontSize = '0.9em';
  siteRiskDiv.style.background = '#f4f6f7';
  siteRiskDiv.style.padding = '6px';
  siteRiskDiv.style.marginBottom = '8px';
  siteRiskDiv.innerHTML = `
    <b>Site Risk Overview:</b><br>
    High-Risk Cookies: ${summary.highRisk} 🔴<br>
    Medium-Risk Cookies: ${summary.tracking + summary.analytics} 🟠<br>
    Low-Risk Cookies: ${summary.necessary} 🟢<br>
    Total Cookies: ${summary.total}<br>
    Unknown: ${summary.unknown}<br><br>
    <b>Risk Score:</b> ${riskScore}/100
    <div id="risk-bar-container" style="width:100%; background:#ddd; height:12px; border-radius:6px; margin-top:4px;">
      <div id="risk-bar" style="width:0%; background:${riskColor}; height:12px; border-radius:6px;"></div>
    </div>
  `;
  container.prepend(siteRiskDiv);

  // Animate the risk meter
  const bar = document.getElementById('risk-bar');
  animateRiskMeter(bar, riskScore);

  // Auto-refresh JSON every 2 minutes
  setTimeout(displayCookies, 2*60*1000); // 2 min
}

displayCookies();
