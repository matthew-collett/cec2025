# <p align="center">IntelliCure - Team Citadel</p>

<p align="center"><img src="assets/logo.svg" width="350px"/></p>
<p align="center">This repository consists of our project for CEC 2025's programming division. Our project addresses this years CEC topic of Ethical Engineering, aiming to promote sustainablity and longevity in engineering solutions.</p>

## 🧭 Table of Contents

- [SWE4103 Project](#swe4103-project)
  - [Table of Contents](#-table-of-contents)
  - [Team](#-team)
  - [Directory Structure](#-directory-structure)
  - [Local Run](#-local-run)
    - [Prerequisites](#prerequisites)
      - [Windows](#windows)
      - [macOS](#macos)
    - [Steps](#steps)

## 👥 Team

| Team Member     | Role Title                     | Description                                                                                                                                             |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matthew Collett | Frontend Developer             | Focus on architecture design and solving complex problems, with a focus on the micro-batching process.                                                  |
| Cooper Dickson  | Project Manager/Developer      | Ensure that the scope and timeline are feasible and overview project status, focus on UI and real-time transmission.                                    |
| Alex Groom      | Backend and Database Developer | In charge of agile methods for the team such as organizing meetings, removing blockers, and team communication, focus on UI and web socket interaction. |
| Aidan Foster    | Product Owner/Developer        | Manager of product backlog and updating board to reflect scope changes and requirements, focus on database operations and schema design.                |
|                 |

## 🏗️ Directory Structure

## 🚀 Local Run

### Prerequisites

- **Node.js** and **Yarn** must be installed on your machine. You can verify if you have these by running the following commands

```bash
node -v
yarn -v
nvm -v  # For Windows, use 'nvm version'
```

#### Windows

- You can download Node.js from the official [Node.js website](https://nodejs.org/en)
- After installing Node.js, install Node Version Manager (`nvm`) by following [this guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
- After installing Node.js, install Yarn by running

```bash
npm install -g yarn
```

#### macOS

- On macOS, you can install Node.js via Homebrew

```bash
brew install node
```

- To install Node Version Manager (`nvm`), also use Homebrew

```bash
brew install nvm
```

**Note**: I had some issues with nvm not being added to my path, so if after installing you still cannot run `nvm -v`, add it to your path and try again

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
```

- To install Yarn, also use Homebrew

```bash
brew install yarn
```

- If you do not have Homebrew on your mac, I would highly recommend installing it [here](https://brew.sh/).

### Steps

1. First, start by cloning this repository to your local machine

```bash
git clone https://github.com/swe4103/swe4103-project.git
```

2. Navigate into the project directory

```bash
cd swe4103-project
```

3. Copy the `.env.example` file and populate with valid credentials. Please reach out to any of the development leads for valid credentials.

```bash
cp api/.env.exmaple api/.env
```

4. Install and use the version of node specified in the `.nvmrc` file by running the following commands

```bash
nvm install
nvm use
```

5. Install the necessary dependencies

```bash
yarn install
```

6. At this point, you can run either just the client (frontend React.js application), just the server (backend Express.js API), or you can run them concurrently, communicating with eachother

**Client**

```bash
yarn run client
```

Client application should be running at `http://localhost:5173`

**Server (API)**

```bash
yarn run api
```

API server application should be running at `http://localhost:3000`

**Both**

```bash
yarn run dev
```

This will run both the client and the API server concurrently communicating with eachother in the foreground.
