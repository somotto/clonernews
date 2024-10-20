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