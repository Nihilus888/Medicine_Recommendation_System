# Speckle Viewer
This project aims to replicate parts of speckle for CAD-BIM integration that requires 3D rendering and API Integrations with Speckle

## Tech Stack
One of the most important considerations is choosing your tech stack as it is a software architectural design decision and I decided to go with these tech stack based on various considerations that I have identified

1. React.js/Three.js 

    I chose React.js as there is a specific library called React Three Fiber which is a good React renderer that integrates well with Three.js. Another consideration is that I'm personally more familiar with React compared with other popular frontend frameworks like
Vue or Angular

2. Node.js

    Node.js integrates very well with React.js and MongoDB 
which was my choice of my database. This tech stack is 
quite popular as it is the MERN stack which is versatile, 
easy to scale and scaffold. 

3. MongoDB

    After testing their REST API with their various endpoints via Postman, it looks like they have a lot of unstructured data that is in a 
JSON format. My rationale is using a relational database like MySQL or PostgreSQL will not be appropriate due to how there is a lot of 
metadata and unstructured data for the 3D rendering. 

## API Integration

I first started this project by reading the documentation 
particularly the API integration so that I can understand 
the different 
endpoints that I can pull from. After reading the API 
documentation, I used Postman to test the API after being 
granted the necessary 
permissions to call the necessary information. As I was 
using REST API and not GraphQL to call the JSON data, 
there were times where the data was quite large as I was calling all the data in one go.

After exploring the data, I integrated with their API using Node.js where I called all their API endpoints which was listed on their REST API documentation and integrated the data and stored those data into my database which was MongoDB. I had to structure the data in such a way where all the object Ids for a particular model would be kept into an array with a unique id where I can do a for loop and iterate through the object Ids to generate the 3D rendering via Speckle Viewer. 

## Frontend

On the frontend, I used React-Routers for routing of my pages and had to do a lot of research on Speckle Viewer library after researching on their documentation to find out how to use it as they have integrated three.js to display the 3D models. There were two main things that I noticed after reading through the documentation which was:

1. The Speckle Viewer

This is where the main camera is where we can download the 
objectIds from the model and display it. Furthermore, we 
can interact with the camera and do panning, zooming in 
and zooming out and various rotations.

2. Add-ons

There are certain features that can be added to the main 
speckle viewer with many examples that was shown however 
many of them were written in typescript which I'm not 
familiar 
with and a lot of the methods that were in the 
documentation have been deprecated according to the 
migration document update. So I have to choose those that 
are not deprecated 
and have no issues.

There are three main functionalities that I did which I 
think are important from my understanding of architecture 
and CAD:

1. Camera panning, zoom and interaction with the model
2. Measurement tools 
3. Selection extraction tools with metadata extractor when 
clicked on.

Adding more tools or more advanced models would start to 
cause the downloading of the models to take a long time 
render or alternatively the models would not load
individually even on speckle viewer which was unusual. I 
believe it was most likely to do with some permissions or 
rendering issues. 

## Technical Challenges (Assumptions and Limitations)

There were a lot of things to learn and within a short period of time to decide on a tech stack and also learn about speckle view and its API within such a short time frame which was 5 business days. It was tricky to understand as I have not worked with 3D models like Three.js or 3D models on a software engineering basis but I have worked with Rhino 3D and Grasshopper before so it gave me some idea on what functionalities were essential. 

Initially I struggled to really understand what was going on but after exploring, reading the documentation and playing around I started to get the hang of it and to find ways to implement them in this project like measurement, camera and the extraction selector. 

Due to time constraints as I only had 5 business days to do, I would have explore adding more functionalities like Section tools where you can see the details inside the model or animation and custom text which you can do interesting animations and write comments for reference. 

Using REST API to query their API resulted in a lot of data being fetched that might not have been necessary. I would have used GraphQL in this case as you can choose what variables you would like to query to make your data more streamlined as less bloated but unfortunately I'm not familiar enough with GraphQL to implement such a solution. After knowing this, I would learn and utilize GraphQL for these kind of 3D projects as it is more optimal.

## System Design Considerations
From a scalability and resilient perspective as we load more models with more object ids, we could swap REST API for GraphQL to get the data that we really need instead of calling every property and metadata which would cause us to take up unnecessary resources. Furthermore, we can use Redis caching to store the data where it is access frequently and we remove stale data when it is no longer needed and we call the database if it is ever needed and store it in cache if it is being called repeatedly again.

## Deployment

I decided to use vercel to deploy my app as it is free of charge and easy to integrate with React.js and Next.js applications without much hassle.

Here is the website link: https://speckle-view.vercel.app/




