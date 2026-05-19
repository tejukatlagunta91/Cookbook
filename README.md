Cookbook – Recipe Management Web Application

A modern and responsive **Recipe Management Web Application** built using **React + Vite**.
Cookbook helps users organize, manage, search, and scale recipes with an interactive and user-friendly interface.

Project Overview

Cookbook is a smart digital recipe platform designed for:

* Home cooks & families
* Professional chefs
* Fitness enthusiasts
* Culinary students

The application allows users to create, edit, delete, search, filter, and manage recipes efficiently while providing additional features like ingredient scaling, favorites, PDF export, and dark mode.

Features

User Authentication

* Secure login system
* Session persistence using LocalStorage
* Protected routes for authenticated users

Recipe Management (CRUD)

* Create new recipes
* Read detailed recipe information
* Update existing recipes
* Delete unwanted recipes

Smart Search & Filters

* Real-time recipe search
* Filter by:

  * Cuisine
  * Difficulty
  * Cooking time
* Multi-filter support

Dynamic Ingredient Scaling

* Automatically adjusts ingredient quantities
* Supports custom serving sizes
* Instant recalculation without reload

Favorites System

* Save favorite recipes
* Dedicated favorites page
* Persistent user-specific storage

Dark Mode

* Toggle between Light/Dark themes
* Improved readability for night usage

PDF Export

* Export recipes as downloadable PDFs
* Offline access to recipes

Responsive Design

* Optimized for:

  * Desktop
  * Tablet
  * Mobile devices

Tech Stack

Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Icons

Backend (Mock API)

* JSON Server

Development Tools

* ESLint
* VS Code

Project Structure

```bash
src/
│
├── components/      # Reusable UI Components
├── pages/           # Application Pages
├── context/         # Global State Management
├── services/        # API Handling
├── utils/           # Helper Functions
├── assets/          # Images & Static Files
└── App.jsx          # Main Application
```

Installation & Setup

Clone the Repository

```bash
git clone https://github.com/tejukatlagunta91/Cookbook.git
cd Cookbook
```

Install Dependencies

```bash
npm install
```

Start JSON Server

```bash
npx json-server --watch db.json --port 3000
```

Run the React Application

```bash
npm run dev
```
System Requirements

Hardware

* Minimum 4GB RAM
* Intel i3 Processor or above

Software

* Node.js v16+
* NPM v8+
* Modern Browser (Chrome, Firefox, Edge)

---

Key Objectives

* Centralized recipe storage
* Fast and responsive UI
* Secure user interaction
* Easy accessibility across devices
* Digital preservation of recipes


```md
```

License

This project is developed for educational and academic purposes.
