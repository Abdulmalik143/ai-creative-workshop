#!/bin/zsh
# Rebuilds links.html, prints workshop-links.pdf, and renders each links page to preview/links-NN.png.
set -e
cd "${0:A:h}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
node build.mjs
"$CHROME" --headless=new --no-pdf-header-footer --user-data-dir="$PWD/.chrome-tmp" --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/workshop-links.pdf" "file://$PWD/links.html" >/dev/null 2>&1
python3 -I - <<'EOF'
import re
h = open('links.html').read()
head = h.split('<body>')[0]
for m in re.finditer(r'<section class="page (?:links[^"]*" id="l(\d+)|cover())">.*?</section>', h, re.S):
    open(f'_l{m.group(1) or "00"}.html', 'w').write(head + '<body>' + m.group(0) + '</body></html>')
EOF
mkdir -p preview
for f in _l*.html; do
  n=${f#_l}; n=${n%.html}
  "$CHROME" --headless=new --hide-scrollbars --user-data-dir="$PWD/.chrome-tmp" --virtual-time-budget=3000 \
    --window-size=1920,1080 --screenshot="$PWD/preview/links-$n.png" "file://$PWD/$f" >/dev/null 2>&1
done
rm -rf .chrome-tmp _l*.html
ls -la workshop-links.pdf
