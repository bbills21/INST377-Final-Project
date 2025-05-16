// Fetch anime data dynamically based on the search term
async function fetchAnimeData(animeName) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debugging log
        const anime = data.data[0]; // Get the first matching anime
        displayAnime(anime); // Display the anime details
    } catch (error) {
        console.error('Error fetching anime data:', error);
        const container = document.getElementById('anime-container');
        container.innerHTML = '<p>Failed to fetch anime. Please try again later.</p>';
    }
}

// Display anime data
function displayAnime(anime) {
    const container = document.getElementById('anime-container');
    container.innerHTML = ''; // Clear previous content

  

    console.log('Displaying anime:', anime); // Debugging log

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

    if (!anime) {
        console.error('No anime data received.');
        container.innerHTML = '<p>No anime found. Please try again.</p>';
        return;
    }
}

// Set up voice recognition
if (annyang) {
    console.log('Annyang is loaded and supported.');

    const commands = {
        'Hello': () => alert('Hello!'),
        'search for *anime': async (animeName) => {
            console.log(`Searching for: ${animeName}`); // Debugging log
            const anime = await fetchAnimeData(animeName);
            if (anime) {
                displayAnime(anime);
            } else {
                console.error('No anime data received.');
            }
            // Restart annyang to continue listening
            if (annyang.isListening()) {
                annyang.abort();
                annyang.start();
            }
        }
    };

    annyang.addCommands(commands);
    annyang.start();

    annyang.addCallback('error', (err) => {
        console.error('Annyang error:', err);
        const container = document.getElementById('anime-container');
        container.innerHTML = '<p>Voice recognition error. Please try again.</p>';
    });

    annyang.addCallback('result', (phrases) => {
        console.log('Recognized phrases:', phrases);
    });
} else {
    console.error('Annyang is not supported in this browser.');
}