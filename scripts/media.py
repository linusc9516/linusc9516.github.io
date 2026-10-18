#!/usr/bin/env python3
"""Convert photos and clips to the sizes and formats the site expects.

    python3 scripts/media.py <section> <slug> <file>... [options]

    section   writing or outside
    slug      the post's slug, same as the one given to new_post.py

Images become .webp, at most 1600px wide, with all metadata (EXIF, GPS) removed.
Clips become a muted H.264 .mp4 at most 1280px wide plus a .webp poster; pass
--audio to keep sound. Clips over 20 s or 8 MB are refused, because git history
keeps every committed byte.

Prints paste-ready HTML for each file. Nothing is written outside assets/.
Needs ffmpeg, ffprobe and cwebp; HEIC input also needs sips (macOS).
"""
import argparse, pathlib, re, shutil, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp", ".heic", ".heif"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm", ".mkv", ".gif"}
MAX_CLIP_SECONDS = 20
MAX_CLIP_BYTES = 8 * 1024 * 1024


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"command failed: {' '.join(map(str, cmd))}\n{r.stderr.strip()[-600:]}")
    return r.stdout


def need(tool):
    if not shutil.which(tool):
        sys.exit(f"{tool} not found; install it first (brew install ffmpeg webp)")


def slugify(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "media"


def probe(path, entries):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
               f"stream={entries}", "-of", "csv=p=0", str(path)]).strip()
    return out.split(",")


def unique(directory, stem, ext):
    p = directory / f"{stem}{ext}"
    n = 2
    while p.exists():
        p = directory / f"{stem}-{n}{ext}"
        n += 1
    return p


def convert_image(src, outdir, args, tmp):
    work = src
    if src.suffix.lower() in {".heic", ".heif"}:
        need("sips")
        work = tmp / "heic.jpg"
        run(["sips", "-s", "format", "jpeg", str(src), "--out", str(work)])
    png = tmp / "frame.png"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(work), "-frames:v", "1", "-map_metadata", "-1",
         "-vf", f"scale='min({args.max_width},iw)':-2", str(png)])
    dest = unique(outdir, slugify(src.stem), ".webp")
    run(["cwebp", "-quiet", "-q", str(args.quality), "-metadata", "none", str(png), "-o", str(dest)])
    w, h = probe(dest, "width,height")
    return dest, int(w), int(h)


def convert_video(src, outdir, args, tmp):
    duration = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(src)]).strip() or 0)
    if duration > MAX_CLIP_SECONDS and not args.force:
        sys.exit(f"{src.name} is {duration:.0f}s (limit {MAX_CLIP_SECONDS}s). Embed it from YouTube instead, or pass --force.")
    stem = slugify(src.stem)
    dest = unique(outdir, stem, ".mp4")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-map_metadata", "-1",
           "-vf", f"scale='min({args.max_width_video},iw)':-2,format=yuv420p",
           "-c:v", "libx264", "-crf", str(args.crf), "-preset", "slow", "-movflags", "+faststart"]
    cmd += ["-c:a", "aac", "-b:a", "96k"] if args.audio else ["-an"]
    run(cmd + [str(dest)])
    size = dest.stat().st_size
    if size > MAX_CLIP_BYTES and not args.force:
        dest.unlink()
        sys.exit(f"{src.name} came out at {size / 1048576:.1f} MB (limit 8 MB). Trim it, raise --crf, or use YouTube.")
    poster_png = tmp / "poster.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(min(1.0, duration / 2)), "-i", str(dest),
         "-frames:v", "1", str(poster_png)])
    poster = dest.with_suffix(".webp")
    run(["cwebp", "-quiet", "-q", str(args.quality), "-metadata", "none", str(poster_png), "-o", str(poster)])
    w, h = probe(dest, "width,height")
    return dest, poster, int(w), int(h), size, duration


def rel(p):
    return "/" + str(p.relative_to(ROOT))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("section", choices=["writing", "outside"])
    ap.add_argument("slug")
    ap.add_argument("files", nargs="+", type=pathlib.Path)
    ap.add_argument("--max-width", type=int, default=1600, help="image max width (default 1600)")
    ap.add_argument("--max-width-video", type=int, default=1280, help="clip max width (default 1280)")
    ap.add_argument("--quality", type=int, default=80, help="webp quality (default 80)")
    ap.add_argument("--crf", type=int, default=28, help="H.264 CRF, higher is smaller (default 28)")
    ap.add_argument("--audio", action="store_true", help="keep audio in clips (default: muted)")
    ap.add_argument("--no-lazy", action="store_true", help="omit loading=lazy (use for the first image on a page)")
    ap.add_argument("--force", action="store_true", help="ignore the clip length and size limits")
    args = ap.parse_args()

    if "/" in args.slug or " " in args.slug or not args.slug:
        sys.exit("slug must be non-empty with no slashes or spaces")
    for f in args.files:
        if not f.is_file():
            sys.exit(f"not found: {f}")
        if f.suffix.lower() not in IMAGE_EXT | VIDEO_EXT:
            sys.exit(f"unsupported type: {f.name}")
    for tool in ("ffmpeg", "ffprobe", "cwebp"):
        need(tool)

    img_dir = ROOT / "assets" / "img" / args.section / args.slug
    vid_dir = ROOT / "assets" / "video" / args.section / args.slug
    snippets = []
    lazy = "" if args.no_lazy else ' loading="lazy"'

    for f in args.files:
        with tempfile.TemporaryDirectory() as t:
            tmp = pathlib.Path(t)
            if f.suffix.lower() in IMAGE_EXT:
                img_dir.mkdir(parents=True, exist_ok=True)
                dest, w, h = convert_image(f, img_dir, args, tmp)
                kb = dest.stat().st_size / 1024
                note = f"  (over 300 KB, consider --quality {max(args.quality - 10, 50)})" if kb > 300 else ""
                print(f"{f.name} -> {rel(dest)}  {w}x{h}, {kb:.0f} KB{note}")
                snippets.append(
                    f'<figure>\n<img src="{rel(dest)}" alt="TODO alt text" width="{w}" height="{h}"{lazy}>\n'
                    f"<figcaption>Optional caption.</figcaption>\n</figure>")
            else:
                vid_dir.mkdir(parents=True, exist_ok=True)
                dest, poster, w, h, size, dur = convert_video(f, vid_dir, args, tmp)
                print(f"{f.name} -> {rel(dest)}  {w}x{h}, {dur:.1f}s, {size / 1024:.0f} KB, poster {rel(poster)}")
                # Silent clips act like GIFs: site.js plays them unless reduced motion is on.
                mode = " controls" if args.audio else " data-autoplay controls muted loop"
                snippets.append(
                    f'<video src="{rel(dest)}" poster="{rel(poster)}" width="{w}" height="{h}"'
                    f'{mode} playsinline preload="metadata"></video>')

    print("\nPaste into the post (replace the alt text):\n")
    print("\n\n".join(snippets))


if __name__ == "__main__":
    main()
