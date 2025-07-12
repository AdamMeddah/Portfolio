const pageData = [
  {
    id: 1,
    dimensions: [4, 6, 0.2],
    start: 0,
    end: 0.4,
    color: "#c2a46f",
    position: [0, 0, -10],
    text: "dsjdsjhdhjsohids",

    leftContent: {
      //object to track content; leftContent if left page, right otherwise
      title: "Hi! I'm Adam Meddah",
      mainContent:
        "I'm a student at McMaster University who loves to push the limits of technology.",
      textColor: "#ff0000",
    },
  },

  {
    id: 2,
    dimensions: [4, 6, 0.2],
    start: 0.5,
    end: 0.9,
    color: "#ffffff",
    position: [0, 0, -10.001],
    cappedProgress: 0.99, //so it doesn't clip back into the first one
    text: "Hi! I'm Adam Meddah.",
    hasGrid: false,
    left: false,
  },

  {
    id: 3,
    dimensions: [4, 6, 0.2],
    start: 1,
    end: 1.5,
    color: "#ffffff",
    position: [0, 0, -10.002],
    text: "Projects",
    hasGrid: true,
  },
  {
    id: 4,
    dimensions: [4, 6, 0.2],
    start: 1.6,
    end: 2.0,
    color: "#ffffff",
    position: [0, 0, -10.003],
    text: "Other work",
    hasGrid: false,
  },
  {
    id: 5,
    dimensions: [4, 6, 0.2],
    start: 2.1,
    end: 2.5,
    color: "#ffffff",
    position: [0, -0, -10.004],
    text: "Boom",
    hasGrid: false,
  },

  {
    id: 6,
    dimensions: [4, 6, 0.2],
    start: 2.6,
    end: 3.0,
    color: "#ffffff",
    position: [0, 0, -10.005],
    text: "Love",
    hasGrid: false,
  },
];

export default pageData;
