# Melody Quest
A website designed by Haorui, Yiting, Kris and Jason as Final Project for CIS 5500 Fall 2024. 

## Instruction
To run the website, it is pretty much the same as Homework 3. 
1. Download the website directory.
2. Put the directory into VS Code.
3. In the terminal, do following commands:
   - ```cd server```
   - ``` npm install```
   - ```npm start```
4. Then open another terminal, do following commands:
   - ```cd client```
   - ``` npm install```
   - ```npm start```
5. At this time, the website should pop up on the default browser.

## Page Description
This is a music search page for people to explore! 

- Home Page: The home page is like the cover of our website. From the home page, the user can go to any page they are interested in.
- Tracker Finder: The Track Finder contains two sections: search songs by genre as well as search songs by artist. By selecting the genre from the drop box with the number of results the user want to see, a table will pop up with title of the song, the link to listern to the song as well as the genre of the song. By clicking on the link, the user will be redirected to the page where they can enjoy the music. 
The second part is search song by artist. By selecting the artist name from the drop down menu, and then click the search button, the user can see a table with song title, track url as well as the artiste’s url which can redirect the user to other page and explore more.  

- Genre Explorer: The GenrePage is a central hub for music discovery, featuring two key sections: Top Genres for Artist and Genre of the Day. In the Top Genres for Artist section, users can search for an artist’s most popular genres using fuzzy search, allowing partial name entries. Each genre is clickable, displaying related tracks with URLs to their Beatport pages for easy listening. The Genre of the Day section lets users select a genre, specify the number of songs, and receive a curated track list, complete with clickable links. Users can refresh recommendations with a single click. The page offers a responsive, user-friendly design with hover animations, consistent styling, and a navigation bar for seamless exploration of other site features, embodying our mission to make music discovery simple and engaging.

- The Sound Lab: The Sound Lab offers four interactive features for music exploration. The Dance section randomly generates five dance-friendly song recommendations, with a Refresh button to discover new ones. In Hit the Gym, users can select a genre and the desired number of top songs, displaying them in a table below. The How Are You Feeling? section lets users choose their mood and the number of rows displayed per page, with pagination controls to navigate through all available songs. Lastly, the Search Songs feature allows users to find music based on specific attributes such as Instrumentalness, Energy, Valence, Liveness, and Acousticness. By clicking the Search Song button, relevant songs are displayed, and the Clear Filter button resets all inputs for a fresh search experience.

- Collaborative Creation: On this page, users can view songs collaborated on by two artists. The Add to Favorites button allows users to save songs to their favorites, while the Remove from Favorites button lets them delete songs from the list.


## Project structure 
This project is divided into client and server directories, organizing frontend and backend code separately.

### 1. Client
This directory contains the frontend code, built using React for the UI and CSS for styling.

```plaintext
client/
├── node_modules/          
├── public/                 
├── src/                    
│   ├── components/        
│   ├── pages/              # Individual page components
│   │   ├── album.js        
│   │   ├── Collaboration.js 
│   │   ├── GenrePage.js    
│   │   ├── HomePage.js     
│   │   ├── SearchPage.js   
│   │   └── SoundPage.js   
│   ├── style/              # CSS styles for the pages
│   │   ├── Collaboration.css
│   │   ├── GenrePage.css
│   │   ├── HomePage.css
│   │   ├── SearchPage.css
│   │   └── SoundPage.css
│   ├── App.js              
│   ├── index.js            
│   └── index.css           
├── package.json            
└── package-lock.json       

```

### 2. Server 
This directory contains the backend code, built using Node.js and Express.

```plaintext
server/
├── node_modules/           
├── config.json             
├── routes.js               # API endpoints for HTTP requests
├── server.js               # Main backend server file
├── package.json           
└── package-lock.json      
```

Wish you enjoy!
