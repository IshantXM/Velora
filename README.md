# Velora - AI Social Chemistry Node

Velora is a futuristic, premium social chemistry platform for college students, founders, creators, and researchers. It replaces superficial swiping with personality metrics alignment, voice/video stand-up evaluation, and real-time audio stage rooms.

The application has been fully migrated to **ASP.NET Core (.NET 8.0)** to provide a lightweight, secure environment that does not rely on Next.js server-side overhead or Node.js runtime vulnerabilities.

---

## 🎨 Visual Design: Blue-Green-Violet

The visual system is styled with a premium **Blue-Green-Violet** theme that gives it a glowing, responsive, and state-of-the-art aesthetic:
- **Neon Blue / Cyan** (`#00b5ff`): Represents logical clarity, active calibrations, and connection maps.
- **Mint / Emerald Green** (`#00e5a3`): Highlights humor matches, balanced personality styles, and active nodes.
- **Aura Violet** (`#8a5cf5`): Accents passion metrics, ambition, and live stages.
- **Background Atmosphere**: Custom animated radial glows (`ambient-blue`, `ambient-violet`, `ambient-green`) float smoothly in the background, creating a premium depth effect.

---

## 🔒 Feature Focus: College Requirement Validation

To ensure high credibility and a verified student mesh network, academic verification is a required step during onboarding:
- **Onboarding Step 3 Constraint**: Users cannot proceed to the final step or enter the platform without entering their college/university name and completing the verification.
- **Validation State**: The continue button remains disabled and shows a warnings notification block until the university node verification is completed.

---

## 🛠️ Prerequisites

To run this application locally, you need the **.NET 8.0 SDK** (or higher) installed on your system.

### How to Install .NET SDK on Windows:
1. Open **PowerShell** as an administrator.
2. Run the following package manager command:
   ```powershell
   winget install Microsoft.DotNet.SDK.8
   ```
3. Restart your terminal so the path variable is loaded.

---

## 🚀 How to Run the App

1. Open a terminal in this project root directory.
2. Restore dependencies and build the project:
   ```bash
   dotnet build
   ```
3. Start the local development web server:
   ```bash
   dotnet run
   ```
4. Open the browser and navigate to the URL shown in your terminal (typically `http://localhost:5000` or `http://localhost:5244`).
