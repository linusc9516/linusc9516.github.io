# linusc9516.github.io

Personal site of Linus Chik. Plain HTML, CSS and a tiny JS file; no build step.

- Pages: `index.html`, `projects/`, `resume/`, `outside/`
- Styles: `assets/css/site.css` (tokens, light and dark)
- Resume PDF: `assets/Chik_Kin_Hei_Resume.pdf`
- Preview: `python3 -m http.server`

## Outside

`outside/` holds concerts, rhythm games, reading and watching, Riichi Mahjong and events. It is public: no `noindex`, listed in `sitemap.xml`, and linked from the About paragraph on the homepage. It is deliberately not in the nav, which stays on Projects and Resume.

- Add a short entry by hand under the marker comments in `outside/index.html`.
- Add a trip page: `python3 scripts/new_post.py --outside <slug> "<Title>" "<summary>" [YYYY-MM-DD]`. It creates `outside/<slug>/index.html` and a teaser under "Things I've been to".
- Convert photos or clips first with `python3 scripts/media.py outside <slug> <files...>`. It scales and re-encodes, and never crops. Photos inside `#mahjong` are wrapped in `<figure>` so their captions render as blocks; keep that wrapper.
- To hide a section that is not finished, add `class="oc"` to the `<section>` and leave the markup alone. The hide rule is in `site.css`, and deleting it is what republishes the section.

## Writing (hidden until ready)

`writing/` (technical posts) exists but is not linked from the nav, the homepage or the sitemap, and carries `<meta name="robots" content="noindex">`.

- New post: `python3 scripts/new_post.py --type Research <slug> "<Title>" "<summary>"` (type is Research, Review or Log), then edit `writing/<slug>/index.html`. See `WRITING.md` (untracked, local only) for the full guide.
- To publish: remove the `noindex` meta tag, add a link from the homepage, add the URL to `sitemap.xml`, and add an RSS feed (`feed.xml` plus `<link rel="alternate" type="application/rss+xml">` in the head).
