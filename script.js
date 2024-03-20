document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
});

let isLoading = false;

function fetchNews() {
    if (isLoading) return;

    isLoading = true;
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json';

    fetch(url)
        .then(response => response.json())
        .then(storyIds => {
            // Limit to the first 10 stories for simplicity
            const topTenStoryIds = storyIds.slice(0, 10);
            return Promise.all(topTenStoryIds.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
            ));
        })
        .then(stories => {
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = ''; // Clear the container

            // Create columns for stories
            stories.forEach((story, index) => {
                const storyHtml = `
                    <div class="collumn">
                        <div class="head">
                            <span class="headline hl3">${story.title}</span>
                            <p><span class="headline hl4">by ${story.by}</span></p>
                        </div>
                        <p>${story.text || ''}</p>
                        <p>${new Date(story.time * 1000).toLocaleDateString()}</p>
                        <a href="${story.url}" target="_blank">Read More</a>
                    </div>
                `;
                newsContainer.innerHTML += storyHtml;
            });

            isLoading = false;
        }).catch(error => {
            console.error("There was an error fetching the news:", error);
            isLoading = false;
        });
}

function displayNoMoreNews() {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML += '<div class="collumn"><p>No more news to load.</p></div>';
}
