#!/bin/bash

VM_NAME="cakeelizabeth.lima"

# Create lima.yaml from lima.base.yaml
sed "s|{{PROJECT_DIR}}|$(pwd)|g;s|{{VM_NAME}}|${VM_NAME}|g" base.lima.yaml > "${VM_NAME}.yaml"

# Create or start Lima instance based on current status
STATUS=$(limactl list --format '{{.Name}} {{.Status}}' 2>/dev/null | awk -v vm="${VM_NAME}" '$1==vm{print $2}')

# Create from template if instance is new, skip if already running, start or recreate if stopped/broken
if [ -z "$STATUS" ]; then
  echo "Creating Lima instance '${VM_NAME}'"
  limactl start --tty=false "${VM_NAME}.yaml"
elif [ "$STATUS" = "Running" ]; then
  echo "Lima instance '${VM_NAME}' is already running"
else
  echo "Starting Lima instance '${VM_NAME}' (status: $STATUS)"
  if ! limactl start "${VM_NAME}"; then
    echo "Failed to start — recreating instance"
    limactl delete "${VM_NAME}"
    limactl start --tty=false "${VM_NAME}.yaml"
  fi
fi

# Add SSH config entry for VS Code Remote SSH (idempotent)
SSH_HOST="lima-${VM_NAME}"
if ! grep -q "^Host ${SSH_HOST}$" ~/.ssh/config 2>/dev/null; then
  limactl show-ssh --format config "${VM_NAME}" >> ~/.ssh/config
  echo "Added '${SSH_HOST}' to ~/.ssh/config — connect via VS Code Remote SSH"
fi

# Install Nix and devenv (idempotent)
limactl shell "${VM_NAME}" -- bash -lc "
  if ! command -v nix >/dev/null 2>&1; then
    sh <(curl -L https://nixos.org/nix/install) --daemon --yes
    . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
  fi
  command -v devenv >/dev/null || nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
"

exec limactl shell "${VM_NAME}" -- bash -lc "devenv shell"