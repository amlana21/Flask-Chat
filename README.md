# Flask-Chat 

This a messaging app that enables users to communicate within themselves through varius channels. Through this app they can also message other online users privately. Below is a brief description about some functional and technical details of the application.  

Below are the technical frameworks used to build the app:  
 - Python  
 - Flask  
 - HTML,JavaScript,Jquery  

 
## Usage  
Below are steps to use various functionalities of the messaging app:  
 - Once the app is opened it presents a login page. Provide an username to login to the application. Only one session is allowed at    a time so make sure to logout any other sessions before logging in.  
 - Once logged in, the app opens up a page lising out all the available channels to communicate with and also a list of online users
   for private messaging  
 - Click on any of the channels to view the messages sent to the spcific channel  
 - To communicate with users of a channel, type some text in the text area and click Send or Ctrl+enter(windows)  
 - If any other users sends out messages, that will also show up on the channel view  
 - Click on the Create Channel icon to create a new channel for users to communicate. If the channel is existing you will get an       error so ensure the channel doesnt already exist  
 - Click on any of the usernames in the DIrect message section to start a private chat with any of the online users  
 - Once clicked on the username, it will any previous messages already exchanged  
 - To send a message, type text in the text area and click Send or Ctrl+enter(windows)  
 - Once done, click on Logout to logout of the session  
 - If Logout is not clicked, the application remembers the logged in user and automatically logs in to the application the next time
   it is opened from same browser  
 - The application also remembers the last channel an user was working on and when application is reopened, it lands on the last       channel being worked on  
 - There is a limit of 100 messages per channel. Once that limit is reached, the applicarion starts removing old messages to           accomodate new ones  

## Technical Details  
The application is divided in two portions. Below is a high level description of each part of the application:  

 ### Backend  
 The Backend is implemeneted using Flask which performs various app functions using Python. Add on packages installed to make the app work are Flask Socket IO and dot-env(to support development using environment variables). Below are the various files used in the backend
  - <em>application. py: </em>The main python script which handles all the routes for the Flask application.  
  - <em>channels. py: </em>This python script handles all functions related to channels like adding channels, listing all channels     etc.  
  - <em>messages. py: </em>This python script handles all functions related to messaging like send message, list all messages  
  - <em>sessions. py: </em>This python script handles all functions related to session management for the users  
  - <em>requirements. txt: </em>This lists out all the packages required for the app to run  
  - <em>JSON Files: </em>Different files to store various data for the app. Different types of data stored are Session, Messages,      Direct Messages and Channels. Used JSON files so that these data persist across server restarts.  

 ### Front End

 Front end for the application uses HTML and Javscript to interact with the server and present the app functionalities to the users.Below are high level files/folders which define the front end of the application:  
  - <em>css: </em> This folder contains the files which define the styling of the application. UI for the application also uses        Bootstrap to decorate the componenets.  
  - <em>js: </em>This folder contain Javascript files for the login and the Messaging page. The Javascript files interact with the     server to perform processing and present outputs to the user  
  - <em>templates: </em>All the HTML templates which define the basic UI skeleton for the application. The Javscript codes perform the processing and display various data on these page skeletons.  

 ### WebSockets  

 The real time message excahnge is implemented by the Websockets package used on both Backend and the frontend using Javascript library. On the Client side SockeIO library handles user side message exchanges and server side it uses Flask-SocketIO package to handle the message communications.