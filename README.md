# DevDiscuss: A Blog Platform for Developers

## Live Site

[DevDiscuss](https://discussdev.vercel.app/)

## Overview

DevDiscuss is a full-stack blog platform designed for developers to share their knowledge, engage in discussions, and stay updated on tech trends. It provides a user-friendly interface for creating, reading, liking, sharing, and commenting on blog posts. 

## Features

* **User Authentication:** Securely sign up and log in via email/password, Google, or GitHub.
* **Blog Creation and Management:**
    * Write and publish blog posts with a rich text editor.
    * Add code snippets with syntax highlighting. 
    * Include a captivating cover image.
    * Categorize posts with tags for easy discoverability.
    * Edit and delete your own posts.
* **Blog Interaction:**
    * Like and share posts.
    * Leave comments and engage in discussions.
    * Bookmark posts to revisit later.
* **User Profiles:** View and manage your profile information.
* **Search Functionality:** Easily find posts based on keywords.
* **Responsive Design:** Seamlessly browse and interact on any device.
* **AI-Powered Bot Assistant:**  Provides guidance and support for navigating DevDiscuss features.

## Tech Stack

**Frontend:** 
* React
* Tailwind CSS
* React Quill (Rich Text Editor)
* React Hot Toast (Notifications)
* React Spinners (Loading Indicators)
* React Router DOM (Navigation)
* Lucide React (Icons)
* React Share (Social Sharing)

**Backend:**
* Supabase (Database, Authentication)

**Hosting:** 
* Vercel

## Code Structure and Explanation

The project is structured using React components for maintainability and reusability. Here's a breakdown of key parts:


**Context API (User.jsx, theme.js):**  These files use React Context to manage and share global state across the application. 
   * `UserContext`:  Provides user authentication status (`user`), search results (`searchResult`), and controls for UI elements like modals (`model`, `login`).
   * `ThemeContext`:  Manages the application's theme (`themeMode`) and provides functions to toggle between dark and light modes.

**Custom Hooks:**
   * `useFetch` (`hooks/User.jsx`):  Fetches and caches data for a specific user from Supabase.
   * `usePost` (`hooks/Blogs.jsx`): Fetches and caches data for a single blog post or all posts from Supabase.

## Installation and Local Setup

1. **Clone the repository:** 
   ```bash
   git clone https://github.com/khatri-rohit/Blog.git

2. **Install dependencies:**
   ```bash
   cd Blogjs 
   npm install

3. **Set up Supabase:**
- Create a Supabase account (https://supabase.com/).
- Create a new project. Set up your database schema.
- Set up your database schema.
- Obtain your Supabase project URL and API key.

4. **Environment Variables:**
- Create a .env file in the root of your project.
- Add your Supabase credentials:
  ``` 
  VITE_SUPABASE_URL=[Your Supabase Project URL]
  VITE_SUPABASE_URL=[Your Supabase Public API Key] 
5. **Run the development server:**
   ```bash
   npm run dev

## Future Enhancements

* **Real-time updates:** Implement real-time updates for new posts, likes, and comments using Supabase's real-time functionality.
* **Improved search:**  Enhance the search functionality with filters, categories, and better relevance.
* **User roles:**  Introduce different user roles with varying permissions (e.g., admin, moderator).
* **Dark mode toggle:** Allow users to switch between light and dark modes.
* **Mobile optimization:**  Fine-tune the responsive design for a more polished mobile experience.

## Contributing
Contributions are welcome!  Please open an issue to discuss proposed changes or submit a pull request.
