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