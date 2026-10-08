// Interactive prompt for the pfetch card. Progressive enhancement: the static card works without it.
(() => {
	const term = document.querySelector(".term");
	const stub = term && term.querySelector(".prompt2");
	if (!stub) return;

	const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const addr = ["linusc9516", "gmail.com"].join("@");
	const PAGES = { projects: "/projects/", resume: "/resume/" };
	const LINKS = {
		github: "https://github.com/linusc9516",
		linkedin: "https://linkedin.com/in/linusc9516",
	};
	const HELP = [
		["ls", "list pages"],
		["cd projects", "open the projects page"],
		["cd resume", "open the resume"],
		["contact", "show how to reach me"],
		["github", "github.com/linusc9516"],
		["linkedin", "linkedin.com/in/linusc9516"],
		["clear", "clear the output"],
		["song", "what is on repeat"],
		["easter-eggs", "list the hidden commands"],
		["help", "show this list"],
	];
	// Completion candidates: whole command lines
	const COMMANDS = HELP.map(([c]) => c);
	const EGGS = [
		["moo", "a cow says moo"],
		["cowsay hello", "the cow says anything: cowsay <text>"],
		["sl", "steam locomotive"],
		["sudo rm -rf /", "try your luck"],
		["whoami", "who is this?"],
		["pfetch", "replay the card above"],
		["neofetch", "same as pfetch"],
		["exit", "try to leave"],
		[":q", "quit, vim style (:q! and :wq work too)"],
	];

	// DOM: output log + prompt form, replacing the static prompt
	const out = document.createElement("div");
	out.className = "out";
	out.setAttribute("role", "log");
	out.setAttribute("aria-label", "Terminal output");
	out.hidden = true;

	const form = document.createElement("form");
	form.className = "prompt2 live " + stub.className.replace("prompt2", "").trim();
	form.setAttribute("style", stub.getAttribute("style") || "");
	form.autocomplete = "off";
	form.innerHTML =
		'<span class="chev" aria-hidden="true">›</span>' +
		'<span class="field">' +
		'<span class="ghost" aria-hidden="true"><i></i><b></b></span>' +
		'<input type="text" spellcheck="false" autocapitalize="off" autocorrect="off" maxlength="80" ' +
		'aria-label="Terminal prompt. Type ls to list pages or help for commands." aria-describedby="prompt-hint">' +
		'<span class="fake-caret" aria-hidden="true"></span>' +
		"</span>" +
		'<span id="prompt-hint" class="sr-only">Type ls and press Enter. Press Escape to leave the prompt.</span>';
	stub.replaceWith(out, form);
	form.classList.remove("rv");
	form.classList.add("rv");

	const input = form.querySelector("input");
	const ghostTyped = form.querySelector(".ghost i");
	const ghostRest = form.querySelector(".ghost b");

	// Output helpers: only textContent / DOM nodes, never innerHTML with user text
	const MAX_LINES = 60;
	const add = (node) => {
		out.hidden = false;
		out.append(node);
		while (out.childElementCount > MAX_LINES) out.firstElementChild.remove();
		if (document.activeElement === input) form.scrollIntoView({ block: "nearest" });
	};
	const line = (text = "", cls = "") => {
		const d = document.createElement("div");
		d.className = ("line " + cls).trim();
		d.textContent = text;
		add(d);
		return d;
	};
	const linkEl = (text, href, newTab) => {
		const a = document.createElement("a");
		a.href = href;
		a.textContent = text;
		if (newTab) {
			a.target = "_blank";
			a.rel = "noopener";
		}
		return a;
	};
	const cmdButton = (name, label = name) => {
		const b = document.createElement("button");
		b.type = "button";
		b.className = "cmd-link";
		b.textContent = label;
		b.addEventListener("click", () => {
			input.value = "";
			updateGhost();
			run(name);
		});
		return b;
	};
	const row = (...nodes) => {
		const d = document.createElement("div");
		d.className = "line";
		d.append(...nodes);
		add(d);
	};
	const pre = (text) => {
		const d = document.createElement("pre");
		d.className = "line art";
		d.textContent = text;
		add(d);
	};

	// Ghost suggestion (fish-style): "help" when empty, else the first matching command
	const suggestion = (v) => {
		if (!v) return "ls";
		const m = COMMANDS.find((c) => c.startsWith(v.toLowerCase()) && c !== v.toLowerCase());
		return m ? m.slice(v.length) : "";
	};
	const updateGhost = () => {
		const v = input.value;
		ghostTyped.textContent = v;
		ghostRest.textContent = suggestion(v);
	};

	const lev = (a, b) => {
		const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
		for (let j = 1; j <= b.length; j++) d[0][j] = j;
		for (let i = 1; i <= a.length; i++)
			for (let j = 1; j <= b.length; j++)
				d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		return d[a.length][b.length];
	};

	const replayCard = () => {
		if (reduce) return;
		for (const a of term.getAnimations({ subtree: true })) {
			if (a.effect.getComputedTiming().iterations !== Infinity) {
				a.currentTime = 0;
				a.play();
			}
		}
	};

	const cow = (text) => {
		const t = text.slice(0, 40);
		const bar = "-".repeat(t.length + 2);
		return String.raw` ${"_".repeat(t.length + 2)}
< ${t} >
 ${bar}
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`;
	};

	const go = (path) => {
		row(document.createTextNode("opening "), linkEl(path, path));
		setTimeout(() => location.assign(path), reduce ? 0 : 250);
	};


	// sl: steam locomotive easter egg (right to left, as in the original)
	let running = null;
	const TRAIN = [
		String.raw`         ____                         `,
		String.raw`        _||_      _____________       `,
		String.raw`    ___/ || \____| [] [] [] [] |__    `,
		String.raw`   |  ______        ___________   |   `,
		String.raw`   |_|      |______|_|_|_|_|_|_|__|   `,
		String.raw`    (W)(W)(W)     (W)  (W)  (W)       `,
	];
	const SMOKE = [
		["          ( )   (@@)  ", "       (@)   ( )      "],
		["            (@)  ( )  ", "         ( )  (@@)    "],
	];
	function train() {
		if (running) return;
		if (reduce) return pre(TRAIN.join("\n").replaceAll("W", "o") + "\nchoo choo!");
		const wrap = document.createElement("div");
		wrap.className = "line sl";
		wrap.setAttribute("aria-hidden", "true");
		const body = document.createElement("pre");
		wrap.append(body);
		add(wrap);
		const frame = (n) => {
			const w = n % 2 ? "O" : "o";
			return [...SMOKE[0].slice(n % 2, (n % 2) + 1), ...SMOKE[1].slice(n % 2, (n % 2) + 1), ...TRAIN.map((l) => l.replaceAll("W", w))].join("\n");
		};
		body.textContent = frame(0);
		wrap.style.height = body.offsetHeight + "px";
		const width = body.scrollWidth;
		const start = performance.now();
		const DUR = 4200;
		let last = -1;
		running = true;
		const step = (now) => {
			const t = (now - start) / DUR;
			if (t >= 1 || !wrap.isConnected) {
				wrap.remove();
				running = null;
				if (out.childElementCount === 0) out.hidden = true;
				return;
			}
			const n = Math.floor((now - start) / 90);
			if (n !== last) {
				body.textContent = frame(n);
				last = n;
			}
			body.style.transform = `translateX(${(wrap.clientWidth + width) * (1 - t) - width}px)`;
			requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}

	const commands = {
		help() {
			line("commands:", "dim");
			for (const [name, desc] of HELP) row(cmdButton(name), document.createTextNode("  " + desc));
			line("→ or Tab completes · ↑ ↓ history · Ctrl+L clears · Esc leaves the prompt", "dim");
		},
		ls() {
			const d = document.createElement("div");
			d.className = "line";
			for (const name of Object.keys(PAGES)) {
				const b = cmdButton(`cd ${name}`, `${name}/`);
				b.classList.add("dir");
				d.append(b);
			}
			add(d);
		},
		cd(args) {
			const target = (args[0] ?? "~").replace(/\/+$/, "");
			if (target === "~" || target === ".." || target === "." || target === "") {
				return line("you are already home.", "dim");
			}
			if (Object.hasOwn(PAGES, target.toLowerCase())) return go(PAGES[target.toLowerCase()]);
			line(`cd: The directory '${target}' does not exist`);
		},
		contact() {
			const a = linkEl("linusc9516 [at] gmail [dot] com", `mailto:${addr}`);
			row(document.createTextNode("email  "), a);
			row(document.createTextNode("also   "), linkEl("LinkedIn", LINKS.linkedin, true), document.createTextNode(" · "), linkEl("X", "https://x.com/linusc9516", true));
			document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
		},
		github() {
			row(document.createTextNode("opening "), linkEl("github.com/linusc9516", LINKS.github, true));
			window.open(LINKS.github, "_blank", "noopener");
		},
		linkedin() {
			row(document.createTextNode("opening "), linkEl("linkedin.com/in/linusc9516", LINKS.linkedin, true));
			window.open(LINKS.linkedin, "_blank", "noopener");
		},
		clear() {
			out.replaceChildren();
			out.hidden = true;
		},
		// easter eggs
		song() {
			const el = document.getElementById("song");
			if (!el) return line("nothing on repeat right now.", "dim");
			const d = el.dataset;
			const card = document.createElement("div");
			card.className = "line song";
			const head = document.createElement("div");
			head.className = "song-head";
			const eq = document.createElement("span");
			eq.className = "eq";
			eq.setAttribute("aria-hidden", "true");
			eq.innerHTML = "<i></i><i></i><i></i><i></i><i></i>";
			head.append(document.createTextNode("☾ on repeat "), eq);
			const grid = document.createElement("dl");
			for (const [k, v] of [["title", d.title], ["artist", d.artist], ["album", d.album], ["note", d.note]]) {
				const dt = document.createElement("dt");
				dt.textContent = k;
				const dd = document.createElement("dd");
				dd.textContent = v;
				grid.append(dt, dd);
			}
			const dt = document.createElement("dt");
			dt.textContent = "listen";
			const dd = document.createElement("dd");
			dd.append(linkEl(d.url.replace(/^https:\/\//, ""), d.url, true));
			grid.append(dt, dd);
			card.append(head, grid);
			add(card);
		},
		"easter-eggs"() {
			line("hidden commands:", "dim");
			for (const [name, desc] of EGGS) row(cmdButton(name), document.createTextNode("  " + desc));
		},
		moo: () => pre(cow("moo")),
		cowsay: (args) => pre(cow(args.join(" ") || "moo")),
		sudo: () => line("linusc9516 is not in the sudoers file. This incident will be reported."),
		whoami: () => line("linusc9516"),
		sl: () => train(),
		pfetch: replayCard,
		neofetch: replayCard,
		exit: () => line("there is no escape. try Esc."),
		":q": () => line("E37: No write since last change (add ! to override)"),
		":q!"() {
			line("-- left the prompt --", "dim");
			input.blur();
		},
		":wq"() {
			line("written. left the prompt.", "dim");
			input.blur();
		},
	};

	const history = [];
	let hi = -1;

	function run(raw) {
		const text = raw.trim();
		const echo = document.createElement("div");
		echo.className = "line echo";
		echo.innerHTML = '<span class="chev" aria-hidden="true">›</span> ';
		echo.append(document.createTextNode(text));
		add(echo);
		if (!text) return;
		if (history[history.length - 1] !== text) history.push(text);
		hi = history.length;
		const [name, ...args] = text.split(/\s+/);
		const fn = Object.hasOwn(commands, name.toLowerCase()) ? commands[name.toLowerCase()] : null;
		if (fn) return fn(args);
		line(`fish: Unknown command: ${name}`);
		const lower = name.toLowerCase();
		let best = Object.hasOwn(PAGES, lower) ? `cd ${lower}` : null;
		let score = best ? 0 : 3;
		for (const c of COMMANDS) {
			const w = c.split(" ")[0];
			const s2 = lev(lower, w);
			if (s2 < score) [best, score] = [c, s2];
		}
		if (best) row(document.createTextNode("did you mean: "), cmdButton(best), document.createTextNode("?"));
		else row(document.createTextNode("type "), cmdButton("help"), document.createTextNode(" to list commands."));
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const v = input.value;
		input.value = "";
		updateGhost();
		run(v);
	});

	input.addEventListener("input", updateGhost);
	input.addEventListener("focus", () => form.classList.add("focused"));
	input.addEventListener("blur", () => form.classList.remove("focused"));
	// Clicking anywhere on the card focuses the prompt, except links, buttons and text selections
	term.addEventListener("click", (e) => {
		if (e.target.closest("a, button, input")) return;
		if (getSelection()?.toString()) return;
		input.focus({ preventScroll: true });
	});

	input.addEventListener("keydown", (e) => {
		const atEnd = input.selectionStart === input.value.length;
		if (e.key === "Escape") {
			input.blur();
		} else if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			commands.clear();
		} else if (e.key === "ArrowRight" && atEnd) {
			const rest = suggestion(input.value);
			if (rest) {
				e.preventDefault();
				input.value += rest;
				updateGhost();
			}
		} else if (e.key === "Tab" && !e.shiftKey && input.value) {
			// Tab only completes a non-empty prefix; otherwise it moves focus on
			const rest = suggestion(input.value);
			if (rest) {
				e.preventDefault();
				input.value += rest;
				updateGhost();
			}
		} else if (e.key === "ArrowUp" && history.length) {
			e.preventDefault();
			hi = Math.max(0, hi - 1);
			input.value = history[hi];
			updateGhost();
		} else if (e.key === "ArrowDown" && history.length) {
			e.preventDefault();
			hi = Math.min(history.length, hi + 1);
			input.value = history[hi] ?? "";
			updateGhost();
		}
	});

	updateGhost();
})();
