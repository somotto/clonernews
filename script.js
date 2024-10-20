
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
