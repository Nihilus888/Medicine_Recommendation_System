# Speckle Viewer
This project aims to replicate parts of speckle for CAD-BIM integration that requires 3D rendering and API Integrations with Speckle

## Tech Stack
The choice of tech stack is a critical design decision, and I selected the following technologies based on the task that I was working on: 

1. React.js

    React.js was chosen because of its compatibility with the Speckle Viewer and my personal preference for React over other frontend frameworks like Vue or Angular. React’s component-based structure and rich ecosystem make it a great choice for building dynamic web apps.

2. Node.js

    Node.js is used for the backend as it pairs well with React.js and MongoDB. It’s part of the popular MERN stack, known for being versatile, easy to scale, and efficient for handling asynchronous tasks, especially when interacting with APIs and managing real-time data.

3. MongoDB

    I chose MongoDB due to the unstructured nature of the 3D model data, which is typically stored in a JSON format. Relational databases like MySQL or PostgreSQL are not ideal here since they are better suited for structured data. MongoDB offers flexibility in storing this metadata and facilitates rapid development with large volumes of unstructured data, such as 3D model propertie

## API Integration

I began by thoroughly exploring Speckle's API documentation to understand the available endpoints. This allowed me to design the interaction flow with the backend effectively. Using Postman, I tested the various endpoints after securing the necessary permissions. One key consideration during this phase was the size of the data I was retrieving, as calling all endpoints in one go could result in significant payloads.

Once I had a good understanding of the data structure, I integrated the Speckle API using Node.js. The JSON data fetched from the API was stored in MongoDB. For each model, I structured the data so that object IDs were grouped into arrays. I then iterated through these IDs to generate 3D renderings via the Speckle Viewer.

## Frontend

On the frontend, I used React-Router to handle page routing and navigation. I dedicated significant time to learning about the Speckle Viewer library, as it integrates Three.js for 3D model rendering. Some key observations from the documentation include:

1. The Speckle Viewer
2. 
The Speckle Viewer serves as the core of the project. It provides a camera interface that allows users to zoom in, pan, rotate, and interact with the model in various ways. The viewer is crucial for displaying the 3D models that are the heart of the CAD-BIM integration.

3. Add-ons

The Speckle Viewer allows the addition of various tools and features. However, many examples were written in TypeScript, a language I'm less familiar with. Additionally, several methods in the documentation were deprecated, which required me to carefully select the up-to-date features. Despite this, I was able to integrate the core functionalities.

There are three main functionalities that I did which I 
think are important from my understanding of architecture 
and CAD:

1. Camera panning, zoom and interaction with the model
2. Measurement tools 
3. Selection extraction tools with metadata extractor when 
clicked on.

As the complexity of the models increased, I noticed performance issues with long rendering times or models failing to load altogether. This could be due to permission or rendering-related issues. These challenges need further investigation to optimize the rendering process.

## Images

<img width="1429" alt="Screenshot 2025-04-01 at 4 55 26 PM" src="https://github.com/user-attachments/assets/085d19c9-a4b1-478f-83f1-373ce950bed8" />

A simple landing home page to explain what this app is about and what it does

<img width="1440" alt="Screenshot 2025-04-01 at 4 55 51 PM" src="https://github.com/user-attachments/assets/fcbcc9b1-c322-47d8-954d-2bb149cc3700" />

The speckle 3D viewer with measurement tools with a tooltip of the metadata of the that particular selected model.

<img width="1429" alt="Screenshot 2025-04-01 at 5 03 35 PM" src="https://github.com/user-attachments/assets/7e83b95f-14a9-4377-ad7c-0ea091d9f6f2" />

Home page is mobile responsive which I also factor into consideration from a UI/UX perspective


## Technical Challenges (Assumptions and Limitations)

Several challenges emerged during the development of this project, which I tackled by learning on the fly:

1. Short Development Time: The project was completed in 5 business days, which was a tight timeline for learning about Speckle and integrating 3D models.

2. Learning Curve: While I had prior experience with 3D software like Rhino and Grasshopper, working with 3D models in a web development context was new to me. However, by diving into the documentation and experimenting, I quickly got the hang of it.

3. Data Overload with REST API: The API returned large volumes of data, which were sometimes unnecessary. If I had more time, I would have used GraphQL to make data retrieval more efficient. GraphQL allows selective querying, which would optimize the amount of data being fetched, reducing bloat and improving performance.

4. Mobile Responsiveness: Achieving full mobile responsiveness with 3D models posed difficulties, particularly with the measurement UI and metadata tooltips overlapping. With more time, I would design solutions via tools like Figma to address these layout issues.
   
## System Design Considerations
To make this solution scalable and resilient, I considered the following architectural improvements:

1. GraphQL Integration: Swapping REST API for GraphQL would allow me to query only the necessary data, reducing unnecessary payloads and improving performance.

2. Caching with Redis: Implementing Redis caching could store frequently accessed data, thus reducing the load on the database and improving retrieval times. Expired or unused data can be purged from the cache when no longer needed.

3. Scaling the Backend: As the app grows and more models are added, I would implement API gateways and load balancers. This would distribute requests evenly across multiple servers, improving performance and reliability.

## Additional Suggestions

1. Error Handling and Logging: Implementing robust error handling and logging using tools like Sentry would help track errors in production and make debugging easier.

2. Versioning: Implementing version control for the API and ensuring backward compatibility would help with future upgrades without breaking existing functionalities.

3. User Authentication: If the app were to expand, adding a user authentication mechanism would allow users to save their work, load custom models, and customize their experience.

4. Performance Optimization: As more models are added, lazy loading and pagination of the 3D models could be employed to improve initial load times.

With these improvements, the application could scale efficiently while maintaining performance and providing a smoother user experience.

## Deployment

For deployment, I chose Vercel due to its seamless integration with React.js and its free hosting tier, making it a cost-effective solution. The deployment process is straightforward, and Vercel handles scalability automatically.

Here is the website link: https://speckle-viewer.vercel.app/

