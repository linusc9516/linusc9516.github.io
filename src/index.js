/* OVERALL */
/* ------------------------------------ */

nav_items = document.querySelectorAll(".nav-item");
nav_btns = document.querySelectorAll(".nav-btn");

for (i=0; i < nav_items.length; i++) {
    if (nav_btns[i].classList.contains("disabled")) {
        nav_items[i].style.setProperty("cursor", "not-allowed");
    }
}

/* BLOG */
/* ------------------------------------ */

let posts = [
    {
        title: "First post!! [09-02-22]",
        file: "./src/blog_entries/first_post.txt"
    },
    {
        title: "Restarting the project~ [15-05-24]",
        file: "./src/blog_entries/restarting.txt"
    },
    // Add more posts here
];

function createPost(post) {
    let postElement = document.createElement("div");
    postElement.id = post.title.toLowerCase().replace(/\s+/g, "-"); // Making a legible ID for each post
    postElement.classList.add("post");

    let titleElement = document.createElement("span");
    titleElement.classList.add("title");
    titleElement.textContent = "⠀" + post.title; // Adds spacing for the expand/collapse button

    let contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.style.display = "none"; // Hides the content on load
    contentElement.innerHTML = ""; // Clear the content

    // Load post content from file
    fetch(post.file)
        .then(response => response.text())
        .then(content => {
            contentElement.innerHTML = content; // Populates the div with text content written
        })
        .catch(error => {
            console.error(`Error loading post content from ${post.file}:`, error);
        });

    let collapseButton = document.createElement("span");
    let arrow = document.createElement("i");
    arrow.classList.add("fa-solid");
    arrow.classList.add("fa-caret-right");
    arrow.classList.add("fa-2x");
    collapseButton.classList.add("collapse-button");
    collapseButton.appendChild(arrow);

    collapseButton.addEventListener("click", function() {
        if (contentElement.style.display === "none") {
            arrow.classList.remove("fa-caret-right");
            arrow.classList.add("fa-caret-down");
        } else {
            arrow.classList.remove("fa-caret-down");
            arrow.classList.add("fa-caret-right");
        }
        contentElement.style.display = contentElement.style.display === "none" ? "block" : "none";
    });

    postElement.appendChild(collapseButton);
    postElement.appendChild(titleElement);
    postElement.appendChild(contentElement);


    return postElement;
}

function loadPage() {
    let timelineElement = document.querySelector(".timeline");
    let blogElement = document.getElementById("blog");
    timelineElement.innerHTML = ""; // Clear the timeline

    for (let i = posts.length - 1; i >= 0; i--) {
        let postElement = createPost(posts[i]);
        blogElement.appendChild(postElement);

        let postTitle = document.createElement("a");
        postTitle.setAttribute("href", "#" + posts[i].title.toLowerCase().replace(/\s+/g, "-"));
        postTitle.classList.add("entry");
        postTitle.textContent = posts[i].title;

        postTitle.addEventListener("click", function () {
            let post = document.getElementById(posts[i].title.toLowerCase().replace(/\s+/g, "-"));
            if (post.getElementsByTagName("div")[0].style.display === "none") {
                post.getElementsByTagName("span")[0].click();
            }

            document.querySelector("#blog-nav").style.setProperty("width", "calc(100vw - 210px)");
            document.querySelector(".post").style.setProperty("width", "calc(100vw - 210px)");
        })
        timelineElement.appendChild(postTitle);
    }

    return timelineElement;
}

loadPage();
