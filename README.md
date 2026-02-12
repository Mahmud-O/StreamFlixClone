# Streamflix

Streamflix is a modern Netflix clone built with React and Vite, featuring authentication, protected routes, movie browsing, search, and a beautiful UI inspired by Netflix.

## Features

-   User authentication (login/register)
-   Protected and public routes
-   Browse movies and TV shows
-   Search functionality
-   Add to My List
-   Responsive design
-   Video player modal
-   Custom hooks and context for state management
-   Integration with TMDB API

## Tech Stack

-   React
-   Vite
-   Supabase (authentication & backend)
-   TMDB API (movie data)
-   Tailwind CSS
-   Sonner (UI notifications)

## Getting Started

### Prerequisites

-   Node.js & npm or pnpm

### Installation

1. Clone the repository:
    ```powershell
    git clone <repo-url>
    cd NetflixClone
    ```
2. Install dependencies:
    ```powershell
    pnpm install
    ```
3. Set up environment variables:
    - Create a `.env` file and add your Supabase and TMDB API keys.

### Running the App

```powershell
pnpm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

-   `src/Components` - UI components
-   `src/Pages` - Application pages
-   `src/Contexts` - Context providers
-   `src/CustomHooks` - Custom React hooks
-   `src/services` - API service modules
-   `src/assets` - Images and icons

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
