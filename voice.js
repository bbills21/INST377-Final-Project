// Fetch anime data dynamically based on the search term
async function fetchAnimeData(animeName) {
    try {
        const container = document.getElementById('anime-container');
        container.innerHTML = ''; // Clear previous content before fetching new data

        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debugging log
        const anime = data.data[0]; // Get the first matching anime
        displayAnime(anime); // Display the anime details

        // Restart annyang after the search
        if (annyang && annyang.isListening()) {
            annyang.abort(); // Stop any ongoing recognition
            annyang.start(); // Restart recognition
        }
    } catch (error) {
        console.error('Error fetching anime data:', error);
        const container = document.getElementById('anime-container');
        container.innerHTML = '<p>Failed to fetch anime. Please try again later.</p>';

        // Restart annyang even if an error occurs
        if (annyang && annyang.isListening()) {
            annyang.abort();
            annyang.start();
        }
    }
}

// Display anime data
function displayAnime(anime) {
    const container = document.getElementById('anime-container');
    container.innerHTML = ''; // Clear previous content

    if (!anime) {
        container.innerHTML = '<p>No anime found. Please try again.</p>';
        return;
    }

    const animeElement = document.createElement('div');
    animeElement.classList.add('anime-item');

    // Add anime details
    animeElement.innerHTML = `
        <h2>${anime.title}</h2>
        <p><strong>Rank:</strong> ${anime.rank || 'N/A'}</p>
        <p><strong>Genres:</strong> ${anime.genres.map(genre => genre.name).join(', ') || 'N/A'}</p>
        <p><strong>Description:</strong> ${anime.synopsis || 'No description available.'}</p>
    `;

    container.appendChild(animeElement);
}

// Set up voice recognition
if (annyang) {
    console.log('Annyang is loaded and supported.');

    const commands = {
        'search for *anime': async (animeName) => {
            console.log(`Searching for: ${animeName}`); // Debugging log
            const anime = await fetchAnimeData(animeName);
            displayAnime(anime);
        }
    };

    annyang.addCommands(commands);
    annyang.start();

    annyang.addCallback('error', (err) => {
        console.error('Annyang error:', err);
    });

    annyang.addCallback('result', (phrases) => {
        console.log('Recognized phrases:', phrases);
    });
} else {
    console.error('Annyang is not supported in this browser.');
}