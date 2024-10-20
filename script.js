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