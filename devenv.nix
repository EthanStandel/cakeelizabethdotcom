{ pkgs, ... }: {
  packages = [ pkgs.nodejs_22 ];

  enterShell = ''
    if [ ! -d node_modules ]; then
      npm install
    fi
  '';
}
