/* =========================================================
   BLOGCMS — TASK 30
   Client-Side Blog CMS
   HTML5 + CSS3 + JavaScript + LocalStorage
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const STORAGE_KEY = "task30_blog_posts";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const newPostBtn = document.getElementById("newPostBtn");
const emptyCreateBtn = document.getElementById("emptyCreateBtn");

const editorModal = document.getElementById("editorModal");
const viewModal = document.getElementById("viewModal");
const deleteModal = document.getElementById("deleteModal");

const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const closeViewBtn = document.getElementById("closeViewBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const postForm = document.getElementById("postForm");

const postId = document.getElementById("postId");
const postTitle = document.getElementById("postTitle");
const postExcerpt = document.getElementById("postExcerpt");
const postContent = document.getElementById("postContent");
const postStatus = document.getElementById("postStatus");

const postsContainer =
    document.getElementById("postsContainer");

const emptyState =
    document.getElementById("emptyState");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const totalPosts =
    document.getElementById("totalPosts");

const publishedPosts =
    document.getElementById("publishedPosts");

const draftPosts =
    document.getElementById("draftPosts");

const modalTitle =
    document.getElementById("modalTitle");

const previewTitle =
    document.getElementById("previewTitle");

const previewExcerpt =
    document.getElementById("previewExcerpt");

const previewContent =
    document.getElementById("previewContent");


/* View modal */

const viewStatus =
    document.getElementById("viewStatus");

const viewDate =
    document.getElementById("viewDate");

const viewTitle =
    document.getElementById("viewTitle");

const viewExcerpt =
    document.getElementById("viewExcerpt");

const viewContent =
    document.getElementById("viewContent");

const viewId =
    document.getElementById("viewId");

const viewEditBtn =
    document.getElementById("viewEditBtn");


/* Toast */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let posts = [];

let postToDelete = null;

let postToView = null;


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadPosts();

    renderPosts();

    updateStats();

    updateEditorPreview();

});


/* =========================================================
   LOCAL STORAGE
   ========================================================= */


/*
    Load all posts from localStorage.
*/

function loadPosts() {

    try {

        const storedPosts =
            localStorage.getItem(STORAGE_KEY);

        if (!storedPosts) {

            posts = [];

            return;
        }


        const parsedPosts =
            JSON.parse(storedPosts);


        if (Array.isArray(parsedPosts)) {

            posts = parsedPosts;

        } else {

            posts = [];

        }

    } catch (error) {

        console.error(
            "Unable to load posts:",
            error
        );

        posts = [];

    }

}


/*
    Save current posts to localStorage.
*/

function savePosts() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(posts)
        );

    } catch (error) {

        console.error(
            "Unable to save posts:",
            error
        );

        showToast(
            "Unable to save data in this browser."
        );

    }

}


/* =========================================================
   CREATE UNIQUE ID
   ========================================================= */

function generatePostId() {

    const timestamp =
        Date.now().toString(36);

    const random =
        Math.random()
            .toString(36)
            .substring(2, 8);

    return `post-${timestamp}-${random}`;

}


/* =========================================================
   CREATE TIMESTAMP
   ========================================================= */

function getCurrentTimestamp() {

    return new Date().toISOString();

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "Unknown date";

    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {

        return "Unknown date";

    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================================
   FORMAT DATE + TIME
   ========================================================= */

function formatDateTime(dateString) {

    if (!dateString) {

        return "Unknown date";

    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {

        return "Unknown date";

    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   OPEN CREATE MODAL
   ========================================================= */

function openCreateModal() {

    postForm.reset();

    postId.value = "";

    postStatus.value = "draft";

    modalTitle.textContent =
        "Create New Post";

    updateEditorPreview();

    openModal(editorModal);

    setTimeout(() => {

        postTitle.focus();

    }, 100);

}


/* =========================================================
   OPEN EDIT MODAL
   ========================================================= */

function openEditModal(id) {

    const post =
        posts.find(item => item.id === id);


    if (!post) {

        showToast("Post not found.");

        return;
    }


    postId.value = post.id;

    postTitle.value = post.title;

    postExcerpt.value =
        post.excerpt || "";

    postContent.value =
        post.content;

    postStatus.value =
        post.status;


    modalTitle.textContent =
        "Edit Post";


    updateEditorPreview();

    openModal(editorModal);

    setTimeout(() => {

        postTitle.focus();

    }, 100);

}


/* =========================================================
   SAVE POST
   ========================================================= */

function savePost(event) {

    event.preventDefault();


    const title =
        postTitle.value.trim();

    const excerpt =
        postExcerpt.value.trim();

    const content =
        postContent.value.trim();

    const status =
        postStatus.value;


    /* Validation */

    if (!title) {

        showToast(
            "Please enter a post title."
        );

        postTitle.focus();

        return;
    }


    if (!content) {

        showToast(
            "Please enter post content."
        );

        postContent.focus();

        return;
    }


    /* EDIT EXISTING POST */

    if (postId.value) {

        const index =
            posts.findIndex(
                item => item.id === postId.value
            );


        if (index !== -1) {

            const existingPost =
                posts[index];


            posts[index] = {

                ...existingPost,

                title,

                excerpt,

                content,

                status,

                updatedAt:
                    getCurrentTimestamp()

            };


            savePosts();

            renderPosts();

            updateStats();

            closeModal(editorModal);

            showToast(
                "Post updated successfully."
            );

            return;
        }

    }


    /* CREATE NEW POST */

    const newPost = {

        id:
            generatePostId(),

        title,

        excerpt,

        content,

        status,

        createdAt:
            getCurrentTimestamp(),

        updatedAt:
            getCurrentTimestamp()

    };


    posts.unshift(newPost);

    savePosts();

    renderPosts();

    updateStats();

    closeModal(editorModal);

    showToast(
        "Post created successfully."
    );

}


/* =========================================================
   RENDER POSTS
   ========================================================= */

function renderPosts() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    let filteredPosts =
        [...posts];


    /* Status filter */

    if (selectedStatus !== "all") {

        filteredPosts =
            filteredPosts.filter(
                post =>
                    post.status === selectedStatus
            );

    }


    /* Search filter */

    if (searchTerm) {

        filteredPosts =
            filteredPosts.filter(post => {

                const title =
                    (post.title || "")
                        .toLowerCase();

                const excerpt =
                    (post.excerpt || "")
                        .toLowerCase();

                const content =
                    (post.content || "")
                        .toLowerCase();


                return (
                    title.includes(searchTerm) ||
                    excerpt.includes(searchTerm) ||
                    content.includes(searchTerm)
                );

            });

    }


    /* Clear old HTML */

    postsContainer.innerHTML = "";


    /* No matching posts */

    if (filteredPosts.length === 0) {

        postsContainer.style.display =
            "none";

        emptyState.style.display =
            "block";


        if (posts.length === 0) {

            emptyTitle.textContent =
                "No posts yet";

            emptyMessage.textContent =
                "Create your first blog post to get started.";

            emptyCreateBtn.style.display =
                "inline-flex";

        } else {

            emptyTitle.textContent =
                "No matching posts";

            emptyMessage.textContent =
                "Try another search or change the status filter.";

            emptyCreateBtn.style.display =
                "none";

        }


        return;

    }


    /* Show posts */

    postsContainer.style.display =
        "grid";

    emptyState.style.display =
        "none";


    filteredPosts.forEach(post => {

        const card =
            createPostCard(post);

        postsContainer.appendChild(card);

    });

}


/* =========================================================
   CREATE POST CARD
   ========================================================= */

function createPostCard(post) {

    const article =
        document.createElement("article");


    article.className =
        "post-card";


    const top =
        document.createElement("div");

    top.className =
        "post-top";


    const badge =
        document.createElement("span");

    badge.className =
        `status-badge ${post.status}`;

    badge.textContent =
        post.status === "published"
            ? "PUBLISHED"
            : "DRAFT";


    const date =
        document.createElement("span");

    date.className =
        "post-date";

    date.textContent =
        formatDate(post.updatedAt || post.createdAt);


    top.appendChild(badge);

    top.appendChild(date);


    /* Title */

    const title =
        document.createElement("h3");

    title.textContent =
        post.title;


    /* Excerpt */

    const excerpt =
        document.createElement("p");

    excerpt.className =
        "post-excerpt";

    excerpt.textContent =
        post.excerpt ||
        getContentPreview(post.content);


    /* Bottom */

    const bottom =
        document.createElement("div");

    bottom.className =
        "post-bottom";


    const id =
        document.createElement("span");

    id.className =
        "post-id";

    id.textContent =
        post.id;


    const actions =
        document.createElement("div");

    actions.className =
        "post-actions";


    /* View */

    const viewButton =
        document.createElement("button");

    viewButton.type =
        "button";

    viewButton.className =
        "icon-btn";

    viewButton.title =
        "View post";

    viewButton.setAttribute(
        "aria-label",
        "View post"
    );

    viewButton.textContent =
        "◉";

    viewButton.addEventListener(
        "click",
        () => openViewModal(post.id)
    );


    /* Edit */

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "icon-btn";

    editButton.title =
        "Edit post";

    editButton.setAttribute(
        "aria-label",
        "Edit post"
    );

    editButton.textContent =
        "✎";

    editButton.addEventListener(
        "click",
        () => openEditModal(post.id)
    );


    /* Delete */

    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "icon-btn delete";

    deleteButton.title =
        "Delete post";

    deleteButton.setAttribute(
        "aria-label",
        "Delete post"
    );

    deleteButton.textContent =
        "⌫";

    deleteButton.addEventListener(
        "click",
        () => openDeleteModal(post.id)
    );


    actions.appendChild(viewButton);

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    bottom.appendChild(id);

    bottom.appendChild(actions);


    article.appendChild(top);

    article.appendChild(title);

    article.appendChild(excerpt);

    article.appendChild(bottom);


    return article;

}


/* =========================================================
   CONTENT PREVIEW
   ========================================================= */

function getContentPreview(content) {

    if (!content) {

        return "No description available.";

    }


    const cleanText =
        content
            .replace(/\s+/g, " ")
            .trim();


    if (cleanText.length <= 150) {

        return cleanText;

    }


    return cleanText.substring(0, 150) + "...";

}


/* =========================================================
   VIEW POST
   ========================================================= */

function openViewModal(id) {

    const post =
        posts.find(item => item.id === id);


    if (!post) {

        showToast("Post not found.");

        return;
    }


    postToView = post.id;


    viewStatus.textContent =
        post.status === "published"
            ? "PUBLISHED"
            : "DRAFT";


    viewStatus.className =
        `status-badge ${post.status}`;


    viewDate.textContent =
        formatDateTime(
            post.updatedAt ||
            post.createdAt
        );


    viewTitle.textContent =
        post.title;


    viewExcerpt.textContent =
        post.excerpt || "";


    viewContent.textContent =
        post.content;


    viewId.textContent =
        `ID: ${post.id}`;


    openModal(viewModal);

}


/* =========================================================
   EDIT FROM VIEW MODAL
   ========================================================= */

function editViewedPost() {

    if (!postToView) {

        return;

    }


    const id =
        postToView;


    closeModal(viewModal);

    openEditModal(id);

}


/* =========================================================
   DELETE MODAL
   ========================================================= */

function openDeleteModal(id) {

    const post =
        posts.find(item => item.id === id);


    if (!post) {

        showToast("Post not found.");

        return;
    }


    postToDelete =
        post.id;


    openModal(deleteModal);

}


/* =========================================================
   CONFIRM DELETE
   ========================================================= */

function confirmDelete() {

    if (!postToDelete) {

        return;

    }


    const index =
        posts.findIndex(
            item => item.id === postToDelete
        );


    if (index === -1) {

        closeModal(deleteModal);

        postToDelete = null;

        return;
    }


    posts.splice(index, 1);


    savePosts();

    renderPosts();

    updateStats();


    closeModal(deleteModal);


    showToast(
        "Post deleted successfully."
    );


    postToDelete = null;

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStats() {

    const total =
        posts.length;


    const published =
        posts.filter(
            post =>
                post.status === "published"
        ).length;


    const drafts =
        posts.filter(
            post =>
                post.status === "draft"
        ).length;


    totalPosts.textContent =
        total;


    publishedPosts.textContent =
        published;


    draftPosts.textContent =
        drafts;

}


/* =========================================================
   LIVE EDITOR PREVIEW
   ========================================================= */

function updateEditorPreview() {

    const title =
        postTitle.value.trim();

    const excerpt =
        postExcerpt.value.trim();

    const content =
        postContent.value.trim();


    previewTitle.textContent =
        title ||
        "Your title will appear here";


    previewExcerpt.textContent =
        excerpt ||
        "Your description will appear here.";


    previewContent.textContent =
        content ||
        "Your content will appear here.";

}


/* =========================================================
   MODAL HELPERS
   ========================================================= */

function openModal(modal) {

    modal.classList.remove("hidden");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(modal) {

    modal.classList.add("hidden");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    const anyModalOpen =
        !editorModal.classList.contains("hidden") ||
        !viewModal.classList.contains("hidden") ||
        !deleteModal.classList.contains("hidden");


    if (!anyModalOpen) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

let toastTimer = null;


function showToast(message) {

    toastMessage.textC
