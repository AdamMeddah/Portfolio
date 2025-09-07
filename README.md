# Interactive 3D Portfolio Website

**Live Demo:** [https://adammeddah.com](https://adammeddah.com)  
**Technologies:** React, React Three Fiber, Drei, Three.js, Tailwind CSS  

## Overview
This project is an immersive, interactive 3D portfolio website built with React Three Fiber and Three.js. The main feature is a TV interface that zooms into a Netflix-style personalized experience, tailoring the displayed content to different user types (recruiters, developers, writers).  

## Features
- **3D TV Interface:** Clickable TV mesh transitions into a personalized home screen.  
- **User Flows:** Separate experiences for recruiters, developers, and writers, dynamically adjusting projects and content.  
- **Interactive 3D Elements:** OrbitControls, environment lighting, and custom shaders for immersive visuals.  
- **Performance Optimizations:** Compressed HDR → EXR, resized images, and optimized code, reducing load time from 30s to 8.8s on slow 3G networks.  
- **Responsive Design:** Mobile-friendly and visually polished across devices.  

## Installation
1. Clone the repository:  
```bash
git clone https://github.com/AdamMeddah/Portfolio.git
```

2. Navigate into the project directory:
```bash
cd portfolio
```
3. Install dependencies:
```bash
npm install
```
4. Build production-ready files:
```bash
npm run build
```

5. Serve the dist folder:
```bash
npx serve dist -s
```
The site should now be available at the local server URL (e.g., http://localhost:5000).
