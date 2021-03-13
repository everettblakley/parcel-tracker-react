# Parcel Tracker

Using the [package.place API](https://package.place), we get tracking details for tracking numbers from Canada Post, DHL, FedEx, Skynet Worldwide, USPS, and UPS, and present them in a much more visually appealling way. 

## Tech Stack

Using React (and Typescript) for the framework, utilizing react-map and deck-gl for the spatial data visualizations. State management is handled using MobX. Styles are applied using BulmaCSS and some components from MaterialUI. 

## Installation

You know the drill

```bash
npm install
npm run start
```

## Test Data

Test data is located in [db.json]("db.json") and is served using [My JSON Server](https://my-json-server.typicode.com/). Set `http://my-json-server.typicode.com/everettblakley/parcel-tracker-react` as the REACT_APP_API_URL for development purposes, and data will be served from the JSON file.