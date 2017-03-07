# TaiwanSpots (Web App Practice) 
A website lets user share the information of Taiwan's local spots. A practice of Node.js and Express.

- URL: https://taiwanspots.herokuapp.com/
- Frondend: HTML + CSS + JavaScript
- Backend:  Node.js + Express + MongoDB

## Log of Different Versions

- v1: Basic function of adding post 
      * Store data in array (not persistent)

- v2: Store data in MongoDB (persistent)
      * Store data in MongoDB with mongoose
      * Add show route (show detail page)

- v3: Add the function of showing comment
      * It can show comment but not yet add comment 
      * Refactor database schemas (post and comment) to separate files
      * Create seedDB() to create the dumb data in database

- v4: Add function of adding comment 
      * Add the function to add the comments (nested route)
      * Separate the ejs files to two different folders accordingly (posts and comments)

- v5: Styling of the show page
      * Add public folder for css files 

- v6: Authenticate (regestration and login)

- v7: Refactor the routes
      * Add "routes" folder for separate the routes into different files

- v8: Associate the data: user + comments

- v9: Associate the data: user + posts

- v10: Add function of edit and delete (post and comment); refactor the middleware
       * Add "middleware" folder

- v11: Flash message; refactor login and regestration; refactor landing page

- v12: Change the subject from YelpCamp to TaiwanSpots
       * Rename the files and modify all the strings from campground to spot (post)

 *# The term "campground" in the codes represents the post because the webside's original subject was YelpCamp.* 
