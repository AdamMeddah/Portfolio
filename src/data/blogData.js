export const blogData = [
  {
    id: 1,
    title: "How I Built My Portfolio: My First React Project",
    desc: "How it felt diving headfirst into uncharted territory...",
    fullText: `

After finishing my React course, I wanted to push beyond the typical “to-do lists and static pages” and get my hands dirty with something a bit more immersive. That’s how this website came to be! My first full-fledged project using **React** in combination with **Three.js** via **React Three Fiber**.  

## The Goal

The goal was simple: create a portfolio that wasn’t just a list of projects, but a **living, interactive 3D experience**. Using React Three Fiber allowed me to stay in the React ecosystem while leveraging Three.js’s powerful rendering capabilities. I learned firsthand how **declarative 3D scenes** can be managed with React components, which made complex interactions like zooming into a virtual TV screen or rotating the camera smoothly feel intuitive.  

## Challenges & Learnings

One of the biggest hurdles I faced was **loading 3D assets efficiently**. High-quality HDRIs, which give the scene realistic lighting and reflections, can be a real bottleneck for load times. Initially, I saw no issue, since I was on a high speed wifi connection, and I was in a development environment where I already had all the assets for the project. I had already deployed my site, and... **nothing.** I waited and waited, before the site *finally* worked. Optimizing my images and videos were simple enough, but for my 3D environment, I had to find a way to balance quality and file size. For my fireplace HDR, I experimented with:  

- **EXR formats**  
- **Half-float channels**  
- **DWAA/DWAB compression**  

I used a plethora of tools such as oiiotool (part of OpenImageIO) in order to efficiently reduce file size. After several rounds of trial and error, I was able to get my HDRI down to a manageable file size **without sacrificing the lighting experience**.  

Another milestone for me was **deploying a React app for the first time**. It was exciting to see my work live on the web and accessible anywhere. Combining this with **performance optimizations**, like preloading assets and tweaking camera settings for smooth zooms, gave me a deeper appreciation for the challenges of modern web development.  
I learned to become **user obsessed**, whether through website performance or  snappy, specialized media queries, I followed a user-first web design.

## Reflections

Overall, this project has been a fantastic way to **get my feet wet in 3D web development**. I’ve learned how React Three Fiber can transform static React apps into interactive 3D experiences, the nuances of asset management and optimization, and the importance of **balancing visual fidelity with load performance**.  

This project is just the beginning, and I’m excited to continue exploring the intersection of React and 3D graphics in future projects. I haven't incorporated 3D too much into my portfolio website, so I aim to get more practice with it through other, new projects! (And improving this one)
 `,
    image: "images/portfolio.webp",
  },
];
