/* BLOG */
/* ------------------------------------ */

let posts = [
    {
        title: "Post 1",
        file: "./src/blog_entries/test.txt"
    },
    {
        title: "Post 2",
        file: "./src/blog_entries/test.txt"
    },
    {
        title: "Post 3",
        file: "./src/blog_entries/test.txt"
    },
    {
        title: "Post 4",
        file: "./src/blog_entries/test.txt"
    },
    {
        title: "Post 5",
        file: "./src/blog_entries/test.txt"
    },
    {
        title: "Post 6",
        file: "./src/blog_entries/test.txt"
    }
    // Add more posts here
];

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

    // Load post content from file
    fetch(post.file)
        .then(response => response.text())
        .then(content => {
            contentElement.textContent = content;
        })
        .catch(error => {
            console.error(`Error loading post content from ${post.file}:`, error);
        });

    let collapseButton = document.createElement("span");
    let arrow = document.createElement("i");
    arrow.classList.add("fa-solid");
    arrow.classList.add("fa-caret-right");
    arrow.classList.add("fa-lg");
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
            let post = document.getElementById("post-" + (i + 1).toString())
            if (post.getElementsByTagName("div")[0].style.display === "none") {
                post.getElementsByTagName("span")[0].click();
            }
        })
        timelineElement.appendChild(postTitle);
    }

    return timelineElement;
}

loadPage();
