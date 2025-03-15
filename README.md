# <p align="center">IntelliCure - Team Citadel</p>

<p align="center"><img src="ui/src/assets/icon.svg" width="350px"/></p>
<p align="center">This repository consists of our project for CEC 2025's programming division. Our project addresses this years CEC topic of Ethical Engineering, aiming to promote sustainablity and longevity in engineering solutions.</p>

## 🧭 Table of Contents

- [CEC 2025](#cec2025)
  - [Table of Contents](#-table-of-contents)
  - [Team](#-team)
  - [Directory Structure](#-directory-structure)
  - [Local Run](#-local-run)
    - [Prerequisites](#prerequisites)
      - [Windows](#windows)
      - [macOS](#macos)
    - [Steps](#steps)

## 👥 Team

| Name            | Role                       |
| --------------- | -------------------------- |
| Matthew Collett | Frontend Developer         |
| Cooper Dickson  | Backend/AI Developer       |
| Alex Groom      | Backend/Database Developer |
| Aidan Foster    | Backend/AI Developer       |

## 🏗️ Directory Structure

# Directory Structure

## Key Directories

```
.
├── api                  # Backend API code
│   ├── app
│   │   ├── blueprints   # API route definitions
│   │   ├── logic        # Business logic and model implementation
│   │   ├── middlewares  # Request/response middleware
│   │   └── services     # External service integrations
│   └── temp_uploads     # Temporary file storage
└── ui                   # Frontend code
    ├── public           # Static assets
    └── src
        ├── assets       # Images, icons, etc.
        ├── components   # Reusable UI components
        ├── context      # React context providers
        ├── hooks        # Custom React hooks
        ├── layouts      # Page layout components
        ├── lib          # Utility functions and helpers
        ├── routes       # Application routes and pages
        └── types        # TypeScript type definitions
```

# 🚀 Local Run

## Prerequisites

- **Python 3.10**
- **Node.js** and **Yarn**

### Verifying installations

```bash
python --version  # Should be 3.10.x
node -v
yarn -v
```

### Installing prerequisites

#### Windows

- Download Python 3.10 from the [official website](https://www.python.org/downloads/release/python-3100/)
- Download Node.js from the [official website](https://nodejs.org/)
- Install Yarn: `npm install -g yarn`

#### macOS

```bash
# Install Python 3.10
brew install python@3.10

# Install Node.js
brew install node

# Install Yarn
brew install yarn
```

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/matthew-collett/cec2025.git
   cd cec2025
   ```

2. Place the provided environment files in their respective directories:

   - Place the `api/.env` file in the root of the `api` directory
   - Place the `ui/.env` file in the root of the `ui` directory

3. Place the Firebase service account key file:
   - Copy the provided `firebase-service-account.json` file to the root of the `api` directory. Make sure it is named the same as `firebase-service-account.json`

These configuration files contain necessary credentials and settings required for the application to function properly.

4. Set up the project (installs all dependencies)
   ```bash
   make setup
   ```

## Running the Application

### Start UI only

```bash
make ui
```

UI will be available at http://localhost:5173

### Start API only

```bash
make api
```

API will be available at http://localhost:5000

### Start both UI and API

```bash
make run
```

## Other Useful Commands

```bash
# Stop running API processes
make kill-api

# Clean up build artifacts and dependencies
make clean
```
