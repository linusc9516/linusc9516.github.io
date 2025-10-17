// Initializes types
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
var widgetContainer = document.getElementById("widget-container");
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
        document.documentElement.style.setProperty("--navbar-height", "".concat(height/16, "rem"));
    }
}
// Updates navbar height whenever window is resized
window.addEventListener("resize", debounce(function () {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        location.reload();
    }
    updateNavbarHeight();
}, 250));
// Initialization when page loaded
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    updateNavbarHeight();
    // Page-specific functionality
    var currentPage = (_a = window.location.pathname.split("/").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
var createWidget = function (options) {
    // Entire widget body is a link
    var widget = document.createElement("a");
    widget.className = "widget size-".concat(options.size || "1x1");
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
    widget.appendChild(headerContainer);
    var contentElement = document.createElement("p");
    // Could've used contentElement.textContent to prevent everything being parsed as HTML, but needed link for the last.fm widget
    contentElement.innerHTML = options.content;
    contentElement.style.textDecoration = "none";
    widget.appendChild(contentElement);
    if (options.date) {
        var date = document.createElement("h3");
        date.innerHTML = options.date;
        widget.appendChild(date);
    }
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
    widgetContainer === null || widgetContainer === void 0 ? void 0 : widgetContainer.appendChild(widget);
};
function initializeProjectsPage() {
    var projectWidgets = [
        {
            title: "Ulcerative Colitis Detection",
            content: "A machine learning model that predicts the likelihood of a patient having Ulcerative Colitis based on their colonoscopy images.<br>Developed as part of a health exhibition project.",
            date: "01-07-2025",
            linkUrl: "https://github.com/linusc9516/UC_Classifier",
            iconUrl: "python-icon.svg",
            imageUrl: "uc-classifier.png"
        },
        {
            title: "Soular",
            content: "An Android app that connects environmental protection NGOs with teenage volunteers, which promotes environmental awareness.<br>Received 1st Runner Up and Innovation Award in the JA Code for Impact competition, 2025.",
            date: "12-04-2025",
            linkUrl: "https://github.com/endernoke/soular",
            iconUrl: "android-icon.svg",
            imageUrl: "soular-banner.png"
        },
        {
            title: "RedcXca Website",
            content: "Website partially developed for RedcXca, an artist friend of mine.",
            date: "19-07-2024",
            linkUrl: "https://github.com/linusc9516/RedcXca-Website/tree/master",
            iconUrl: "redcxca-icon.png",
            imageUrl: "redcxca-website.png"
        },
        {
            title: "This website",
            content: "The source code for this website.",
            date: "21-05-2023",
            linkUrl: "https://github.com/linusc9516/linusc9516.github.io",
            iconUrl: "github-pfp.webp",
            imageUrl: "linusc9516-website.png"
        },
    ];
    function createProjectWidgets() {
        projectWidgets.forEach(function (widget) {
            var modifiedWidget = __assign({}, widget);
            createWidget(__assign(__assign({}, modifiedWidget), { size: '2x2' }));
        });
    }
    function handleResize() {
        createProjectWidgets();
    }
    createProjectWidgets();
    // Use debounce to improve performance
    var resizeTimeout = null;
    window.addEventListener('resize', function () {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(handleResize, 250);
    });
}
function initializeBlogPage() {
    var blogWidgets = [
        // Posts are prepended in reverse chronological order
        {
            title: "Dev diary.",
            content: "Read through my struggles on developing the website.",
            date: "18-07-24",
            blogUrl: "../../blog-entries/dev-diary"
        },
        {
            title: "Restarting the site.",
            content: "My decision to remake this website.",
            date: "15-05-24",
            blogUrl: "../../blog-entries/restarting"
        },
        {
            title: "First post.",
            content: "Where all it began.",
            date: "09-02-22",
            blogUrl: "../../blog-entries/first-post"
        },
    ];
    function createBlogWidgets() {
        blogWidgets.forEach(function (widget) {
            var modifiedWidget = __assign({}, widget);
            createWidget(__assign(__assign({}, modifiedWidget), { size: '2x2' }));
        });
    }
    function handleResize() {
        createBlogWidgets();
    }
    createBlogWidgets();
    // Use debounce to improve performance
    var resizeTimeout = null;
    window.addEventListener('resize', function () {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(handleResize, 250);
    });
}
function initializeMusicPage() {
    var musicWidgets = [
        {
            title: 'Main Spotify Playlist',
            content: 'My favourite songs',
            linkUrl: 'https://open.spotify.com/playlist/1mVNP66DkhroJRds67UTpK?si=54674a5aa28b45c2',
            iconUrl: 'spotify-icon.svg',
            embedHTML: '<iframe style="border-radius:0.75rem" src="https://open.spotify.com/embed/playlist/1mVNP66DkhroJRds67UTpK?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
        },
        {
            title: 'Another Spotify Playlist',
            content: 'Relaxing songs',
            linkUrl: 'https://open.spotify.com/playlist/2Uf4ughAQi6HkvmVWi8dvp?si=149d58e91e3b4136',
            iconUrl: 'spotify-icon.svg',
            embedHTML: '<iframe style="border-radius:0.75rem" src="https://open.spotify.com/embed/playlist/2Uf4ughAQi6HkvmVWi8dvp?utm_source=generator" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
        },
        {
            title: 'YouTube Playlist',
            content: 'My playlist for covers/remixes that aren\'t on Spotify',
            linkUrl: 'https://youtube.com/playlist?list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw',
            iconUrl: 'youtube-icon.svg',
            embedHTML: '<iframe width="100%" height="700" src="https://www.youtube.com/embed/?listType=playlist&list=PLKKggsa6p95NFOOrnmM50O6YGxIaaxGUw&index=13" frameborder="0" allowfullscreen>'
        },
        {
            title: 'Soundcloud Remix Playlist',
            content: 'My favourite remixes',
            linkUrl: 'https://on.soundcloud.com/nCveaVp69jXKdgcp9',
            iconUrl: 'soundcloud-icon.svg',
            embedHTML: '<iframe width="100%" height="700" scrolling="no" frameborder="no" allow="autoplay" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1821604341&color=%2354405a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 0.625rem; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/slmlaggi" title="slmlaggi" target="_blank" style="color: #cccccc; text-decoration: none;"></a></div>'
        },
    ];
    function createMusicWidgets() {
        if (widgetContainer) {
            widgetContainer.innerHTML = ''; // Clear existing widgets
        }
        var isMobile = window.matchMedia("(max-width: 64rem)").matches;
        musicWidgets.forEach(function (widget) {
            var modifiedWidget = __assign({}, widget);
            if (modifiedWidget.embedHTML) {
                if (modifiedWidget.embedHTML.toLowerCase().includes('soundcloud') && isMobile) {
                    // Clear embedHTML for SoundCloud widgets
                    modifiedWidget.content = "My favourite remixes on SoundCloud!<br> SoundCloud playlist embed unfortunately is broken on mobile, but you can still click the link to see the full playlist!";
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
        // createMusicWidgets();
    }
    // createMusicWidgets();
    // Use debounce to improve performance
    var resizeTimeout = null;
    window.addEventListener('resize', function () {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(handleResize, 250);
    });
}
