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