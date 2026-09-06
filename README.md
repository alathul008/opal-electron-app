# Opal Desktop

A **desktop companion application for Opal** built with **Electron, React, TypeScript, Vite, and Tailwind CSS**.

The project combines a React renderer with Electron's main process and uses IPC to coordinate desktop functionality such as window management, media-source selection, and floating application windows.

> **Portfolio note:** This repository is shared to demonstrate practical desktop application development and Electron architecture. Production credentials and environment secrets are intentionally excluded.

## ✨ Highlights

- Electron desktop application architecture
- React + TypeScript renderer
- Vite-based development and production builds
- Electron Builder packaging
- Multiple floating BrowserWindow interfaces
- Desktop/window source discovery through Electron's `desktopCapturer`
- IPC communication between renderer and main process
- React Query for client-side server-state handling
- Clerk-based authentication integration
- Tailwind CSS and Radix UI components
- Toast notifications with Sonner

## 🧰 Tech Stack

| Area | Technologies |
| --- | --- |
| Desktop Runtime | Electron |
| Frontend | React 18, TypeScript |
| Build Tool | Vite |
| Packaging | Electron Builder |
| UI | Tailwind CSS, Radix UI |
| Authentication | Clerk |
| Data | React Query, Axios |
| Desktop IPC | Electron IPC |

## 🏗️ Architecture

```text
Electron Main Process
        │
        ├── BrowserWindow management
        ├── Desktop/window source discovery
        ├── IPC handlers & events
        │
        ▼
React Renderer
        │
        ├── UI components
        ├── Authentication
        ├── React Query
        └── Application interactions
```

The Electron main process creates and manages the application windows, while the React renderer handles the user interface. IPC is used to pass desktop events and data between the two layers.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/alathul008/opal-electron-app.git
cd opal-electron-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment configuration containing only the credentials required by your development environment.

**Never commit `.env` files, API keys, authentication secrets, or other credentials.**

### 4. Run the development build

```bash
npm run dev
```

### 5. Build the desktop application

```bash
npm run build
```

The build script runs TypeScript compilation, Vite bundling, and Electron Builder packaging.

## 🔐 Security Notes

Electron applications should treat the renderer as an untrusted surface. This project keeps Node integration disabled and context isolation enabled in its BrowserWindow configuration.

Keep secrets outside source control and provide configuration through environment variables or an appropriate secret-management system.

## 📌 Development Focus

This project demonstrates experience with:

- Cross-platform desktop application architecture
- Electron main/renderer process separation
- IPC-based communication
- React and TypeScript UI development
- Desktop media/window source integration
- Application packaging and build workflows

## 📄 License

No license has been declared for this repository. All rights are reserved unless otherwise stated by the repository owner.
