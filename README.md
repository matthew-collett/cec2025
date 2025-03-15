# <p align="center">IntelliCure - Team Citadel</p>

<p align="center"><img src="ui/src/assets/icon.svg" width="350px"/></p>
<p align="center">This repository consists of our project for CEC 2025's programming division. Our project addresses this years CEC topic of Ethical Engineering, aiming to promote sustainablity and longevity in engineering solutions.</p>

## 🧭 Table of Contents

- [CEC 2025](#cec2025)

  - [Table of Contents](#-table-of-contents)
  - [Team](#-team)
  - [Tech Stack](#-tech-stack)
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

## 🛠️ Tech Stack

### Frontend

- [**React.js**](https://react.dev/)
  - Frontend JavaScript/Typescript library
- [**TypeScript**](https://www.typescriptlang.org/)
  - Strongly typed programming language that builds on JavaScript
- [**Tailwind**](https://tailwindcss.com/)
  - CSS framework
- [**shadcn/ui**](https://ui.shadcn.com/)
  - Beautifully designed components built with Radix UI and Tailwind CSS

### Backend

- [**Python**](https://www.python.org/)
  - High-level programming language for backend development
- [**Cosmos DB**](https://azure.microsoft.com/en-us/products/cosmos-db)
  - Microsoft's globally distributed, multi-model database service
- [**Flask**](https://pythonbasics.org/flask-rest-api/)
  - Lightweight Python web framework for building APIs
- [**Google Firebase**](https://firebase.google.com/)
  - Platform for developing web and mobile applications
- [**Tensorflow**](https://www.tensorflow.org/)
  - Open-source machine learning framework

## 🏗️ Directory Structure

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

## 🚀 Local Run

## Prerequisites

It is recommended that this program is run on a MacOS device. We had mixed outcomes when running on windows due to a tensor flow version conflict, however Mac always seemed to run smoothly.

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
```

2. Navigate to the project directory

```bash
cd cec2025
```

3. Place the provided environment files in their respective directories:

   - In the root of `api/` directory, create a new file named `.env` and paste in the provided api credentials. Make sure to save the file
   - In the root of `ui/` directory, create a new file named `.env` and paste in the provided firebase credentials. Make sure to save the file

4. Place the Firebase service account key file:
   - Copy the provided `firebase-service-account.json` file to the root of the `api` directory. Make sure it is named the same as `firebase-service-account.json`

These configuration files contain necessary credentials and settings required for the application to function properly.

Now, make sure you are in root directory (`cec2025`) before running. In other words, the same directory as the `Makefile`

5. Set up the project (installs all dependencies)
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

### Other Useful Commands

```bash
# Stop running API processes
make kill-api

# Clean up build artifacts and dependencies
make clean
```
