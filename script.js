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
setInterval(checkLiveUpdates, 15000);

// Throttled fetch posts function
const throttledFetchPosts = throttle(() => fetchPosts(currentType), 1000);

// Use throttled function for scroll events
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        throttledFetchPosts();
    }
});
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