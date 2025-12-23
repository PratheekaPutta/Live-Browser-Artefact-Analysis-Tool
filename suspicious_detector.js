// suspicious_detector.js

export function analyzeURL(url) {
  const suspiciousTLDs = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.onion'];
  const phishingKeywords = ['login', 'verify', 'secure', 'wallet', 'bank', 'free'];

  let reasons = [];

  suspiciousTLDs.forEach(tld => {
    if (url.endsWith(tld)) {
      reasons.push('Suspicious TLD');
    }
  });

  phishingKeywords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
      reasons.push('Phishing Keyword');
    }
  });

  if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    reasons.push('IP-based URL');
  }

  return {
    suspicious: reasons.length > 0,
    reasons
  };
}
