# INST377-Final-Project
Folder holding code for final project

## Title
Basic MyAnimeList Functionality Website

## Description
My Project has two main factors and an additonal about page:
1. **Home Page**:
 One is the home page where through voice commands, any anime on the MAL site can be search for using a basic Jikan API call, through both typing and through voice command serach. 
2. **Anime Page**:
The second, is in my anime tab where there is a slider that shows images yousing a carousel of the top 25 anime and a section where all genres of the top 100 anime are shown and allow for a minmization and focus of the list through selection of the different generes. 
3. **About Page**:
This page is used to descripe this project and application. 

### Target Browsers:
I would use iOS Safari and most of my testing is conducted in google chrome. 

_____________________________________________________________________________
## Developer Manual

### Installation
1. Clone the repositroy: 
    ```bash
    git clone https://github.com/bbills21/INST377-Final-Project.git

2. navigate to project folder: 
    cd "location"

3. Install Node.js:
    npm install

### Server Application


### Test Running
1. run test: 
    npm test

2. Have a testing framework installed

### API Application
1. Jikan API: 
    Used to fetch anime data

## Bugs and Roadmap
### Bugs
1. API rate limits: 
    the Jikan API has rate limis, which may cause delays or failures if too many requests are made in a short period. 

2. Browser Compatibilit: 
    Voice commands may not work in all browsers. Was tested primarily in google chrome. 

### Roadmap:
1. improved voice handling.
2. allows users to see multiple results for a single query.
3. enhanced UI/UX design: 
4. offline support: 
5. imroved testing