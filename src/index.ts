// Types
interface Skill {
	[key: string]: string[];
}
interface WidgetOptions {
	title: string;
	content: string;
	linkUrl: string;
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
interface MusicWidget {
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
	if (!backToTopBtn) return;

	const firstFullscreenDiv = document.querySelector(".fullscreen-section");
	const firstRowWidgets = document.querySelector(".widget");
	let scrollThreshold = 0;

	if (firstFullscreenDiv) {
		scrollThreshold = firstFullscreenDiv.clientHeight * 0.6;
	} else if (firstRowWidgets) {
		scrollThreshold = firstRowWidgets.clientHeight * 1.2;
	}

	backToTopBtn.style.display = window.scrollY > scrollThreshold ? "block" : "none";
}

// Event listeners
window.addEventListener("resize", debounce(() => {
	if (window.innerWidth !== lastWidth) {
		lastWidth = window.innerWidth;
		location.reload();
	}
	updateNavbarHeight();
}, 250));

window.addEventListener("scroll", toggleBackToTopButton);

document.addEventListener("DOMContentLoaded", () => {
	updateNavbarHeight();
	toggleBackToTopButton();

	// Navigation items
	const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
	const navBtns = document.querySelectorAll<HTMLElement>(".nav-btn");

	navItems.forEach((item, index) => {
		if (navBtns[index].classList.contains("disabled")) {
			item.style.cursor = "not-allowed";
		}
	});

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

$(() => {
	const $backToTopBtn: JQuery<HTMLElement> = $(".backToTopBtn");

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

const createWidget = (options: WidgetOptions): void => {
	const widget = document.createElement("a");
	widget.className = `widget size-${options.size || "1x1"}`;
	widget.href = options.linkUrl;
	widget.target = "_blank";
	widget.rel = "noopener noreferrer";
	widget.style.textDecoration = "none";

	const headerContainer = document.createElement("div");
	headerContainer.className = "widget-header";

	const titleContainer = document.createElement("div");
	titleContainer.className = "title-container";

	if (options.iconUrl) {
		const iconElement = document.createElement("img");
		iconElement.src = options.iconUrl;
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
		followButton.textContent = options.followUrl.toLowerCase().includes("youtube.com") ? "Subscribe" : "Follow";
		followButton.textContent = options.followUrl.toLowerCase().includes("fantasy.premierleague.com") ? "Join" : "Follow";
		followButton.target = "_blank";
		followButton.rel = "noopener noreferrer";
		headerContainer.appendChild(followButton);
	}

	widget.appendChild(headerContainer);

	const contentElement = document.createElement("p");
	contentElement.innerHTML = options.content;
	contentElement.style.textDecoration = "none";
	widget.appendChild(contentElement);

	if (options.imageUrl || options.embedHTML) {
		const embedContent = document.createElement("div");
		embedContent.className = "embed-content";

		if (options.imageUrl) {
			embedContent.innerHTML = `<img src="${options.imageUrl}" alt="${options.title}" onerror="this.src='path/to/fallback-image.jpg';">`;
		} else if (options.embedHTML) {
			embedContent.innerHTML = options.embedHTML;
		}

		widget.appendChild(embedContent);
	}

	widgetContainer?.appendChild(widget);
};

// Page-specific functions
function initializeAboutPage(): void {
	const aboutHeader = document.querySelector<HTMLElement>('.about-header');
	const aboutContent = document.querySelector<HTMLElement>('.about-content');
	const caret = document.querySelector<HTMLElement>('.mobile-caret');

	console.log(aboutHeader);
	console.log(aboutContent);
	console.log(caret);
	if (aboutHeader && aboutContent && caret) {
		console.log('loaded');
		aboutHeader.addEventListener('click', () => {
			console.log('registered click');
			if (window.innerWidth <= 768) {
				console.log('didnt toggle');
				aboutContent.classList.toggle('collapsed');
				caret.classList.toggle('fa-caret-down');
				caret.classList.toggle('fa-caret-up');
			}
		});
	}


	const skills: Skill = {
		beginner: [
			"TensorFlow",
			"Julia (Learning)",
			"C++",
			"Basic responsive web design",
			"jQuery",
			"Flask",
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
}

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

function initializeSocialsPage(): void {
	// Create widgets
	[
		{
			title: "osu!",
			content: "Check out my osu! profile~",
			linkUrl: "https://osu.ppy.sh/users/0",
			iconUrl: "src/images/osu-icon.svg",
			imageUrl: "src/images/osu-header.webp",
		},
		{
			title: "Tournament History",
			content:
				"Both staffing and playing are included!<br> Displayed below is my most recent banner.",
			linkUrl:
				"https://docs.google.com/spreadsheets/d/00000000000000000000000000000000000000000000/edit?gid=2118512619#gid=2118512619",
			iconUrl: "src/images/sheets-icon.svg",
			imageUrl: "src/images/nct2-header.webp",
		},
		{
			title: "osekai",
			content: "Check my medal statistics on osekai!",
			linkUrl: "https://osekai.net/profiles/?user=0&page=Medals&mode=osu",
			iconUrl: "src/images/osekai-icon.svg",
			imageUrl: "src/images/osekai-header.svg",
		},
		{
			title: "Youtube",
			content: "Subscribe to my channel on Youtube!",
			linkUrl: "https://www.youtube.com/@example",
			iconUrl: "src/images/youtube-icon.svg",
			imageUrl: "src/images/youtube-header.webp",
			followUrl: "https://www.youtube.com/@example",
		},
		{
			title: "Twitter",
			content: "Follow my main account on Twitter ^^",
			linkUrl: "https://twitter.com/example",
			iconUrl: "src/images/twitter-icon.svg",
			imageUrl: "src/images/placeholder-header.webp",
			followUrl: "https://twitter.com/intent/user?screen_name=placeholder",
		},
		{
			title: "RushiaTwt",
			content: "Follow my Rushia Counting Twitter!",
			linkUrl: "https://twitter.com/RushiaMyBeloved",
			iconUrl: "src/images/twitter-icon.svg",
			imageUrl: "src/images/rushiamybeloved-header.webp",
			followUrl: "https://twitter.com/intent/user?screen_name=RushiaMyBeloved",
		},
		{
			title: "Discord server",
			content: "Join my server! :3",
			linkUrl: "https://discord.gg/000000",
			iconUrl: "src/images/discord-icon.svg",
			imageUrl: "src/images/server-header.webp",
		},
		{
			title: "Discord account",
			content: "Invite me as friend nya~",
			linkUrl: "https://discord.com/users/0",
			iconUrl: "src/images/discord-icon.svg",
			imageUrl: "src/images/discord-header.webp",
		},
		{
			title: "GitHub",
			content: "Check out my projects on GitHub~",
			linkUrl: "https://github.com/example",
			iconUrl: "src/images/github-icon.svg",
			imageUrl: "src/images/github-pfp.webp",
			size: "1x1",
		},
		{
			title: 'Spotify',
			content: 'Check out my account for playlists!',
			linkUrl: 'https://open.spotify.com/user/0000000000000000000000?si=0abff12c86554294',
			iconUrl: 'src/images/spotify-icon.svg',
			imageUrl: 'src/images/spotify-pfp.webp',
			size: '1x1'
		},
		{
			title: 'SoundCloud',
			content: 'Check out my SoundCloud!',
			linkUrl: 'https://soundcloud.com/example',
			iconUrl: 'src/images/soundcloud-icon.svg',
			imageUrl: 'src/images/soundcloud-pfp.webp',
			size: '1x1'
		},
		{
			title: "Last.fm",
			content:
				'More stats available on the <a class="socials-link" href="./music">Music</a> Tab!',
			linkUrl: "https://last.fm/placeholder",
			iconUrl: "src/images/lastfm-icon.svg",
			imageUrl: "src/images/lastfm-pfp.webp",
			size: "1x1",
		},
		{
			title: "Steam",
			content: "Add me as friend on steam! (Highly inactive)",
			linkUrl: "https://steamcommunity.com/id/example/",
			iconUrl: "src/images/steam-icon.svg",
			imageUrl: "src/images/steam-pfp.webp",
			size: "1x1",
		},
		{
			title: "Twitch",
			content: "My twitch account (Rarely streams)",
			linkUrl: "https://twitch.tv/example/",
			iconUrl: "src/images/twitch-icon.svg",
			imageUrl: "src/images/twitch-pfp.webp",
			size: "1x1",
		},
		{
			title: "Fantasy PL",
			content: "My FPL miniLeague for 24/25 Season!",
			linkUrl: "https://fantasy.premierleague.com/leagues/142567/standings/c",
			iconUrl: "src/images/twitch-icon.svg	",
			imageUrl: "src/images/twitch-pfp.webp",
			size: "1x1",
		},
		{
			title: "Football server",
			content: "Join my other discord server for football chats!",
			linkUrl: "https://discord.gg/000000",
			iconUrl: "src/images/discord-icon.svg",
			imageUrl: "src/images/server-header.webp",
		},
	].forEach(createWidget);
}

function initializeBlogPage(): void {
	const posts: Post[] = [
		{ title: "First post!!", file: "./src/blog-entries/first-post.txt" },
		{ title: "Restarting the project~", file: "./src/blog-entries/restarting.txt" },
		// Add more posts here
	];

	const createPost = (post: Post): HTMLElement => {
		const postElement = document.createElement("div");
		postElement.id = post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, "");
		postElement.classList.add("post");

		const postTitleContainer = document.createElement("div");
		postTitleContainer.classList.add("postTitle");

		const collapseButton = document.createElement("span");
		const arrow = document.createElement("i");
		arrow.classList.add("fa-solid", "fa-caret-right", "fa-2x");
		collapseButton.classList.add("collapse-button");
		collapseButton.appendChild(arrow);

		const titleElement = document.createElement("span");
		titleElement.classList.add("title");
		titleElement.textContent = "\u2800" + post.title; // Unicode space character

		postTitleContainer.appendChild(collapseButton);
		postTitleContainer.appendChild(titleElement);

		const contentElement = document.createElement("div");
		contentElement.classList.add("content");
		contentElement.style.display = "none";

		postTitleContainer.addEventListener("click", () => {
			if (contentElement.style.display === "none") {
				arrow.classList.remove("fa-caret-right");
				arrow.classList.add("fa-caret-down");
				contentElement.style.display = "block";
			} else {
				arrow.classList.remove("fa-caret-down");
				arrow.classList.add("fa-caret-right");
				contentElement.style.display = "none";
			}
		});

		fetch(post.file)
			.then((response) => response.text())
			.then((content) => {
				contentElement.innerHTML = content;
			})
			.catch((error) => {
				console.error(`Error loading post content from ${post.file}:`, error);
			});

		postElement.appendChild(postTitleContainer);
		postElement.appendChild(contentElement);
		return postElement;
	};

	const loadPage = (): void => {
		const timelineElement = document.querySelector(".timeline");
		const blogElement = document.getElementById("blog");
		if (!timelineElement || !blogElement) return;

		timelineElement.innerHTML = "";
		blogElement.innerHTML = "";

		posts.reverse().forEach((post) => {
			const postElement = createPost(post);
			blogElement.appendChild(postElement);

			const postTitle = document.createElement("a");
			postTitle.href = `#${post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, "")}`;
			postTitle.classList.add("entry");
			postTitle.textContent = post.title;
			postTitle.addEventListener("click", function (event: Event) {
				event.preventDefault(); // Prevent default anchor behavior

				const postId = post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, "");
				const $post = $(`#${postId}`);
				const $navbar = $(".navbar");

				if ($post.length && $navbar.length) {
					// Expand the post content if it's collapsed
					const $content = $post.find(".content");
					if ($content.css("display") === "none") {
						$post.find(".collapse-button").trigger("click");
					}

					// Calculate the scroll position
					const navbarHeight = $navbar.outerHeight() || 0;
					const scrollTo = $post.offset()?.top ?? 0;

					// Smooth scroll to the post
					$("html, body").animate(
						{
							scrollTop: scrollTo - navbarHeight
						},
						{
							duration: 200,
							easing: "swing"
						}
					);
				}
			});
			timelineElement.appendChild(postTitle);
		});

		// Expand the latest post by default
		if (posts.length > 0) {
			const latestPost = document.getElementById(posts[0].title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, ""));
			latestPost?.querySelector<HTMLElement>(".collapse-button")?.click();
		}
	};

	loadPage();

	// Timeline toggle functionality
	const toggleButton = document.querySelector<HTMLElement>(".timeline-toggle");
	const timeline = document.querySelector<HTMLElement>(".timeline");
	const blogContent = document.getElementById("blog");

	if (toggleButton && timeline && blogContent) {
		let isTimelineVisible = window.innerWidth > 780;

		const updateTimelineVisibility = (): void => {
			if (window.innerWidth > 780) {
				timeline.style.right = "0";
				blogContent.style.marginRight = "200px";
				isTimelineVisible = true;
			} else {
				timeline.style.right = isTimelineVisible ? "0" : "-200px";
				blogContent.style.marginRight = isTimelineVisible ? "200px" : "40px";
			}
		};

		toggleButton.addEventListener("click", () => {
			isTimelineVisible = !isTimelineVisible;
			updateTimelineVisibility();
		});

		window.addEventListener("resize", updateTimelineVisibility);
		updateTimelineVisibility();
	}
}

function initializeMusicPage(): void {
	const musicWidgets: MusicWidget[] = [
		{
			title: 'Spotify Main Playlist',
			content: 'Bangers only!',
			linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=54674a5aa28b45c2',
			iconUrl: 'src/images/spotify-icon.svg',
			embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		},
		{
			title: 'Spotify Emotional Playlist',
			content: 'Slow, relaxing songs to listen~',
			linkUrl: 'https://open.spotify.com/playlist/2Uf4ughAQi6HkvmVWi8dvp?si=149d58e91e3b4136',
			iconUrl: 'src/images/spotify-icon.svg',
			embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2Uf4ughAQi6HkvmVWi8dvp?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		},
		{
			title: 'YouTube Playlist',
			content: 'My playlist on YT!',
			linkUrl: 'https://youtube.com/playlist?list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw',
			iconUrl: 'src/images/youtube-icon.svg',
			embedHTML: '<iframe width="100%" height="700" src="https://www.youtube.com/embed/?listType=playlist&list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw&index=10" frameborder="0" allowfullscreen>',
		},
		{
			title: 'Soundcloud Remix Playlist',
			content: 'My favourite remixes!',
			linkUrl: 'https://on.soundcloud.com/nCveaVp69jXKdgcp9',
			iconUrl: 'src/images/soundcloud-icon.svg',
			embedHTML: '<iframe width="100%" height="700" scrolling="no" frameborder="no" allow="autoplay" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1821604341&color=%2354405a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/example" title="placeholder" target="_blank" style="color: #cccccc; text-decoration: none;">placeholder</a> · <a href="https://soundcloud.com/example/sets/remix" title="Remix type shit" target="_blank" style="color: #cccccc; text-decoration: none;">Remix type shit</a></div>',
		},
	];

	function createMusicWidgets(): void {
		if (widgetContainer) {
			widgetContainer.innerHTML = ''; // Clear existing widgets

		}
		const isMobile = window.matchMedia("(max-width: 1024px)").matches;

		musicWidgets.forEach(widget => {
			createWidget({
				...widget,
				embedHTML: widget.embedHTML ?
					widget.embedHTML.replace(/height="(\d+)"/, `height="${isMobile ? '352' : '700'}"`) :
					undefined,
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

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
	const currentPage = window.location.pathname.split("/").pop()?.toLowerCase();

	if (currentPage === "music") {
		initializeMusicPage();
	}
});