#!/usr/bin/env bash
# Copy the resume PDF into the site and point every link at it.
#
#   scripts/sync-resume.sh                      re-copy the PDF, keep the current filename
#   scripts/sync-resume.sh --name NEW.pdf       also rename it (old file removed, all links updated)
#   scripts/sync-resume.sh --src path/to.pdf    use a different source PDF
#
# Source defaults to ~/Code/resume/resume.pdf (override with RESUME_SRC).
# This does NOT update resume/index.html, the HTML copy of the resume: edit that by hand.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="${RESUME_SRC:-$HOME/Code/resume/resume.pdf}"
NAME=""

while [ $# -gt 0 ]; do
	case "$1" in
		--name) NAME="$2"; shift 2 ;;
		--src) SRC="$2"; shift 2 ;;
		-h|--help) sed -n '2,10p' "$0"; exit 0 ;;
		*) echo "unknown option: $1" >&2; exit 2 ;;
	esac
done

[ -f "$SRC" ] || { echo "source PDF not found: $SRC" >&2; exit 1; }

CURRENT="$(grep -o 'assets/[A-Za-z0-9_.-]*\.pdf' resume/index.html | head -1 | sed 's|assets/||')"
[ -n "$CURRENT" ] || { echo "could not find the current PDF name in resume/index.html" >&2; exit 1; }
NAME="${NAME:-$CURRENT}"
case "$NAME" in *.pdf) ;; *) echo "name must end in .pdf" >&2; exit 2 ;; esac
case "$NAME" in */*|*\ *) echo "name must not contain slashes or spaces" >&2; exit 2 ;; esac

cp "$SRC" "assets/$NAME"
if [ "$NAME" != "$CURRENT" ]; then
	rm -f "assets/$CURRENT"
	# every page that links the PDF: footer, resume page button, download filename
	find . -name '*.html' -not -path './node_modules/*' -print0 \
		| xargs -0 perl -pi -e "s{assets/\Q$CURRENT\E}{assets/$NAME}g; s{download=\"\Q$CURRENT\E\"}{download=\"$NAME\"}g"
fi

echo "synced $SRC -> assets/$NAME"
echo "reminder: resume/index.html is the HTML copy; update it by hand if the content changed."
