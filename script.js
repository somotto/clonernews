
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