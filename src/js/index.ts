// Initializes types
interface Skill {
	[key: string]: string[];
}

interface socialsWidget {
	title: string;
	content: string;
	date?: string;
	linkUrl?: string;
	blogUrl?: string;
	iconUrl?: string;
	imageUrl?: string;
	embedHTML?: string;
	followUrl?: string;
	size?: string;
}

interface Post {
	title: string;
	file: string;
}

interface blogWidget {
	title: string;
	content: string;
	date: string;
	blogUrl: string;
	imageUrl?: string;
}

interface musicWidget {
	title: string;
	content: string;
	linkUrl: string;
	iconUrl: string;
	embedHTML?: string;
	size?: string;
}

// Global variables
let lastWidth: number = window.innerWidth;
const navbar: HTMLElement | null = document.querySelector(".navbar");
const backToTopBtn: HTMLElement | null = document.querySelector(".backToTopBtn");
const widgetContainer: HTMLElement | null = document.getElementById("widget-container");
const themeToggle = document.getElementById('theme-toggle') as HTMLElement;
const themeIcon = document.getElementById('theme-icon') as HTMLElement;


// Utility functions

function debounce(func: Function, wait: number): (...args: any[]) => void {
	let timeout: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

function updateNavbarHeight(): void {
	if (navbar) {
		const height = navbar.offsetHeight;
		document.documentElement.style.setProperty("--navbar-height", `${height}px`);
	}
}

function toggleBackToTopButton(): void {
	if (!backToTopBtn) return; // Prevents errors on pages wtih no button
	// Toggles button display when over half page is scrolled
	backToTopBtn.style.display = window.scrollY > window.innerHeight * 0.5 ? "block" : "none";
}

function toggleTheme() {
	document.body.classList.toggle('light-mode');
	if (document.body.classList.contains('light-mode')) {
		themeIcon.classList.remove('fa-sun');
		themeIcon.classList.add('fa-moon');
		navbar?.classList.remove('navbar-dark');
		navbar?.classList.add('navbar-light');
		localStorage.setItem('theme', 'light');
	} else {
		themeIcon.classList.remove('fa-moon');
		themeIcon.classList.add('fa-sun');
		navbar?.classList.remove('navbar-light');
		navbar?.classList.add('navbar-dark');
		localStorage.setItem('theme', 'dark');
	}
}

function getTheme() {
	const storedTheme = localStorage.getItem('theme');
	if (storedTheme === 'light') {
		document.body.classList.add('light-mode');
		navbar?.classList.add('navbar-light')
		themeIcon.classList.add('fa-moon');
	} else {
		document.body.classList.remove('light-mode');
		navbar?.classList.add('navbar-dark')
		themeIcon.classList.add('fa-sun');
	}
}

// Updates navbar height whenever window is resized
window.addEventListener("resize", debounce(() => {
	if (window.innerWidth !== lastWidth) {
		lastWidth = window.innerWidth;
		location.reload();
	}
	updateNavbarHeight();
	getTheme();
}, 250));

window.addEventListener("scroll", toggleBackToTopButton);

themeToggle.addEventListener('click', toggleTheme);

// Initialization when page loaded
document.addEventListener("DOMContentLoaded", () => {
	updateNavbarHeight();
	toggleBackToTopButton();
	getTheme();

	// // Navigation items
	// const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
	// const navBtns = document.querySelectorAll<HTMLElement>(".nav-btn");

	// // Adds cursor style to disabled nav links
	// navItems.forEach((item, index) => {
	// 	if (navBtns[index].classList.contains("disabled")) {
	// 		item.style.cursor = "not-allowed";
	// 	}
	// });

	// Page-specific functionality
	const currentPage = window.location.pathname.split("/").pop()?.toLowerCase();
	switch (currentPage) {
		case "about":
			initializeAboutPage();
			break;
		case "socials":
			initializeSocialsPage();
			break;
		case "blog":
			initializeBlogPage();
			break;
		case "music":
			initializeMusicPage();
			break;
	}
});

// jQuery function for smooth scrolling to the top
$(() => {
	const $backToTopBtn: JQuery<HTMLElement> = $(".backToTopBtn");

	// If Btn exists and is clicked, init scroll
	if ($backToTopBtn.length) {
		$backToTopBtn.on("click", (event: JQuery.ClickEvent) => {
			event.preventDefault();
			$("html, body").animate({ scrollTop: 0 }, {
				duration: 200,
				easing: "swing"
			});
		});
	}
});

// Widget creating function (reused in both socials & music for playlists)
const createWidget = (options: socialsWidget): void => {

	// Entire widget body is a link
	const widget = document.createElement("a");
	widget.className = `widget size-${options.size || "1x1"}`;
	if (options.linkUrl) {
		widget.href = options.linkUrl;
		widget.target = "_blank";
		widget.rel = "noopener noreferrer";
	}
	else if (options.blogUrl) {
		widget.href = options.blogUrl;
	}

	widget.style.textDecoration = "none";

	// A bit messy but follwo btn positioning only works with nested div
	const headerContainer = document.createElement("div");
	headerContainer.className = "widget-header";

	const titleContainer = document.createElement("div");
	titleContainer.className = "title-container";

	if (options.iconUrl) {
		const iconElement = document.createElement("img");
		iconElement.src = `src/images/${options.iconUrl}`;
		iconElement.alt = "Icon";
		iconElement.className = "widget-icon";
		titleContainer.appendChild(iconElement);
	}

	const titleElement = document.createElement("h2");
	titleElement.textContent = options.title;
	titleContainer.appendChild(titleElement);
	headerContainer.appendChild(titleContainer);

	if (options.followUrl) {
		const followButton = document.createElement("a");
		followButton.href = options.followUrl;
		followButton.className = "follow-button";
		if (options.followUrl.toLowerCase().includes("youtube.com")) {
			followButton.textContent = "Subscribe";
		} else if (options.followUrl.toLowerCase().includes("fantasy.premierleague.com")) {
			followButton.textContent = "Join";
		} else if (options.followUrl.toLowerCase().includes("twitter.com")) {
			followButton.textContent = "Follow";
		}
		followButton.target = "_blank";
		followButton.rel = "noopener noreferrer";
		headerContainer.appendChild(followButton);
	}

	widget.appendChild(headerContainer);

	const contentElement = document.createElement("p");
	// Could've used contentElement.textContent to prevent everything being parsed as HTML, but needed link for the last.fm widget
	contentElement.innerHTML = options.content;
	contentElement.style.textDecoration = "none";
	widget.appendChild(contentElement);

	if (options.imageUrl || options.embedHTML || options.date) {
		const embedContent = document.createElement("div");
		embedContent.className = "embed-content";

		if (options.imageUrl) {
			embedContent.innerHTML = `<img src="src/images/${options.imageUrl}" alt="${options.title}" onerror="this.src='src/images/fallback.webp';">`; // Too lazy to add fallback, maybe sometime in the future
		} else if (options.embedHTML) {
			embedContent.innerHTML = options.embedHTML; // Yeah somehow embedHTML implementation is similar to contentElement.. whatever.
		} else if (options.date) {
			const date = document.createElement("p");
			date.innerHTML = options.date;
			embedContent.appendChild(date);
		}

		widget.appendChild(embedContent);
	}

	widgetContainer?.appendChild(widget); // Yay we finally made a widget dynamically, only took 70 lines
};

// Page-specific functions
function initializeAboutPage(): void {
	const aboutHeader = document.querySelector<HTMLElement>('.about-header');
	const aboutContent = document.querySelector<HTMLElement>('.about-content');
	const caret = document.querySelector<HTMLElement>('.mobile-caret');

	if (aboutHeader && aboutContent && caret) {
		aboutHeader.addEventListener('click', () => {
			if (window.innerWidth <= 768) {
				// Functionality to toggle expand/collapse the About Me section on mobile
				aboutContent.classList.toggle('collapsed');
				caret.classList.toggle('fa-caret-down');
				caret.classList.toggle('fa-caret-up');
			}
		});
	}

	const skills: Skill = {
		beginner: [
			"TensorFlow",
			"Flask",
			"Julia (Learning)",
			"Basic responsive web design",
			"C++",
			"jQuery",
			"Git",
		],
		intermediate: [
			"Statistical models",
			"Pyplot/Matplotlib",
			"Seaborn",
			"HTML5",
			"SCSS + Bootstrap 5",
			"JavaScript/Typescript",
		],
		advanced: ["Python", "SQL (SQLite3)"],
	};

	const skillsLists: { [key: string]: HTMLElement | null } = {
		beginner: document.getElementById("beginner-skills"),
		intermediate: document.getElementById("intermediate-skills"),
		advanced: document.getElementById("advanced-skills"),
	};

	// Populate skills lists
	Object.entries(skills).forEach(([level, skillSet]) => {
		const list = skillsLists[level];
		if (list) {
			skillSet.forEach((skill) => {
				const li = document.createElement("li");
				li.textContent = skill;
				list.appendChild(li);
			});
		}
	});

	// Tab functionality
	const tabButtons = document.querySelectorAll<HTMLElement>(".tab-button");
	const skillsContainers = document.querySelectorAll<HTMLElement>(".skills-list");

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const tab = button.dataset.tab;
			if (!tab) return;

			tabButtons.forEach((btn) => btn.classList.remove("skills-active"));
			skillsContainers.forEach((list) => list.classList.remove("skills-active"));

			button.classList.add("skills-active");
			const activeList = document.getElementById(`${tab}-skills`);
			if (activeList) {
				activeList.classList.add("skills-active");
				animateSkills(activeList);
			}
		});
	});

	function animateSkills(skillsList: HTMLElement): void {
		const skillItems = skillsList.querySelectorAll<HTMLElement>("li");
		skillItems.forEach((item, index) => {
			item.style.opacity = "0";
			item.style.transform = "translateY(20px)";
			setTimeout(() => {
				item.style.opacity = "1";
				item.style.transform = "translateY(0)";
			}, index * 50);
		});
	}
}


function initializeSocialsPage(): void {
	// Create widgets
	const socialsWidgets: socialsWidget[] = [
		// {
		// 	title: "osu!",
		// 	content: "Check out my osu! profile~",
		// 	linkUrl: "https://osu.ppy.sh/users/0",
		// 	iconUrl: "osu-icon.svg",
		// 	imageUrl: "osu-header.webp",
		// },
		// {
		// 	title: "Tournament History",
		// 	content:
		// 		"Both staffing and playing are included!<br> Displayed below is my most recent banner.",
		// 	linkUrl:
		// 		"https://docs.google.com/spreadsheets/d/00000000000000000000000000000000000000000000/edit?gid=2118512619#gid=2118512619",
		// 	iconUrl: "sheets-icon.svg",
		// 	imageUrl: "nct2-header.webp",
		// },
		// {
		// 	title: "osekai",
		// 	content: "Check my medal statistics on osekai!",
		// 	linkUrl: "https://osekai.net/profiles/?user=0&page=Medals&mode=osu",
		// 	iconUrl: "osekai-icon.svg",
		// 	imageUrl: "osekai-header.svg",
		// },
		{
			title: "Twitter",
			content: "Follow me on twitter",
			linkUrl: "https://twitter.com/example",
			iconUrl: "twitter-icon.svg",
			imageUrl: "twitter-header.webp",
			followUrl: "https://twitter.com/intent/user?screen_name=placeholder",
		},
		{
			title: "Youtube",
			content: "Subscribe to my channel",
			linkUrl: "https://www.youtube.com/@example",
			iconUrl: "youtube-icon.svg",
			imageUrl: "youtube-header.webp",
			followUrl: "https://www.youtube.com/@example",
		},
		// {
		// 	title: "RushiaTwt",
		// 	content: "Follow my Rushia Counting Twitter!",
		// 	linkUrl: "https://twitter.com/RushiaMyBeloved",
		// 	iconUrl: "twitter-icon.svg",
		// 	imageUrl: "rushiamybeloved-header.webp",
		// 	followUrl: "https://twitter.com/intent/user?screen_name=RushiaMyBeloved",
		// },
		{
			title: "Discord server",
			content: "Join my server",
			linkUrl: "https://discord.gg/000000",
			iconUrl: "discord-icon.svg",
			imageUrl: "server-header.webp",
		},
		{
			title: "Discord account",
			content: "Add me as friend",
			linkUrl: "https://discord.com/users/0",
			iconUrl: "discord-icon.svg",
			imageUrl: "discord-header.webp",
		},
		{
			title: "GitHub",
			content: "Check out my projects",
			linkUrl: "https://github.com/example",
			iconUrl: "github-icon.svg",
			imageUrl: "github-pfp.webp",
		},
		{
			title: 'Spotify',
			content: 'Check out my account for playlists',
			linkUrl: 'https://open.spotify.com/user/0000000000000000000000?si=0abff12c86554294',
			iconUrl: 'spotify-icon.svg',
			imageUrl: 'spotify-pfp.webp',
		},
		// {
		// 	title: 'SoundCloud',
		// 	content: 'Check out my account for playlists',
		// 	linkUrl: 'https://soundcloud.com/example',
		// 	iconUrl: 'soundcloud-icon.svg',
		// 	imageUrl: 'soundcloud-pfp.webp',
		// },
		{
			title: "Last.fm",
			content:
				'More stats available on the <a class="socials-link" href="./music">Music</a> Tab.',
			linkUrl: "https://last.fm/user/placeholder",
			iconUrl: "lastfm-icon.svg",
			imageUrl: "lastfm-pfp.webp",
		},
		{
			title: "Steam",
			content: "Add me on steam",
			linkUrl: "https://steamcommunity.com/id/example/",
			iconUrl: "steam-icon.svg",
			imageUrl: "steam-pfp.webp",
		},
		// {
		// 	title: "Twitch",
		// 	content: "My twitch account (Rarely streams)",
		// 	linkUrl: "https://twitch.tv/example/",
		// 	iconUrl: "twitch-icon.svg",
		// 	imageUrl: "twitch-pfp.webp",
		// },
		// {
		// 	title: "Fantasy PL",
		// 	content: "My FPL miniLeague for 24/25 Season!",
		// 	linkUrl: "https://fantasy.premierleague.com/leagues/142567/standings/c",
		// 	imageUrl: "pl-icon.webp",
		// 	followUrl: "https://fantasy.premierleague.com/leagues/auto-join/hzwugs",
		// },
		// {
		// 	title: "Football server",
		// 	content: "Join my other discord server for football chats!",
		// 	linkUrl: "https://discord.gg/gEkbpjKtrH",
		// 	imageUrl: "discord-icon.svg",
		// },
		// More widgets TBA...
	]

	function createSocialsWidgets(): void {
		socialsWidgets.forEach((widget: socialsWidget) => {
			let modifiedWidget: socialsWidget = { ...widget };

			createWidget({
				...modifiedWidget,
				size: '1x1'
			});
		});
	}

	function handleResize(): void {
		createSocialsWidgets();
	}

	createSocialsWidgets();

	// Use debounce to improve performance
	let resizeTimeout: number | null = null;
	window.addEventListener('resize', () => {
		if (resizeTimeout) {
			window.clearTimeout(resizeTimeout);
		}
		resizeTimeout = window.setTimeout(handleResize, 250);
	});
}

function initializeBlogPage(): void {
	const blogWidgets: blogWidget[] = [
		// Posts are prepended in reverse chronological order
		{
			title: "Dev diary.",
			content: "Read through my struggles on developing the website.",
			date: "18-07-24",
			blogUrl: "../../blog-entries/dev-diary",
		},
		{
			title: "Restarting the project.",
			content: "My decision to remake this website.",
			date: "15-05-24",
			blogUrl: "../../blog-entries/restarting",
		},
		{
			title: "First post.",
			content: "Where all it began",
			date: "09-02-22",
			blogUrl: "../../blog-entries/first-post",
		},
	]

	function createBlogWidgets(): void {
		blogWidgets.forEach((widget: blogWidget) => {
			let modifiedWidget: blogWidget = { ...widget };

			createWidget({
				...modifiedWidget,
				size: '1x1'
			});
		});
	}

	function handleResize(): void {
		createBlogWidgets();
	}

	createBlogWidgets();

	// Use debounce to improve performance
	let resizeTimeout: number | null = null;
	window.addEventListener('resize', () => {
		if (resizeTimeout) {
			window.clearTimeout(resizeTimeout);
		}
		resizeTimeout = window.setTimeout(handleResize, 250);
	});
}

function initializeMusicPage(): void {
	const musicWidgets: musicWidget[] = [
		{
			title: 'Spotify Main Playlist',
			content: 'My favourite songs',
			linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=54674a5aa28b45c2',
			iconUrl: 'spotify-icon.svg',
			embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		},
		{
			title: 'Spotify Playlist ft. my gf',
			content: 'Relaxing songs',
			linkUrl: 'https://open.spotify.com/playlist/2Uf4ughAQi6HkvmVWi8dvp?si=149d58e91e3b4136',
			iconUrl: 'spotify-icon.svg',
			embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2Uf4ughAQi6HkvmVWi8dvp?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		},
		{
			title: 'YouTube Playlist',
			content: 'My playlist for covers/remixes that aren\'t on Spotify',
			linkUrl: 'https://youtube.com/playlist?list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw',
			iconUrl: 'youtube-icon.svg',
			embedHTML: '<iframe width="100%" height="700" src="https://www.youtube.com/embed/?listType=playlist&list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw&index=13" frameborder="0" allowfullscreen>',
		},
		{
			title: 'Soundcloud Remix Playlist',
			content: 'My favourite remixes',
			linkUrl: 'https://on.soundcloud.com/nCveaVp69jXKdgcp9',
			iconUrl: 'soundcloud-icon.svg',
			embedHTML: '<iframe width="100%" height="700" scrolling="no" frameborder="no" allow="autoplay" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1821604341&color=%2354405a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/example" title="placeholder" target="_blank" style="color: #cccccc; text-decoration: none;"></a></div>',
		},
	];

	function createMusicWidgets(): void {
		if (widgetContainer) {
			widgetContainer.innerHTML = ''; // Clear existing widgets

		}
		const isMobile = window.matchMedia("(max-width: 1024px)").matches;

		musicWidgets.forEach((widget: musicWidget) => {
			let modifiedWidget: musicWidget = { ...widget };

			if (modifiedWidget.embedHTML) {
				if (modifiedWidget.embedHTML.toLowerCase().includes('soundcloud') && isMobile) {
					// Clear embedHTML for SoundCloud widgets
					modifiedWidget.content = "My favourite remixes on SoundCloud!<br> SoundCloud playlist embed unfortunately is broken on mobile, but you can still click the link to see the full playlist!";
					modifiedWidget.embedHTML = undefined;
				} else {
					// Adjust height for non-SoundCloud embeds
					modifiedWidget.embedHTML = modifiedWidget.embedHTML.replace(
						/height="(\d+)"/,
						`height="${isMobile ? '352' : '700'}"`
					);
				}
			}

			createWidget({
				...modifiedWidget,
				size: isMobile ? '1x1' : '2x2'
			});
		});
	}

	function handleResize(): void {
		createMusicWidgets();
	}

	createMusicWidgets();

	// Use debounce to improve performance
	let resizeTimeout: number | null = null;
	window.addEventListener('resize', () => {
		if (resizeTimeout) {
			window.clearTimeout(resizeTimeout);
		}
		resizeTimeout = window.setTimeout(handleResize, 250);
	});
}