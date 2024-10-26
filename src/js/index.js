var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Global variables
var lastWidth = window.innerWidth;
var navbar = document.querySelector(".navbar");
var backToTopBtn = document.querySelector(".backToTopBtn");
var widgetContainer = document.getElementById("widget-container");
var themeToggle = document.getElementById('theme-toggle');
var themeIcon = document.getElementById('theme-icon');
// Utility functions
function debounce(func, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(void 0, args); }, wait);
    };
}
function updateNavbarHeight() {
    if (navbar) {
        var height = navbar.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", "".concat(height, "px"));
    }
}
function toggleBackToTopButton() {
    if (!backToTopBtn)
        return; // Prevents errors on pages wtih no button
    // Toggles button display when over half page is scrolled
    backToTopBtn.style.display = window.scrollY > window.innerHeight * 0.5 ? "block" : "none";
}
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
    else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}
function getTheme() {
    var storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.add('fa-moon');
    }
    else {
        document.body.classList.remove('light-mode');
        themeIcon.classList.add('fa-sun');
    }
}
// Updates navbar height whenever window is resized
window.addEventListener("resize", debounce(function () {
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
document.addEventListener("DOMContentLoaded", function () {
    var _a;
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
    var currentPage = (_a = window.location.pathname.split("/").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
$(function () {
    var $backToTopBtn = $(".backToTopBtn");
    // If Btn exists and is clicked, init scroll
    if ($backToTopBtn.length) {
        $backToTopBtn.on("click", function (event) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, {
                duration: 200,
                easing: "swing"
            });
        });
    }
});
// Widget creating function (reused in both socials & music for playlists)
var createWidget = function (options) {
    // Entire widget body is a link
    var widget = document.createElement("a");
    widget.className = "widget size-".concat(options.size || "1x1");
    widget.href = options.linkUrl;
    widget.target = "_blank";
    widget.rel = "noopener noreferrer";
    widget.style.textDecoration = "none";
    // A bit messy but follwo btn positioning only works with nested div
    var headerContainer = document.createElement("div");
    headerContainer.className = "widget-header";
    var titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    if (options.iconUrl) {
        var iconElement = document.createElement("img");
        iconElement.src = "src/images/".concat(options.iconUrl);
        iconElement.alt = "Icon";
        iconElement.className = "widget-icon";
        titleContainer.appendChild(iconElement);
    }
    var titleElement = document.createElement("h2");
    titleElement.textContent = options.title;
    titleContainer.appendChild(titleElement);
    headerContainer.appendChild(titleContainer);
    if (options.followUrl) {
        var followButton = document.createElement("a");
        followButton.href = options.followUrl;
        followButton.className = "follow-button";
        if (options.followUrl.toLowerCase().includes("youtube.com")) {
            followButton.textContent = "Subscribe";
        }
        else if (options.followUrl.toLowerCase().includes("fantasy.premierleague.com")) {
            followButton.textContent = "Join";
        }
        else if (options.followUrl.toLowerCase().includes("twitter.com")) {
            followButton.textContent = "Follow";
        }
        followButton.target = "_blank";
        followButton.rel = "noopener noreferrer";
        headerContainer.appendChild(followButton);
    }
    widget.appendChild(headerContainer);
    var contentElement = document.createElement("p");
    // Could've used contentElement.textContent to prevent everything being parsed as HTML, but needed link for the last.fm widget
    contentElement.innerHTML = options.content;
    contentElement.style.textDecoration = "none";
    widget.appendChild(contentElement);
    if (options.imageUrl || options.embedHTML) {
        var embedContent = document.createElement("div");
        embedContent.className = "embed-content";
        if (options.imageUrl) {
            embedContent.innerHTML = "<img src=\"src/images/".concat(options.imageUrl, "\" alt=\"").concat(options.title, "\" onerror=\"this.src='src/images/fallback.webp';\">"); // Too lazy to add fallback, maybe sometime in the future
        }
        else if (options.embedHTML) {
            embedContent.innerHTML = options.embedHTML; // Yeah somehow embedHTML implementation is similar to contentElement.. whatever.
        }
        widget.appendChild(embedContent);
    }
    widgetContainer === null || widgetContainer === void 0 ? void 0 : widgetContainer.appendChild(widget); // Yay we finally made a widget dynamically, only took 70 lines
};
// Page-specific functions
function initializeAboutPage() {
    var aboutHeader = document.querySelector('.about-header');
    var aboutContent = document.querySelector('.about-content');
    var caret = document.querySelector('.mobile-caret');
    if (aboutHeader && aboutContent && caret) {
        aboutHeader.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                // Functionality to toggle expand/collapse the About Me section on mobile
                aboutContent.classList.toggle('collapsed');
                caret.classList.toggle('fa-caret-down');
                caret.classList.toggle('fa-caret-up');
            }
        });
    }
    var skills = {
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
    var skillsLists = {
        beginner: document.getElementById("beginner-skills"),
        intermediate: document.getElementById("intermediate-skills"),
        advanced: document.getElementById("advanced-skills"),
    };
    // Populate skills lists
    Object.entries(skills).forEach(function (_a) {
        var level = _a[0], skillSet = _a[1];
        var list = skillsLists[level];
        if (list) {
            skillSet.forEach(function (skill) {
                var li = document.createElement("li");
                li.textContent = skill;
                list.appendChild(li);
            });
        }
    });
    // Tab functionality
    var tabButtons = document.querySelectorAll(".tab-button");
    var skillsContainers = document.querySelectorAll(".skills-list");
    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var tab = button.dataset.tab;
            if (!tab)
                return;
            tabButtons.forEach(function (btn) { return btn.classList.remove("skills-active"); });
            skillsContainers.forEach(function (list) { return list.classList.remove("skills-active"); });
            button.classList.add("skills-active");
            var activeList = document.getElementById("".concat(tab, "-skills"));
            if (activeList) {
                activeList.classList.add("skills-active");
                animateSkills(activeList);
            }
        });
    });
    function animateSkills(skillsList) {
        var skillItems = skillsList.querySelectorAll("li");
        skillItems.forEach(function (item, index) {
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            setTimeout(function () {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }, index * 50);
        });
    }
}
function initializeSocialsPage() {
    // Create widgets
    [
        {
            title: "osu!",
            content: "Check out my osu! profile~",
            linkUrl: "https://osu.ppy.sh/users/0",
            iconUrl: "osu-icon.svg",
            imageUrl: "osu-header.webp",
        },
        {
            title: "Tournament History",
            content: "Both staffing and playing are included!<br> Displayed below is my most recent banner.",
            linkUrl: "https://docs.google.com/spreadsheets/d/00000000000000000000000000000000000000000000/edit?gid=2118512619#gid=2118512619",
            iconUrl: "sheets-icon.svg",
            imageUrl: "nct2-header.webp",
        },
        {
            title: "osekai",
            content: "Check my medal statistics on osekai!",
            linkUrl: "https://osekai.net/profiles/?user=0&page=Medals&mode=osu",
            iconUrl: "osekai-icon.svg",
            imageUrl: "osekai-header.svg",
        },
        {
            title: "Youtube",
            content: "Subscribe to my channel on Youtube!",
            linkUrl: "https://www.youtube.com/@example",
            iconUrl: "youtube-icon.svg",
            imageUrl: "youtube-header.webp",
            followUrl: "https://www.youtube.com/@example",
        },
        {
            title: "Twitter",
            content: "Follow my main account on Twitter ^^",
            linkUrl: "https://twitter.com/example",
            iconUrl: "twitter-icon.svg",
            imageUrl: "placeholder-header.webp",
            followUrl: "https://twitter.com/intent/user?screen_name=placeholder",
        },
        {
            title: "RushiaTwt",
            content: "Follow my Rushia Counting Twitter!",
            linkUrl: "https://twitter.com/RushiaMyBeloved",
            iconUrl: "twitter-icon.svg",
            imageUrl: "rushiamybeloved-header.webp",
            followUrl: "https://twitter.com/intent/user?screen_name=RushiaMyBeloved",
        },
        {
            title: "Discord server",
            content: "Join my server! :3",
            linkUrl: "https://discord.gg/000000",
            iconUrl: "discord-icon.svg",
            imageUrl: "server-header.webp",
        },
        {
            title: "Discord account",
            content: "Invite me as friend nya~",
            linkUrl: "https://discord.com/users/0",
            iconUrl: "discord-icon.svg",
            imageUrl: "discord-header.webp",
        },
        {
            title: "GitHub",
            content: "Check out my projects on GitHub~",
            linkUrl: "https://github.com/example",
            iconUrl: "github-icon.svg",
            imageUrl: "github-pfp.webp",
            size: "1x1",
        },
        {
            title: 'Spotify',
            content: 'Check out my account for playlists!',
            linkUrl: 'https://open.spotify.com/user/0000000000000000000000?si=0abff12c86554294',
            iconUrl: 'spotify-icon.svg',
            imageUrl: 'spotify-pfp.webp',
            size: '1x1'
        },
        {
            title: 'SoundCloud',
            content: 'Check out my SoundCloud!',
            linkUrl: 'https://soundcloud.com/example',
            iconUrl: 'soundcloud-icon.svg',
            imageUrl: 'soundcloud-pfp.webp',
            size: '1x1'
        },
        {
            title: "Last.fm",
            content: 'More stats available on the <a class="socials-link" href="./music">Music</a> Tab!',
            linkUrl: "https://last.fm/user/placeholder",
            iconUrl: "lastfm-icon.svg",
            imageUrl: "lastfm-pfp.webp",
            size: "1x1",
        },
        {
            title: "Steam",
            content: "Add me as friend on steam! (Highly inactive)",
            linkUrl: "https://steamcommunity.com/id/example/",
            iconUrl: "steam-icon.svg",
            imageUrl: "steam-pfp.webp",
            size: "1x1",
        },
        {
            title: "Twitch",
            content: "My twitch account (Rarely streams)",
            linkUrl: "https://twitch.tv/example/",
            iconUrl: "twitch-icon.svg",
            imageUrl: "twitch-pfp.webp",
            size: "1x1",
        },
        {
            title: "Fantasy PL",
            content: "My FPL miniLeague for 24/25 Season!",
            linkUrl: "https://fantasy.premierleague.com/leagues/142567/standings/c",
            imageUrl: "pl-icon.webp",
            followUrl: "https://fantasy.premierleague.com/leagues/auto-join/hzwugs",
            size: "1x1",
        },
        {
            title: "Football server",
            content: "Join my other discord server for football chats!",
            linkUrl: "https://discord.gg/gEkbpjKtrH",
            imageUrl: "discord-icon.svg",
            size: '1x1',
        },
        // More widgets TBA...
    ].forEach(createWidget);
}
function initializeBlogPage() {
    var posts = [
        { title: "First post!!", file: "first-post.html" },
        { title: "Restarting the project~", file: "restarting.html" },
        { title: "Dev diary", file: "dev-diary.html" },
        // More posts TBA...
    ];
    var createPost = function (post) {
        var postElement = document.createElement("div");
        postElement.id = post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, "");
        postElement.classList.add("post");
        var postTitleContainer = document.createElement("div");
        postTitleContainer.classList.add("postTitle");
        var collapseButton = document.createElement("span");
        var arrow = document.createElement("i");
        arrow.classList.add("fa-solid", "fa-caret-right", "fa-2x");
        collapseButton.classList.add("collapse-button");
        collapseButton.appendChild(arrow);
        var titleElement = document.createElement("span");
        titleElement.classList.add("title");
        titleElement.textContent = "\u2800" + post.title; // Unicode space character to enable spacing
        postTitleContainer.appendChild(collapseButton);
        postTitleContainer.appendChild(titleElement);
        var contentElement = document.createElement("div");
        contentElement.classList.add("content");
        contentElement.style.display = "none";
        // Toggle expand/collapse of posts
        postTitleContainer.addEventListener("click", function () {
            if (contentElement.style.display === "none") {
                arrow.classList.remove("fa-caret-right");
                arrow.classList.add("fa-caret-down");
                contentElement.style.display = "block";
            }
            else {
                arrow.classList.remove("fa-caret-down");
                arrow.classList.add("fa-caret-right");
                contentElement.style.display = "none";
            }
        });
        // Loads each post from the directory
        fetch("./src/blog-entries/".concat(post.file))
            .then(function (response) { return response.text(); })
            .then(function (content) {
            contentElement.innerHTML = content;
        })
            .catch(function (error) {
            console.error("Error loading post content from ".concat(post.file, ":"), error);
        });
        postElement.appendChild(postTitleContainer);
        postElement.appendChild(contentElement);
        return postElement;
    };
    var loadPage = function () {
        var _a;
        var timelineElement = document.querySelector(".timeline");
        var blogElement = document.getElementById("blog");
        if (!timelineElement || !blogElement)
            return;
        timelineElement.innerHTML = "";
        blogElement.innerHTML = "";
        // Newest post at the top
        posts.reverse().forEach(function (post) {
            var postElement = createPost(post);
            blogElement.appendChild(postElement);
            var postTitle = document.createElement("a");
            postTitle.href = "#".concat(post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, ""));
            postTitle.classList.add("entry");
            postTitle.textContent = post.title;
            postTitle.addEventListener("click", function (event) {
                var _a, _b;
                event.preventDefault(); // Prevent default anchor behavior
                var postId = post.title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, "");
                var $post = $("#".concat(postId));
                var $navbar = $(".navbar");
                if ($post.length && $navbar.length) {
                    // Expand the post content if it's collapsed
                    var $content = $post.find(".content");
                    if ($content.css("display") === "none") {
                        $post.find(".collapse-button").trigger("click");
                    }
                    // Calculate the scroll position
                    var navbarHeight = $navbar.outerHeight() || 0;
                    var scrollTo_1 = (_b = (_a = $post.offset()) === null || _a === void 0 ? void 0 : _a.top) !== null && _b !== void 0 ? _b : 0;
                    // Smooth scroll to the post
                    $("html, body").animate({
                        scrollTop: scrollTo_1 - navbarHeight
                    }, {
                        duration: 200,
                        easing: "swing"
                    });
                }
            });
            timelineElement.appendChild(postTitle);
        });
        // Expand the latest post by default
        if (posts.length > 0) {
            var latestPost = document.getElementById(posts[0].title.toLowerCase().replace(/[\s]+/g, "-").replace(/[\W]+/g, ""));
            (_a = latestPost === null || latestPost === void 0 ? void 0 : latestPost.querySelector(".collapse-button")) === null || _a === void 0 ? void 0 : _a.click();
        }
    };
    loadPage();
    // Timeline toggle functionality
    var toggleButton = document.querySelector(".timeline-toggle");
    var timeline = document.querySelector(".timeline");
    var blogContent = document.getElementById("blog");
    if (toggleButton && timeline && blogContent) {
        var isTimelineVisible_1 = window.innerWidth > 780; // For desktop timeline is initially visible
        var updateTimelineVisibility_1 = function () {
            if (window.innerWidth > 780) {
                timeline.style.right = "0";
                blogContent.style.marginRight = "200px";
                isTimelineVisible_1 = true;
            }
            else {
                timeline.style.right = isTimelineVisible_1 ? "0" : "-200px";
                blogContent.style.marginRight = isTimelineVisible_1 ? "200px" : "40px";
            }
        };
        // For mobile only
        toggleButton.addEventListener("click", function () {
            isTimelineVisible_1 = !isTimelineVisible_1;
            updateTimelineVisibility_1();
        });
        // Updates timeline ASAP
        window.addEventListener("resize", updateTimelineVisibility_1);
        updateTimelineVisibility_1();
    }
}
function initializeMusicPage() {
    var musicWidgets = [
        {
            title: 'Spotify Main Playlist',
            content: 'Bangers only!',
            linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=54674a5aa28b45c2',
            iconUrl: 'spotify-icon.svg',
            embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        {
            title: 'Spotify Emotional Playlist',
            content: 'Slow, relaxing songs to listen~',
            linkUrl: 'https://open.spotify.com/playlist/2Uf4ughAQi6HkvmVWi8dvp?si=149d58e91e3b4136',
            iconUrl: 'spotify-icon.svg',
            embedHTML: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2Uf4ughAQi6HkvmVWi8dvp?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        {
            title: 'YouTube Playlist',
            content: 'My playlist on YT!',
            linkUrl: 'https://youtube.com/playlist?list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw',
            iconUrl: 'youtube-icon.svg',
            embedHTML: '<iframe width="100%" height="700" src="https://www.youtube.com/embed/?listType=playlist&list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw&index=13" frameborder="0" allowfullscreen>',
        },
        {
            title: 'Soundcloud Remix Playlist',
            content: 'My favourite remixes!',
            linkUrl: 'https://on.soundcloud.com/nCveaVp69jXKdgcp9',
            iconUrl: 'soundcloud-icon.svg',
            embedHTML: '<iframe width="100%" height="700" scrolling="no" frameborder="no" allow="autoplay" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1821604341&color=%2354405a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/example" title="placeholder" target="_blank" style="color: #cccccc; text-decoration: none;"></a></div>',
        },
    ];
    function createMusicWidgets() {
        if (widgetContainer) {
            widgetContainer.innerHTML = ''; // Clear existing widgets
        }
        var isMobile = window.matchMedia("(max-width: 1024px)").matches;
        musicWidgets.forEach(function (widget) {
            var modifiedWidget = __assign({}, widget);
            if (modifiedWidget.embedHTML) {
                if (modifiedWidget.embedHTML.toLowerCase().includes('soundcloud') && isMobile) {
                    // Clear embedHTML for SoundCloud widgets
                    modifiedWidget.content = "My favourite remixes on SoundCloud!<br> SoundCloud playlist embed unfortunately is broken on mobile... but you can still click the link to see the full playlist!";
                    modifiedWidget.embedHTML = undefined;
                }
                else {
                    // Adjust height for non-SoundCloud embeds
                    modifiedWidget.embedHTML = modifiedWidget.embedHTML.replace(/height="(\d+)"/, "height=\"".concat(isMobile ? '352' : '700', "\""));
                }
            }
            createWidget(__assign(__assign({}, modifiedWidget), { size: isMobile ? '1x1' : '2x2' }));
        });
    }
    function handleResize() {
        createMusicWidgets();
    }
    createMusicWidgets();
    // Use debounce to improve performance
    var resizeTimeout = null;
    window.addEventListener('resize', function () {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(handleResize, 250);
    });
}
