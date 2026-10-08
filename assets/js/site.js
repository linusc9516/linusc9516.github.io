// Progressive enhancement only: every page works without this file.
(() => {
	const nav = document.querySelector(".nav");
	if (nav) {
		const update = () => nav.classList.toggle("scrolled", window.scrollY > 8);
		update();
		addEventListener("scroll", update, { passive: true });
	}

	// Live clock in the pfetch prompt bar (UTC+8, no DST)
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

	// Replay control (added by JS so there is no dead button without it)
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
