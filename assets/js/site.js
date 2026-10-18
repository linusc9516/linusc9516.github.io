// Progressive enhancement only: every page works without this file.
(() => {
	const nav = document.querySelector(".nav");
	if (nav) {
		const update = () => nav.classList.toggle("scrolled", window.scrollY > 8);
		update();
		addEventListener("scroll", update, { passive: true });
	}

	const clock = document.getElementById("clock");
	if (clock) {
		const fmt = new Intl.DateTimeFormat("en-GB", {
			timeZone: "Asia/Singapore",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hourCycle: "h23",
		});
		const tick = () => {
			clock.textContent = fmt.format(new Date());
			const tz = document.createElement("span");
			tz.className = "tz";
			tz.textContent = " (UTC+8)";
			clock.append(tz);
			setTimeout(tick, 1000 - (Date.now() % 1000));
		};
		tick();
	}

	// Email: never written out in full in the HTML; links get their mailto here
	const addr = ["linusc9516", "gmail.com"].join("@");
	for (const a of document.querySelectorAll("a[data-mail]")) a.href = `mailto:${addr}`;

	// Clips replay muted; without JS or under reduced motion the poster and native controls stand in.
	const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
	for (const v of document.querySelectorAll("video[data-autoplay]")) {
		if (still) continue;
		v.controls = false;
		v.play().catch(() => (v.controls = true));
	}

	// Table of contents for long posts: add data-toc to the <article class="post">
	const article = document.querySelector("article.post[data-toc]");
	const heads = article ? [...article.querySelectorAll("h2")] : [];
	if (article && heads.length > 1) {
		const nav = document.createElement("nav");
		nav.className = "toc";
		nav.setAttribute("aria-label", "Contents");
		const ol = document.createElement("ol");
		for (const h of heads) {
			h.id ||= h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.href = `#${h.id}`;
			a.textContent = h.textContent;
			li.append(a);
			ol.append(li);
		}
		nav.append(Object.assign(document.createElement("strong"), { textContent: "Contents" }), ol);
		heads[0].before(nav);
	}

	// Replay control, added by JS so the button never renders without a handler.
	const term = document.querySelector(".term");
	if (term && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
		const tools = document.createElement("div");
		tools.className = "term-tools";
		const b = document.createElement("button");
		b.type = "button";
		b.textContent = "↻ replay";
		b.addEventListener("click", () => {
			for (const a of term.getAnimations({ subtree: true })) {
				if (a.effect.getComputedTiming().iterations !== Infinity) {
					a.currentTime = 0;
					a.play();
				}
			}
		});
		tools.append(b);
		term.append(tools);
	}
})();
