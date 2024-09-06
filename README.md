# Movie Database Application

## Overview

This project is a movie database application built using Angular 18.10.0 and Angular Material. It integrates with the TMDB (The Movie Database) API to fetch and display information about movies, including details such as title, poster, release date, and ratings. Users can browse various categories of movies and navigate through paginated lists of results. The project's responsive design can adapt to screens as small as 320px wide.

## Features

- **Movie Listings**: Browse movies categorized as Trending, Popular, or Free.
- **Movie Details**: View detailed information about individual movies.
- **Language Support**: Multi-language support with dynamic string fetching.
- **Responsive Design**: Optimized for various screen sizes using Angular Material's responsive components.

## Technologies Used

- **Angular 18.10.0**: The core framework for building the front-end of the application.
- **Angular Material**: Provides a set of reusable UI components that follow Material Design principles.
- **TMDB API**: Used to fetch movie data including posters, titles, ratings, and more.
- **RxJS** : Reactive programming library used for handling asynchronous data streams.
- **ngx-translate**: Manages multi-language support.
- **ngx-translate-multi-http-loader** : Loader to manage multiple translation files.

## Installation

### Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16.x or higher)
- Angular CLI (v18.10.0)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/DivaldoJr1001/angular-movie-site-frontend.git
   cd angular-movie-site-frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   ng serve
   ```

   `ng serve`

The application will be accessible at `http://localhost:4200`.

## Usage

### Browsing Movies

- Use the category selector to switch between Trending, Popular, and Free movies.
- Use the pagination controls to navigate through the pages of movies.

## Testing

Unit tests are provided using Jasmine and Karma. To run the tests:

```bash
ng test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie data used in this application.
- The Angular and Angular Material teams for their awesome work.
