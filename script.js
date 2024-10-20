const apiBase = 'https://hacker-news.firebaseio.com/v0';
let currentIndex = 0;
const postsPerPage = 10;
const postTypes = ['topstories', 'newstories', 'jobstories', 'askstories', 'showstories'];
let currentType = 'topstories';

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<div class="loading">Loading...</div>';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="error">${message}</div>`;
}

async function fetchPosts(type = currentType) {
    try {
        showLoading('posts');
        const response = await fetch(`${apiBase}/${type}.json`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const storyIds = await response.json();
        document.getElementById('posts').innerHTML = '';
        for (let i = currentIndex; i < currentIndex + postsPerPage; i++) {
            if (i >= storyIds.length) break;
            const postId = storyIds[i];
            await displayPost(postId);
        }
        currentIndex += postsPerPage;
    } catch (error) {
        showError('posts', 'Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', error);
    }
}

async function fetchItem(id) {
    const response = await fetch(`${apiBase}/item/${id}.json`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return await response.json();
}

async function displayPost(postId) {
    try {
        const post = await fetchItem(postId);
        const postElement = document.createElement('div');
        postElement.className = 'post';
        const postLink = post.url || `#/item/${post.id}`;
        let postContent = '';

        switch (post.type) {
            case 'job':
                postContent = `<span class="post-type">Job</span>`;
                break;
            case 'poll':
                postContent = `<span class="post-type">Poll</span>`;
                break;
            default:
                postContent = `<span class="post-type">Story</span>`;
        }

        postElement.innerHTML = `
            <a href="${postLink}" target="_blank">
                <h3>${post.title}</h3>
            </a>
            ${postContent}
            <p class="post-info">By: ${post.by} | Score: ${post.score}</p>
            ${post.url ? `<a href="${post.url}" target="_blank">Read more</a>` : ''}
            <button onclick="loadComments(${post.id})">Load Comments</button>
            <div id="comments-${post.id}"></div>`;
        document.getElementById('posts').appendChild(postElement);
    } catch (error) {
        console.error('Error displaying post:', error);
        // Optionally, show an error message for this specific post
    }
}

async function loadComments(postId) {
    try {
        const post = await fetchItem(postId);
        const commentsContainer = document.getElementById(`comments-${postId}`);
        commentsContainer.innerHTML = '<div class="loading">Loading comments...</div>';
        if (post.kids) {
            commentsContainer.innerHTML = '';
            for (const commentId of post.kids) {
                await displayCommentAndReplies(commentId, commentsContainer, 0);
            }
        } else {
            commentsContainer.innerHTML = '<p>No comments yet.</p>';
        }
    } catch (error) {
        showError(`comments-${postId}`, 'Failed to load comments. Please try again later.');
        console.error('Error loading comments:', error);
    }
}
async function displayCommentAndReplies(commentId, container, depth) {
    try {
        const comment = await fetchItem(commentId);
        if (comment.deleted || comment.dead) return;

        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.style.marginLeft = `${depth * 20}px`;
        commentElement.innerHTML = `
            <p>${comment.text}</p>
            <p class="post-info">By: ${comment.by}</p>
        `;
        container.appendChild(commentElement);

        if (comment.kids) {
            for (const replyId of comment.kids) {
                await displayCommentAndReplies(replyId, container, depth + 1);
            }
        }
    } catch (error) {
        console.error('Error displaying comment:', error);
        // Optionally, show an error message for this specific comment
    }
}

async function checkLiveUpdates() {
    try {
        const response = await fetch(`${apiBase}/updates.json`);
        if (!response.ok) throw new Error('Failed to fetch updates');
        const data = await response.json();
        const liveUpdateContent = document.getElementById('liveUpdateContent');
        liveUpdateContent.innerHTML = '<div class="loading">Checking for updates...</div>';

        let updatesHtml = '';
        for (let i = 0; i < Math.min(5, data.items.length); i++) {
            const itemId = data.items[i];
            const item = await fetchItem(itemId);
            updatesHtml += `
                <div class="live-update-item">
                    <h4>${item.title || 'Comment update'}</h4>
                    <p>${item.type === 'comment' ? item.text : item.url}</p>
                    <p class="post-info">By: ${item.by}</p>
                </div>
            `;
        }
        liveUpdateContent.innerHTML = updatesHtml || '<p>No new updates.</p>';
    } catch (error) {
        showError('liveUpdateContent', 'Failed to check for updates. Please try again later.');
        console.error('Error checking live updates:', error);
    }
}

function createNavigation() {
    const nav = document.createElement('nav');
    postTypes.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type.replace('stories', '');
        button.onclick = () => {
            currentType = type;
            currentIndex = 0;
            document.getElementById('posts').innerHTML = '';
            fetchPosts(type);
        };
        nav.appendChild(button);
    });
    document.querySelector('header').appendChild(nav);
}

// Initial load
createNavigation();
fetchPosts();

// Load more posts
document.getElementById('loadMore').addEventListener('click', () => fetchPosts(currentType));

// Check for live updates every 5 seconds
setInterval(checkLiveUpdates, 5000);

// Throttled fetch posts function
const throttledFetchPosts = throttle(() => fetchPosts(currentType), 1000);

// Use throttled function for scroll events
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        throttledFetchPosts();
    }
});