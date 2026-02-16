![Better Monitor Banner](/assets/github-hero-banner.png)

# Better Monitor

**Better Monitor** is a simple, lightweight "first alert" system designed to notify you immediately when your APIs, backend, or any other web resources go offline.

It runs locally as a browser extension, acting as a quick and reliable watchdog for your critical services when you are browsing or working on other tasks.

> 🚧 **Note:** This project is currently in a **very early stage** of development. Features and UI are subject to change.

## 💡 Why Better Monitor?

Think of this as a **"First Alert"** companion to enterprise tools like **Better Stack** or **Incident.io**.

*   **Complementary & Personal:** Enterprise tools handle team-wide incidents; Better Monitor is for **you**. It lives in your browser to give you an instant "ping" the moment your service flickers.
*   **Zero-Setup Alternative:** Perfect for solo devs who just want uptime checks without configuring complex infrastructure or paying for SaaS plans.

## 🚀 Important Features

*   **First Alert System:** Get notified the moment your monitor detects downtime.
*   **Zero Dependencies:** This extension is built with vanilla JavaScript, HTML, and CSS. No heavy frameworks or external libraries, making it lightweight, fast, and secure.
*   **Local & Private:** Everything runs in your browser. No external servers track your monitors.


### Technical Approach
1.  **Storage:** Currently uses `localStorage` (via the popup) to persist monitor configurations locally.
2.  **UI Architecture:** The UI is dynamically generated using HTML `<template>` tags. The `popup.js` clones these templates to render monitor cards efficiently without innerHTML injection risks for user data.
3.  **No Build Step:** The project is raw HTML/CSS/JS. You do not need `npm install` or a bundler to run it.

## 🛠️ Installation

1.  Clone this repository.
2.  Open your browser's extension management page (e.g., `chrome://extensions`).
3.  Enable **Developer Mode**.
4.  Click **Load unpacked** and select the directory where you cloned this repo.

## 🤝 Contributing

We welcome contributions! This repository is a great starting point for developers looking to get started with browser extensions or open source.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide before you start making contributions.


## 🔒 Security

Better Monitor is designed to be safe with zero dependencies. If you discover a security vulnerability, please see our [SECURITY.md](SECURITY.md) policy.
