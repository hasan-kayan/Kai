# Kai: The Ultimate System & Network Automation CLI Tool

Kai is a powerful Rust-based system monitoring and automation CLI tool designed for Linux and macOS users. Combining the capabilities of `htop`, `proxychains`, Git automation, and system replication, Kai provides developers, system administrators, and power users a unified interface to manage local and remote environments effortlessly.

---

## ✨ Features

### 🤖 System & Network Monitoring (like `htop`, but better)

* Monitor CPU, memory, disk, and network usage in real time
* Display running processes, their resource usage, and hierarchical view
* Visual performance charts rendered in terminal
* Works seamlessly on Linux and macOS

### 🚪 Proxy Management & Automation

* Save and apply proxy configurations for various protocols (SSH, HTTP, SOCKS5, FTP, etc.)
* Automate remote connections using predefined profiles
* Enable or disable proxy rules with a single command

### 🗒 Git Automation Manager

* Store and reuse Git templates (e.g., `.gitignore`, hooks, project boilerplates)
* Automate repo initialization, commit tagging, and branch management
* Works with multiple Git accounts and organizations

### 🚀 System Snapshot & Replication

* Detects and maps your current system architecture
* Lists all installed packages, environment variables, and services
* Generates a ready-to-run Bash script to replicate your system on another machine
* Allows exporting system architecture to portable formats (YAML, JSON, Bash)

### ⌛ PostgreSQL & MongoDB Powered Data Layer

* PostgreSQL for relational system snapshots and automation records
* MongoDB for dynamic configurations, logs, and session states
* Extensible and ready for plug-in enhancements

---

## 🚀 Getting Started

### 📦 Prerequisites

* Rust >= 1.70
* PostgreSQL >= 14
* MongoDB >= 5
* Linux (x86\_64) or macOS (Intel/ARM)

### 📂 Installation

```bash
# Clone the repo
$ git clone https://github.com/yourusername/kai.git
$ cd kai

# Install dependencies and build
$ cargo build --release

# Launch Kai
$ ./target/release/kai
```

### 🔧 Configuration

Edit `config/kai.toml` to:

* Set default proxy profiles
* Configure Git automation options
* Define database connections (PostgreSQL, MongoDB)

---

## ⚙ Usage

### 🌐 Monitor System

```bash
kai monitor
```

### ⛓ Manage Proxies

```bash
kai proxy save my-ssh --type ssh --host 192.168.1.5 --port 22
kai proxy apply my-ssh
```

### 🎓 Automate Git

```bash
kai git init --template rust-cli
kai git commit --message "Initial commit"
```

### 🧪 Export System Setup

```bash
kai export --format bash --output my_setup.sh
```

---

## 🔍 Example Use Case

Imagine you're configuring a new development machine. With Kai, you can:

1. Export your current system's installed packages and settings from your main PC.
2. Save Git project setups and proxy configs.
3. Apply everything automatically to the new device.

No more manual package installations or config copying!

---

## 📊 Database Schema

* PostgreSQL:

  * `system_snapshots`
  * `git_templates`
  * `proxy_profiles`
* MongoDB:

  * `logs`
  * `sessions`
  * `user_preferences`

---

## 🛠 Architecture Overview

```
[Rust CLI Core]
     ├── System Monitor (htop-like)
     ├── Proxy Manager
     ├── Git Automation
     └── System Exporter
         ├── PostgreSQL → Relational State
         └── MongoDB → Dynamic & Logs
```

---

## 📖 Roadmap

* [ ] Web UI (Tauri or Yew frontend)
* [ ] Plugin system for external integrations (Docker, Kubernetes, VSCode)
* [ ] SSH Tunneling & Key Management
* [ ] CRON job generator

---

## 💼 License

MIT License. See [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Hasan Kayan**
[Website](https://www.hasankayan.com) | [LinkedIn](https://linkedin.com/in/hasan-kayan-37a59319b) | [GitHub](https://github.com/hasan-kayan)

---

## ✨ Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## ❓ Support

Found a bug or want to request a feature? Open an issue or email me at [hello@hasankayan.com](mailto:hello@hasankayan.com)
