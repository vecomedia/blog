# Tech Blog & Portfolio Documentation

A modern, lightweight blog platform built with **Next.js and TypeScript** for publishing featured technical articles, development insights, and portfolio documentation.

The project will start as a simple foundation for displaying featured articles and will gradually evolve into a personal technical blog where I can document projects, experiments, technologies, and lessons learned.

## 🚀 Project Goal

The main goal is to create a clean and maintainable platform for publishing:

- Featured technical articles
- Development tutorials and insights
- Portfolio project documentation
- Architecture and implementation notes
- UI/UX experiments
- Debugging experiences and lessons learned
- New technologies and personal experiments

The initial version will focus on getting the technical foundation and layout in place before adding the complete article management and publishing logic.

---

## 🛠️ Tech Stack

- **Next.js**
- **TypeScript**
- **ZOD**
- **React**
- **API integration**
- **CSS / Tailwind CSS** *(depending on the final implementation)*

The project is intentionally kept simple at the beginning so the focus can remain on the content experience and architecture.

---

## 📋 Development Roadmap

### 1. Project Setup

Set up the basic Next.js and TypeScript application.

- [ ] Create Next.js application
- [ ] Configure TypeScript
- [ ] Set up project structure
- [ ] Configure styling
- [ ] Add basic development tooling

### 2. API Connection

The first functional step is to establish the connection to the article API.

- [ ] Define article data structure
- [ ] Create API client
- [ ] Connect to article endpoint
- [ ] Fetch featured articles
- [ ] Handle loading states
- [ ] Handle API errors
- [ ] Add basic data validation

The API layer should remain independent from the UI so that the data source can be changed later if necessary.

### 3. Layout & UI

After the API connection is working, the existing layout will be implemented in Next.js.

- [ ] Recreate existing layout
- [ ] Build reusable UI components
- [ ] Create featured article section
- [ ] Create article cards
- [ ] Add responsive behavior
- [ ] Add loading states / skeletons
- [ ] Connect the layout to the API data

### 4. Personal Articles

Once the basic application and layout are working, the project will be extended with the logic required for my own articles.

Potential functionality:

- [ ] Personal article structure
- [ ] Article detail pages
- [ ] Categories / tags
- [ ] Featured articles
- [ ] Publication dates
- [ ] Markdown or MDX support
- [ ] Images and media
- [ ] SEO metadata
- [ ] Related articles

### 5. Portfolio Documentation

The blog can become a central place for documenting portfolio projects.

Each project could include:

- Project overview
- Motivation
- Technologies used
- Architecture
- Development process
- Challenges
- Solutions
- Screenshots
- Lessons learned
- Links to the live project
- Links to the source code

---

## 📁 Initial Project Structure

The structure will remain intentionally simple during the first development phase:

```text
src/
├── app/
│   ├── page.tsx
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx
│   └── ...
│
├── components/
│   ├── articles/
│   ├── layout/
│   └── ui/
│
├── lib/
│   └── api/
│
├── types/
│   └── article.ts
│
└── ...