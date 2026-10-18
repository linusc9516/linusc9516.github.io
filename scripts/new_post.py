#!/usr/bin/env python3
"""Create a page and list it on its index.

    python3 scripts/new_post.py [--outside] [--type TYPE] [--cover PATH] <slug> "<Title>" "<summary>" [YYYY-MM-DD]

Default: writing/<slug>/index.html, listed on /writing/.
--outside: outside/<slug>/index.html, listed under "Things I've been to" on
           /outside/. For trips and events that get a full page; short entries go
           straight into outside/index.html by hand.
--type:    Research, Review or Log. Writing only.
--cover:   --outside only. A converted image already under assets/ (see
           scripts/media.py), for example /assets/img/outside/<slug>/cover.webp.

The new page copies the head and footer of the section index, so it inherits the
same robots meta: noindex while the section is hidden, none once published. Each
section index therefore has to keep its marker comment; the script exits if one
is missing.
"""
import argparse, datetime, html, pathlib, re, subprocess, sys

root = pathlib.Path(__file__).resolve().parent.parent

SECTIONS = {
    "writing": dict(
        label="Writing",
        marker="<!-- entries: new_post.py inserts new posts below this line, newest first -->",
    ),
    "outside": dict(
        label="Outside",
        marker="<!-- featured: new_post.py --outside inserts trip pages below this line, newest first -->",
    ),
}
TYPES = ("Research", "Review", "Log")

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--outside", action="store_true")
ap.add_argument("--type", choices=TYPES)
ap.add_argument("--cover")
ap.add_argument("slug")
ap.add_argument("title")
ap.add_argument("summary")
ap.add_argument("date", nargs="?", default=datetime.date.today().isoformat())
a = ap.parse_args()

section = "outside" if a.outside else "writing"
if a.type and section != "writing":
    sys.exit("--type only applies to Writing posts")
if a.cover and section != "outside":
    sys.exit("--cover only applies with --outside")
if "/" in a.slug or " " in a.slug or not a.slug:
    sys.exit("slug must be non-empty with no slashes or spaces")
try:
    datetime.date.fromisoformat(a.date)
except ValueError:
    sys.exit("date must be YYYY-MM-DD")

cover_img = ()  # (src, width, height)
if a.cover:
    f = root / a.cover.lstrip("/")
    if not f.is_file():
        sys.exit(f"cover not found: {f}")
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height", "-of", "csv=p=0", str(f)], capture_output=True, text=True)
    if r.returncode:
        sys.exit("could not read the cover's size (is ffprobe installed?)")
    w, h = r.stdout.strip().split(",")
    cover_img = (a.cover if a.cover.startswith("/") else "/" + a.cover, w, h)

cfg = SECTIONS[section]
label, marker = cfg["label"], cfg["marker"]
index = root / section / "index.html"
page = root / section / a.slug / "index.html"
if page.exists():
    sys.exit(f"{page} already exists")

shell = index.read_text()
if marker not in shell:
    sys.exit(f"marker comment missing from {index}")
head = shell.split('<main id="main">')[0]
tail = shell.split("</main>")[1]

t, s_ = html.escape(a.title), html.escape(a.summary, quote=True)
index_desc = head.split('<meta name="description" content="')[1].split('"')[0]
head = head.replace(f"/{section}/", f"/{section}/{a.slug}/")
head = head.replace(f"{label} · Linus Chik", f"{t} · Linus Chik")  # <title> and og:title
head = head.replace(index_desc, s_)  # description and og:description

type_span = f'<span class="type">{a.type}</span>' if a.type else ""
cover_fig = (f'<figure class="wide"><img src="{cover_img[0]}" alt="TODO alt text" '
             f'width="{cover_img[1]}" height="{cover_img[2]}"></figure>\n') if cover_img else ""
body = f'''<main id="main">
<article class="post prose">
<a href="/{section}/">← {label}</a>
<h1>{t}</h1>
<p class="post-meta"><time datetime="{a.date}">{a.date}</time>{type_span}</p>
{cover_fig}<p>Write here.</p>
<!-- Living post: add <span>Updated <time datetime="YYYY-MM-DD">YYYY-MM-DD</time></span> inside .post-meta -->
<!-- Over ~1500 words: add data-toc to the <article> tag for an automatic table of contents -->
<!-- End of a technical post: <p class="post-links">Links: <a href="">repo</a> · <a href="">pre-registration</a></p> -->
<!-- Once there are several posts: <nav class="post-nav" aria-label="More posts"><a href="">← Older</a><a href="">Newer →</a></nav> -->
</article>
'''
page.parent.mkdir(parents=True)
page.write_text(head + body + "</main>" + tail)

if section == "writing":
    item = (f'<li><time datetime="{a.date}">{a.date}</time><a href="/writing/{a.slug}/">'
            f"{type_span}<h2>{t}</h2><p>{s_}</p></a></li>")
else:
    img = (f'<img src="{cover_img[0]}" alt="" width="{cover_img[1]}" height="{cover_img[2]}" loading="lazy">'
           if cover_img else "")
    item = (f'<li class="trip"><a href="/outside/{a.slug}/">{img}<div class="body">'
            f'<time datetime="{a.date}">{a.date}</time><h3>{t}</h3><p>{s_}</p></div></a></li>')
# Insert by date (newest first), so back-writing an older post lands in the right place.
pre, post = shell.split(marker, 1)
body_, rest = post.split("</ul>", 1)
items = [ln for ln in body_.split("\n") if ln.strip()]
at = len(items)
for i, ln in enumerate(items):
    m = re.search(r'datetime="(\d{4}-\d{2}-\d{2})"', ln)
    if m and m.group(1) < a.date:
        at = i
        break
items.insert(at, item)
index.write_text(pre + marker + "\n" + "\n".join(items) + "\n</ul>" + rest)
print(f"created {page.relative_to(root)}")
