document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
});

let lastStoryIndex = 0;
let isLoading = false;

function fetchNews() {
    if (isLoading) return;

    isLoading = true;
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json';

    fetch(url)
        .then(response => response.json())
        .then(storyIds => {
            // Limit to the first 10 stories for simplicity
            const nextStoryIds = storyIds.slice(lastStoryIndex, lastStoryIndex + 10);
            lastStoryIndex += 10;

            return Promise.all(nextStoryIds.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
            ));
        })
        .then(stories => {
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = ''; // Clear the container

            // Create columns for stories
            stories.forEach(story => {
                const columnDiv = document.createElement('div');
                columnDiv.className = 'collumn';
                const storyHtml = `
                    <div class="head">
                        <span class="headline hl3">${story.title}</span>
                        <p>by ${story.by}</p>
                    </div>
                    <p>${new Date(story.time * 1000).toLocaleDateString()}</p>
                    <a href="${story.url}" target="_blank">Read More</a>
                `;
                columnDiv.innerHTML = storyHtml;
                newsContainer.appendChild(columnDiv);
            });

            isLoading = false;
        })
        .catch(error => {
            console.error("There was an error fetching the news:", error);
            isLoading = false;
        });
}

fetchNews();
