Speckle Viewer
This project aims to replicate parts of speckle for CAD-BIM integration that requires 3D rendering and API Integrations with Speckle

Tech Stack
One of the most important considerations is choosing your tech stack as it is a software architectural design decision and I decided to go with these tech stack based on various considerations that I have identified

React.js/Three.js I chose React.js as there is a specific library called React Three Fiber which is a good React renderer that integrates well with Three.js. Another consideration is that I'm personally more familiar with React compared with other popular frontend frameworks like Vue or Angular

Node.js Node.js integrates very well with React.js and MongoDB which was my choice of my database. This tech stack is quite popular as it is the MERN stack which is versatile, easy to scale and scaffold.

MongoDB After testing their REST API with their various endpoints via Postman, it looks like they have a lot of unstructured data that is in a JSON format. My rationale is using a relational database like MySQL or PostgreSQL will not be appropriate due to how there is a lot of metadata and unstructured data for the 3D rendering.
