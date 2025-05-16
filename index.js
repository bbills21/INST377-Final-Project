const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON bodies

const supabaseUrl = 'https://wcjlbaqtdgvyeyoshmii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjamxiYXF0ZGd2eWV5b3NobWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNjI1MjEsImV4cCI6MjA2MjkzODUyMX0.KuGkioNPe1mw_JiZnygP41AmRLAAJcnoogqlV9Mi6Tw';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/api/data', async (req, res) => {
    const { data, error } = await supabase.from('anime').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post('/api/data', async (req, res) => {
    console.log('adding anime');
    console.log(req.body);

    const title = req.body.title;
    const score = req.body.score;
    const genres = req.body.genres;
    const description = req.body.description;

    const { data, error } = await supabase
        .from('anime')
        .insert({
            anime_title: title,
            anime_score: score,
            anime_genres: genres,
            anime_description: description
        })
        .select();

    if (error) {
        console.log(`Error: ${error}`);
        return res.status(500).json({ error: error.message });
    }

    // Send back the inserted row(s)
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});