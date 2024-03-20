let currentPage = 1;
let storiesPerPage = 10;
let isLoading = false;
let currentStoryType = 'top';
let totalStories = 0;


document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
    updatePaginationFooter();
});


function fetchNews() {
    if (isLoading) return;

    isLoading = true;
    const currentStoryType = document.getElementById('storyType').value;
    const url = `https://hacker-news.firebaseio.com/v0/${currentStoryType}stories.json`;

    fetch(url)
        .then(response => response.json())
        .then(storyIds => {
            totalStories = storyIds.length; // Keep track of the total number of stories
            const startStory = (currentPage - 1) * storiesPerPage;
            const endStory = startStory + storiesPerPage;
            const pageStoryIds = storyIds.slice(startStory, endStory);

            return Promise.all(pageStoryIds.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
            ));
        })
        .then(stories => {
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = ''; // Clear the container before adding new stories

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

            updatePaginationFooter();
            isLoading = false;
        })
        .catch(error => {
            console.error("There was an error fetching the news:", error);
            isLoading = false;
        });
}

function updatePaginationFooter() {
    const pageNumberElement = document.getElementById('pageNumber');
    pageNumberElement.textContent = `Page ${currentPage}`;

    const prevPageButton = document.getElementById('prevPage');
    prevPageButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';

    const nextPageButton = document.getElementById('nextPage');
    nextPageButton.style.visibility = (currentPage * storiesPerPage) >= totalStories ? 'hidden' : 'visible';
}

function nextPage() {
    if ((currentPage * storiesPerPage) < totalStories) {
        currentPage++;
        fetchNews();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchNews();
    }
}

document.getElementById('storyType').addEventListener('change', function() {
    currentPage = 1; // Reset to first page on type change
    currentStoryType = this.value;
    fetchNews(); // Fetch stories of the new type
});

// Initialize footer
updatePaginationFooter();