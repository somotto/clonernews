
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