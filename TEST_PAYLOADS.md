# 🧪 Test Payloads for Video Recording

Use these copy-paste examples to show off the system during your screen recording.

---

## 🛑 SCAM 1: The "Telegram Interview" (Behavioral Detection)
**Entity Name:** Acme Global HR
**Text:**
"Congratulations! You have been shortlisted for our remote Data Entry position. Your pay will be $55/hr. Please download Telegram and message our HR manager @AcmeHR_2026 immediately to start your interview. You must respond within 2 hours."

**Expected Outcome:**
- **Verdict:** SCAM
- **Reasoning:** Detects Off-Platform Redirection (Telegram) and extreme urgency.

---

## 🛑 SCAM 2: The "Fake Domain" (DNS Detection)
**Entity Name:** Amazon Careers
**Text:**
"Hi, I am Sarah from Amazon recruitment. We loved your profile. Please fill out the application on our career portal here: https://amazon-hr-internships.net/apply. Kindly complete it today."

**Expected Outcome:**
- **Verdict:** SCAM
- **Forensics:** Shows domain registered 2 days ago.
- **Red Flag:** Amazon doesn't use `.net` for its HR portal.

---

## ✅ CLEAR 1: The Legitimate Offer
**Entity Name:** Microsoft India
**Text:**
"Dear Abhishek, we are pleased to offer you the position of Software Engineering Intern. Please review the attached document and respond via the official Microsoft Careers portal at https://careers.microsoft.com."

**Expected Outcome:**
- **Verdict:** CLEAR
- **Forensics:** Domain `microsoft.com` registered 10,000+ days ago.
- **Trust Score:** 99%

---

## ⚠️ CAUTION 1: The Public Email Provider
**Entity Name:** Local Startup
**Text:**
"Hi, we are a small startup looking for a web dev intern. Please email us at localdevstartup@gmail.com if you are interested."

**Expected Outcome:**
- **Verdict:** CAUTION
- **Reasoning:** Public Gmail address is a risk, but startup context makes it possible.
