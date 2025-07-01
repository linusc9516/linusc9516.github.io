// Initializes types

interface Post {
	title: string;
	file: string;
}

interface projectWidget {
	title: string;
	content: string;
	date: string;
	linkUrl: string;
	iconUrl?: string;
	imageUrl?: string;
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

// Updates navbar height whenever window is resized
window.addEventListener("resize", debounce(() => {
	if (window.innerWidth !== lastWidth) {
		lastWidth = window.innerWidth;
		location.reload();
	}
	updateNavbarHeight();
}, 250));


// Initialization when page loaded
document.addEventListener("DOMContentLoaded", () => {
	updateNavbarHeight();

	// Page-specific functionality
	const currentPage = window.location.pathname.split("/").pop()?.toLowerCase();
	switch (currentPage) {
		case "projects":
			initializeProjectsPage();
			break;
		case "blog":
			initializeBlogPage();
			break;
		case "music":
			initializeMusicPage();
			break;
	}
});


// Widget creating function (reused in both socials & music for playlists)
const createWidget = (options): void => {

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

	// A bit messy but follow btn positioning only works with nested div
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

	widget.appendChild(headerContainer);

	const contentElement = document.createElement("p");
	// Could've used contentElement.textContent to prevent everything being parsed as HTML, but needed link for the last.fm widget
	contentElement.innerHTML = options.content;
	contentElement.style.textDecoration = "none";
	widget.appendChild(contentElement);

	const date = document.createElement("p");
	date.innerHTML = options.date;
	widget.appendChild(date);

	if (options.imageUrl || options.embedHTML) {
		const embedContent = document.createElement("div");
		embedContent.className = "embed-content";

		if (options.imageUrl) {
			embedContent.innerHTML = `<img src="src/images/${options.imageUrl}" alt="${options.title}" onerror="this.src='src/images/fallback.webp';">`; // Too lazy to add fallback, maybe sometime in the future
		} else if (options.embedHTML) {
			embedContent.innerHTML = options.embedHTML; // Yeah somehow embedHTML implementation is similar to contentElement.. whatever.
		}

		widget.appendChild(embedContent);
	}

	widgetContainer?.appendChild(widget);
};

function initializeProjectsPage(): void {
	const projectWidgets: projectWidget[] = [
		{
			title: "Ulcerative Colitis Detection",
			content: "A machine learning model that predicts the likelihood of a patient having Ulcerative Colitis based on their colonoscopy images. Developed as part of a health exhibition project.",
			date: "01-07-2025",
			linkUrl: "https://github.com/example/classifier",
			iconUrl: "python-icon.svg",
		},
		{
			title: "Soular",
			content: "An Android app that connects environmental protection NGOs with teenage volunteers, which promotes environmental awareness. Received 1st Runner Up and Innovation Award in the JA Code for Impact competition, 2025.",
			date: "12-04-2025",
			linkUrl: "https://github.com/endernoke/soular",
			iconUrl: "android-icon.svg",
			imageUrl: "soular-banner.png",
		},
		{
			title: "CS50 Finance",
			content: "A Flask web application for managing stocks, built as part of the CS50 course. Allows users to buy and sell stocks, view their portfolio, and track stock prices in real-time.",
			date: "14-08-2024",
			linkUrl: "https://github.com/example/finance",
			iconUrl: "python-icon.svg",
		},
		{
			title: "Redcxca Website",
			content: "The source code for this website.",
			date: "19-07-2024",
			linkUrl: "https://github.com/example/template",
			iconUrl: "redcxca-icon.png",
			imageUrl: "redcxca-website.png",
		},
		{
			title: "This website",
			content: "The source code for this website.",
			date: "21-05-2023",
			linkUrl: "https://github.com/example/example.github.io",
			iconUrl: "github-pfp.webp",
		},

	]

	function createProjectWidgets(): void {
		projectWidgets.forEach((widget: projectWidget) => {
			let modifiedWidget: projectWidget = { ...widget };

			createWidget({
				...modifiedWidget,
				size: '2x2'
			});
		});
	}

	function handleResize(): void {
		createProjectWidgets();
	}

	createProjectWidgets();

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
			title: "Restarting the site.",
			content: "My decision to remake this website.",
			date: "15-05-24",
			blogUrl: "../../blog-entries/restarting",
		},
		{
			title: "First post.",
			content: "Where all it began.`",
			date: "09-02-22",
			blogUrl: "../../blog-entries/first-post",
		},
	]

	function createBlogWidgets(): void {
		blogWidgets.forEach((widget: blogWidget) => {
			let modifiedWidget: blogWidget = { ...widget };

			createWidget({
				...modifiedWidget,
				size: '2x2'
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
			title: 'Main Spotify Playlist',
			content: 'My favourite songs',
			linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=54674a5aa28b45c2',
			iconUrl: 'spotify-icon.svg',
			embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		},
		{
			title: 'Another Spotify Playlist',
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