export interface ProjectCardProps {
  title: string
  desc: string
  imgsrc: string
  about: string
  featured: boolean
  githubLink: string
  siteLink: string
}

export const projects: ProjectCardProps[] = [
  {
    title: "Pulse Dashboard",
    desc: "A real-time analytics dashboard for tracking product usage.",
    imgsrc: "/image1.png",
    featured: true,
    about:
      "Pulse Dashboard visualizes live product usage data, letting teams track key metrics like active users, feature adoption, and retention in real time. Built with a focus on fast load times and clear, glanceable charts.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Marketplace Kit",
    desc: "A component library for building marketplace-style storefronts.",
    imgsrc: "/image1.png",
    featured: false,
    about:
      "Marketplace Kit is a set of reusable UI components — product cards, filters, checkout flows — designed to speed up building marketplace and e-commerce interfaces without starting from scratch each time.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Fleet Tracker",
    desc: "A live map view for monitoring vehicle fleet status.",
    imgsrc: "/image1.png",
    featured: false,
    about:
      "Fleet Tracker plots vehicle locations and statuses on an interactive map, giving dispatchers a real-time view of fleet activity, delays, and maintenance flags across a large operation.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Recipe Vault",
    desc: "A personal recipe organizer with tagging and search.",
    imgsrc: "/image1.png",
    featured: true,
    about:
      "Recipe Vault lets users save, tag, and search their own recipe collection, with support for ingredient-based filtering and quick meal planning views.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Budget Buddy",
    desc: "A lightweight expense tracker with monthly breakdowns.",
    imgsrc: "/image1.png",
    featured: false,
    about:
      "Budget Buddy helps users log expenses and see monthly spending broken down by category, with simple charts to spot trends and set spending goals.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Notely",
    desc: "A minimalist note-taking app with markdown support.",
    imgsrc: "/image1.png",
    featured: true,
    about:
      "Notely is a distraction-free note-taking app supporting markdown formatting, quick search, and folder organization for keeping personal and work notes separate.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
  {
    title: "Weatherly",
    desc: "A clean weather app with hourly and 7-day forecasts.",
    imgsrc: "/image1.png",
    featured: true,
    about:
      "Weatherly pulls live forecast data to show hourly and 7-day weather outlooks, with a clean interface built around glanceable icons and minimal text.",
    githubLink: "www.github.com",
    siteLink: "www.github.com",
  },
]
