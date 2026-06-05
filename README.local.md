# Local development

Developers are free to use a local instance of Node & NPM and run this app traditionally. However, this can open developers up to vulnerabilities through malicious NPM packages.

The optional safer development flow runs inside a [Lima](https://lima-vm.io/) VM to keep the host machine clean and the environment reproducible. Inside the VM, [nix](https://nixos.org/) & [devenv](https://devenv.sh/) manage the toolchain. This is a bit more hand-rolled than Docker, but has near-zero performance overhead/penalty. For ease of use, the Lima VM will mount this directory into the VM. So files created by the VM like NPM install will land here as is normally expected.

**Notably, this development flow is only set up for M-series MacOS.**

## Prerequisites

Install Lima on the host Mac:

```bash
brew install lima
```

## Starting the environment

```bash
bash scripts/lima.provision.sh
```

This script is idempotent — safe to run on every session. It:

1. Generates `cakeelizabeth.lima.yaml` from `base.lima.yaml` (stamping in the project path)
2. Creates the Lima VM if it doesn't exist, starts it if stopped, recreates it if broken
3. Adds a `lima-cakeelizabeth.lima` entry to `~/.ssh/config` for VS Code Remote SSH
4. Installs `nix` (multi-user daemon) and `devenv` inside the VM if not already present
5. Drops into a `devenv shell` — the working environment for all dev commands

The `devenv` shell is also set to `npm i` if no `node_modules` directory currently exists.

The shell exits on run of the `exit` command.

```bash
npm run dev
```

## VS Code integration

### Remote SSH

Connect to the VM via **Remote-SSH** using the host `lima-cakeelizabeth.lima` (added to `~/.ssh/config` by the provision script). Open the project folder at the mounted path inside the VM.

### JS debugger

The `dev` script runs Vite with `NODE_OPTIONS=--inspect`, opening the inspector on port `9229`.

To attach from VS Code:

1. Start `npm run dev` inside the VM
2. Run **"Attach to Vite (VM)"** from the Run & Debug panel (or just hit `F5`)

`restart: true` in the launch config means the debugger reconnects automatically after Vite hot-reloads. Breakpoints in server-side code (routes, loaders, API handlers) will be hit. Client-side code is debuggable through browser DevTools as usual.

## Stopping the VM

The VM keeps running after you exit the shell. 

To view running VMs:

```bash
limactl list
```

To stop this app VM:

```bash
limactl stop cakeelizabeth.lima
```

To delete it entirely:

```bash
limactl delete cakeelizabeth.lima
```
