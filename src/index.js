/* OVERALL */
/* ------------------------------------ */

let lastWidth = window.innerWidth;

function forceReload() {
    // Clear browser cache
    window.location.reload(true);
}

window.addEventListener('resize', function() {
    // Check if the width has changed
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;

        // Delay the reload to avoid constant reloading during resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(forceReload, 250);
    }
});

// Generates properties for nav_items
nav_items = document.querySelectorAll(".nav-item");
nav_btns = document.querySelectorAll(".nav-btn");

for (i = 0; i < nav_items.length; i++) {
	if (nav_btns[i].classList.contains("disabled")) {
		nav_items[i].style.setProperty("cursor", "not-allowed");
	}
}

function updateNavbarHeight() {
	const navbar = document.querySelector('.navbar');
	if (navbar) {
    const height = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', height + 'px');
	}
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNavbarHeight);

// Run on window resize
window.addEventListener('resize', updateNavbarHeight);

// Back to top button functionality
document.addEventListener("DOMContentLoaded", function () {
	var backToTopBtn = document.querySelector(".backToTopBtn");
	var firstFullscreenDiv = document.querySelector(".fullscreen-section");
	var firstRowWidgets = document.querySelector(".widget");

	console.log(firstRowWidgets);

	// Function to check scroll position and toggle button visibility
	function toggleBackToTopButton() {
        var scrollThreshold = 0;

        if (firstFullscreenDiv) {
            scrollThreshold = firstFullscreenDiv.offsetHeight * 0.6;
        } else if (firstRowWidgets) {
            scrollThreshold = firstRowWidgets.offsetHeight * 1.2;
        }

        if (window.scrollY > scrollThreshold) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    }

	// Add scroll event listener
	window.addEventListener("scroll", toggleBackToTopButton);
});

// jQuery function to scroll back to top (accessible globally for onclick attribute)
$(function () {
	// Smooth scroll to top
	$(".backToTopBtn").click(function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
});

/* ------------------------------------ */
/* ABOUT */
/* ------------------------------------ */

// Ensures fullscreen display only works on about page
if (window.location.pathname.split("/").pop().toLowerCase() === "about") {
	// Scroll indicator functionality
	$(document).ready(function () {
		const $scrollIndicator = $("#scroll-indicator");
		const $sections = $(".fullscreen-section");
		let currentIndex = 0;

		function scrollToNextSection() {
			if (currentIndex < $sections.length - 1) {
				currentIndex++;
				$("html, body").animate(
					{
						scrollTop: $sections.eq(currentIndex).offset().top,
					},
					"slow"
				);
			}
			updateScrollIndicator();
		}

		// Displays/hides scroll indicator
		function updateScrollIndicator() {
			// Check if at the bottom of the page
			let scrollPosition = $(window).scrollTop() + $(window).height();
			let pageHeight = $(document).height();

			if (scrollPosition >= pageHeight - 150) {
				// 50px threshold for slight inaccuracies
				$scrollIndicator.children().first().addClass("hide");
			} else if (currentIndex >= $sections.length - 1) {
				$scrollIndicator.children().first().addClass("hide");
			} else {
				$scrollIndicator.children().first().removeClass("hide");
			}
		}

		// onClick listener
		$scrollIndicator.click(function () {
			scrollToNextSection();
			return false;
		});

		$(window).scroll(function () {
			const scrollPosition = $(window).scrollTop() + $(window).height();
			$sections.each(function (index) {
				if (
					scrollPosition >=
					$(this).offset().top + $(this).outerHeight()
				) {
					currentIndex = index;
				}
			});
			updateScrollIndicator();
		});

		// Initial check
		updateScrollIndicator();

		// Also update on window resize
		$(window).resize(updateScrollIndicator);
	});
}

/* ------------------------------------ */
/* CONNECTIONS */
/* ------------------------------------ */

const widgetContainer = document.getElementById('widget-container');

function createWidget({
    title,
    content,
    linkUrl,
	iconUrl = null,
    imageUrl = null,
	embedHTML = null,
    followUrl = null,
    size = '1x1'
}) {

	// Entire widget is a link
    const widget = document.createElement('a');
    widget.className = `widget size-${size}`;
    widget.href = linkUrl;
    widget.target = '_blank';
    widget.rel = 'noopener noreferrer';
	widget.style.textDecoration = 'none';

	// Header of widget (title + follow btn if have)
	const headerContainer = document.createElement('div');
    headerContainer.className = 'widget-header';

	// Inline container for icon + title
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    if (iconUrl) {
        const iconElement = document.createElement('img');
        iconElement.src = iconUrl;
        iconElement.alt = 'Icon';
        iconElement.className = 'widget-icon';
        titleContainer.appendChild(iconElement);
    }

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleContainer.appendChild(titleElement);

    headerContainer.appendChild(titleContainer);

    if (followUrl) {
        const followButton = document.createElement('a');
        followButton.href = followUrl;
        followButton.className = 'follow-button';
        followButton.textContent = 'Follow';
        followButton.target = '_blank';
        followButton.rel = 'noopener noreferrer';
        headerContainer.appendChild(followButton);
    }

    widget.appendChild(headerContainer);

	// Main content of widget
    const contentElement = document.createElement('p');
    contentElement.textContent = content;
	contentElement.style.textDecoration = 'none';
    widget.appendChild(contentElement);

	// Adds the image/embed to the widget
    if (imageUrl || embedHTML) {
        const embedContent = document.createElement('div');
        embedContent.className = 'embed-content';

        const handleImageError = (img) => {
            img.onerror = null;
            img.src = 'path/to/fallback-image.jpg';
        };

        if (imageUrl) {
            embedContent.innerHTML = `<img src="${imageUrl}" alt="Embedded Image">`;
        } else if (embedHTML) {
			embedContent.innerHTML = embedHTML;
		} else {
            embedContent.innerHTML = `<img src="path/to/generic-embed-icon.png" alt="Embedded Content">`;
        }

        embedContent.querySelectorAll('img').forEach(img => {
            img.onerror = () => handleImageError(img);
        });

        widget.appendChild(embedContent);
    }

    widgetContainer.appendChild(widget);
}

// Creating widgets
function createWidgets() {
    createWidget({
        title: 'osu!',
        content: 'Check out my osu! profile',
        linkUrl: 'https://osu.ppy.sh/users/0',
        iconUrl: 'src/images/osu-icon.svg',
		imageUrl: 'src/images/osu-header.png'
    });

    createWidget({
        title: 'Twitter',
        content: 'Follow my main account on Twitter',
        linkUrl: 'https://twitter.com/example',
        iconUrl: 'src/images/twitter-icon.png',
		imageUrl: 'src/images/placeholder-header.png',
        followUrl: 'https://twitter.com/intent/user?screen_name=placeholder',
    });

    createWidget({
        title: 'Twitter (Sub)',
        content: 'Follow my sub account on Twitter',
        linkUrl: 'https://twitter.com/example',
        iconUrl: 'src/images/twitter-icon.png',
		imageUrl: 'src/images/placeholder-header.png',
        followUrl: 'https://twitter.com/intent/user?screen_name=placeholder'
    });

	createWidget({
        title: 'RushiaTwt',
        content: 'Follow my Rushia Counting Twitter',
        linkUrl: 'https://twitter.com/example',
		iconUrl: 'src/images/twitter-icon.png',
		imageUrl: 'src/images/rushiamybeloved-header.png',
        followUrl: 'https://twitter.com/intent/user?screen_name=placeholder'
    });

	createWidget({
        title: 'Discord server',
        content: 'Join my server! :3',
        linkUrl: 'https://discord.gg/000000',
		iconUrl: 'src/images/discord-icon.svg',
		imageUrl: 'src/images/server-header.png'
    });

	createWidget({
        title: 'Discord account',
        content: 'Invite me as friend nya~',
        linkUrl: 'https://discord.com/users/0',
		iconUrl: 'src/images/discord-icon.svg',
		imageUrl: 'src/images/discord-header.gif'
    });

	createWidget({
        title: 'Youtube',
        content: 'Follow me on Youtube!',
        linkUrl: 'https://www.youtube.com/@example',
		iconUrl: 'src/images/youtube-icon.svg',
		imageUrl: 'src/images/youtube-header.png'
    });

	createWidget({
        title: 'Tournament History',
        content: 'Both staffing and playing are included!',
        linkUrl: 'https://docs.google.com/spreadsheets/d/00000000000000000000000000000000000000000000/edit?gid=2118512619#gid=2118512619',
        iconUrl: 'src/images/sheets-icon.svg',
		imageUrl: 'src/images/nct2-header.png',
    });

	createWidget({
        title: 'Spotify playlist',
        content: 'Check out my playlist',
        linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=72d45dff5e294103',
        iconUrl: 'src/images/spotify-icon.svg',
		embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
		size: '1x1'
    });

	createWidget({
        title: 'GitHub',
        content: 'Check out my projects on GitHub',
        linkUrl: 'https://github.com/example',
        iconUrl: 'src/images/github-icon.svg',
		imageUrl: 'src/images/github-pfp.png',
		size: '1x2'
    });
}

// Ensures it only runs on the connections page
if (window.location.pathname.split("/").pop().toLowerCase() === "connections") {
	createWidgets();
}

/* ------------------------------------ */
/* BLOG */
/* ------------------------------------ */

document.addEventListener("DOMContentLoaded", function () {
    let posts = [
        {
            title: "First post!!",
            file: "./src/blog-entries/first-post.txt",
        },
        {
            title: "Restarting the project~",
            file: "./src/blog-entries/restarting.txt",
        },
        // Add more posts here
    ];

	// Dynamically formatting the post from a txt file
    function createPost(post) {
        let postElement = document.createElement("div");
        postElement.id = post.title.toLowerCase().replace(/\s+/g, "-");
        postElement.classList.add("post");

        let titleElement = document.createElement("span");
        titleElement.classList.add("title");
        titleElement.textContent = "⠀" + post.title;

        let contentElement = document.createElement("div");
        contentElement.classList.add("content");
        contentElement.style.display = "none";

        fetch(post.file)
            .then((response) => response.text())
            .then((content) => {
                contentElement.innerHTML = content;
            })
            .catch((error) => {
                console.error(`Error loading post content from ${post.file}:`, error);
            });

        let collapseButton = document.createElement("span");
        let arrow = document.createElement("i");
        arrow.classList.add("fa-solid", "fa-caret-right", "fa-2x");
        collapseButton.classList.add("collapse-button");
        collapseButton.appendChild(arrow);

        collapseButton.addEventListener("click", function () {
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

        postElement.appendChild(collapseButton);
        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);

        return postElement;
    }

	// Populates page
    function loadPage() {
		let timelineElement = document.querySelector(".timeline");
		let blogElement = document.getElementById("blog");
		timelineElement.innerHTML = ""; // Clear the timeline
		blogElement.innerHTML = ""; // Clear the blog content

		for (let i = posts.length - 1; i >= 0; i--) {
			let postElement = createPost(posts[i]);
			blogElement.appendChild(postElement);

			let postTitle = document.createElement("a");
			postTitle.setAttribute(
				"href",
				"#" + posts[i].title.toLowerCase().replace(/\s+/g, "-")
			);
			postTitle.classList.add("entry");
			postTitle.textContent = posts[i].title;

			postTitle.addEventListener("click", function (event) {
				event.preventDefault(); // Prevent default anchor behavior

				let post = document.getElementById(
					posts[i].title.toLowerCase().replace(/\s+/g, "-")
				);
				if (post.getElementsByTagName("div")[0].style.display === "none") {
					post.getElementsByTagName("span")[0].click();
				}

				// Use jQuery for smooth scrolling
				$('html, body').animate({
					scrollTop: $(post).offset().top - $(".navbar").outerHeight()
				}, 'slow');
			});

			timelineElement.appendChild(postTitle);
		}

		// Expand the latest post by default
		if (posts.length > 0) {
			let latestPost = document.getElementById(posts[posts.length - 1].title.toLowerCase().replace(/\s+/g, "-"));
			if (latestPost) {
				latestPost.getElementsByTagName("span")[0].click();
			}
		}
	}

    if (window.location.pathname.split("/").pop().toLowerCase() === "blog") {
        loadPage();
    }

	postTitle.addEventListener("click", function (event) {
		event.preventDefault();
		let post = document.getElementById(posts[i].title.toLowerCase().replace(/\s+/g, "-"));
		if (post.getElementsByTagName("div")[0].style.display === "none") {
			post.getElementsByTagName("span")[0].click();
		}
		window.scrollTo({
			top: post.offsetTop - document.querySelector('.navbar').offsetHeight,
			behavior: 'smooth'
		});
	});
});


document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.timeline-toggle');
    const timeline = document.querySelector('.timeline');
    const blogContent = document.getElementById('blog');
    let isTimelineVisible = window.innerWidth > 780;

    function updateTimelineVisibility() {
        if (window.innerWidth > 780) {
            timeline.style.right = '0';
            blogContent.style.marginRight = '200px';
            isTimelineVisible = true;
        } else {
            timeline.style.right = isTimelineVisible ? '0' : '-200px';
            blogContent.style.marginRight = isTimelineVisible ? '200px' : '40px';
        }
    }

    toggleButton.addEventListener('click', function () {
        isTimelineVisible = !isTimelineVisible;
        timeline.style.right = isTimelineVisible ? '0' : '-200px';
        toggleButton.innerHTML = isTimelineVisible ?
            '<i class="fa-solid fa-caret-right fa-2x"></i>' :
            '<i class="fa-solid fa-caret-left fa-2x"></i>';
        blogContent.style.marginRight = isTimelineVisible ? '200px' : '40px';
    });

    window.addEventListener('resize', updateTimelineVisibility);
    updateTimelineVisibility();
});