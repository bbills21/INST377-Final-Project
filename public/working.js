// Fetch top 25 anime images
fetch('https://api.jikan.moe/v4/top/anime?limit=25')
    .then(response => response.json())
    .then(data => {
        const carousel = document.getElementById('anime-carousel');
        carousel.innerHTML = ''; // Clear any existing content in the carousel

        // Create an array to store the image elements
        const images = [];

        // Iterate over the anime data to extract image URLs
        data.data.forEach(anime => {
            const imgElement = document.createElement('img');
            imgElement.src = anime.images.jpg.image_url; // Use the image URL from the API response
            imgElement.alt = anime.title; // Use the anime title as the alt text
            imgElement.classList.add('slideshow-container');
            imgElement.style.display = 'none'; // Hide all images initially
            carousel.appendChild(imgElement);
            images.push(imgElement); // Add the image to the array
        });

        // Start the slideshow
        let currentIndex = 0;
        images[currentIndex].style.display = 'block'; // Show the first image

        setInterval(() => {
            images[currentIndex].style.display = 'none'; // Hide the current image
            currentIndex = (currentIndex + 1) % images.length; // Move to the next image
            images[currentIndex].style.display = 'block'; // Show the next image
        }, 3000); // Change image every 3 seconds
    })
    .catch(error => console.error('Error fetching anime images:', error));


    // Helper function to add a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTopAnime() {
    const animeList = [];
    const maxPages = 4; // Fetch 100 anime (25 per page, 4 pages)

    for (let page = 1; page <= maxPages; page++) {
        try {
            console.log(`Fetching page ${page}`); // Debugging log
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.data || !Array.isArray(data.data)) {
                console.error('Invalid or empty response:', data);
                continue; // Skip this page
            }
            animeList.push(...data.data); // Add the fetched anime to the list
            console.log(`Total anime fetched so far: ${animeList.length}`); // Debugging log

            // Add a delay to avoid hitting the rate limit
            await delay(1000); // Wait 1 second between requests
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
        }
    }

    return animeList; // Return the complete anime list
}

// Fetch top 100 anime and populate genres and anime list
fetchTopAnime()
    .then(animeList => {
        const genres = new Set(); // Use a Set to store unique genres

        // Populate the genres set
        animeList.forEach(anime => {
            if (anime.genres && anime.genres.length > 0) { // Ensure genres exist
                anime.genres.forEach(genre => {
                    genres.add(genre.name); // Add genre name to the set
                });
            }
        });

        // Populate the genre filter dropdown
        const genreFilter = document.getElementById('genre-filter');
        if (!genreFilter) {
            console.error('Genre filter element not found');
            return;
        }

        genres.forEach(genre => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = genre;
            checkbox.addEventListener('change', () => filterAnime(animeList));
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(genre));
            genreFilter.appendChild(label);
        });

        // Display all anime by default when the page loads
        filterAnime(animeList);
    })
    .catch(error => console.error('Error fetching top anime:', error));

    
    function filterAnime(animeList) {
        const selectedGenres = Array.from(document.querySelectorAll('#genre-filter input:checked')).map(input => input.value);
        console.log('Selected Genres:', selectedGenres); // Debugging log
    
        const animeListElement = document.getElementById('anime-list');
        if (!animeListElement) {
            console.error('Anime list element not found');
            return;
        }
    
        animeListElement.innerHTML = ''; // Clear the existing list
    
        animeList.forEach(anime => {
            const animeGenres = anime.genres ? anime.genres.map(genre => genre.name) : [];
    
            // Display all anime if no genres are selected
            if (selectedGenres.length === 0 || selectedGenres.every(genre => animeGenres.includes(genre))) {
                const listItem = document.createElement('li');
                listItem.classList.add('anime-item'); // Add a class for styling
    
                // Create an image element
                const imgElement = document.createElement('img');
                imgElement.src = anime.images.jpg.image_url; // Use the image URL from the API response
                imgElement.alt = anime.title; // Use the anime title as the alt text
                imgElement.classList.add('anime-thumbnail'); // Add a class for styling
    
                // Create a container for the title, score, genres, and description
                const infoContainer = document.createElement('div');
                infoContainer.classList.add('anime-info');
    
                // Add the title
                const titleElement = document.createElement('h4');
                titleElement.textContent = anime.title;
    
                // Add the description
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = anime.synopsis || 'No description available.'; // Use the synopsis or a fallback message
    
                // Add the score
                const scoreElement = document.createElement('p');
                scoreElement.textContent = `Score: ${anime.score || 'N/A'}`; // Display the score or 'N/A' if not available
    
                // Add the genres
                const genresElement = document.createElement('p');
                const genreNames = animeGenres.join(', '); // Join genre names with commas
                genresElement.textContent = `Genres: ${genreNames || 'N/A'}`; // Display genres or 'N/A' if not available
    
                // Append elements to the container
                infoContainer.appendChild(titleElement);
                infoContainer.appendChild(descriptionElement);
                infoContainer.appendChild(scoreElement);
                infoContainer.appendChild(genresElement);
    
                // Append the image and info container to the list item
                listItem.appendChild(imgElement);
                listItem.appendChild(infoContainer);
    
                // Append the list item to the anime list
                animeListElement.appendChild(listItem);
            }
        });
    
        console.log('Filtered anime displayed'); // Debugging log
    }