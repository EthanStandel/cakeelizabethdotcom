limactl list -q | xargs -I {} limactl stop --force {}
limactl list -q | xargs -I {} limactl delete {}