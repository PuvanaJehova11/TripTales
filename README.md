# TripTales – Smart Travel Planner

A beginner-friendly Web Technologies project built using **HTML, CSS and JavaScript only**. It does not require PHP, MySQL, Node.js or any other backend.

## Project features
1. Create a trip with its name, destination, start date, number of days and total budget.
2. Add places/activities to a day with time, category, estimated cost and notes.
3. View the itinerary in a timeline and filter it by day.
4. Track estimated stop costs against the trip budget.
5. Delete an individual stop or clear the whole trip.
6. Save trip information automatically in the browser using `localStorage`.
7. Responsive layout for desktop and mobile screens.

## Files
- `index.html` – page structure and forms
- `style.css` – visual design and responsive layout
- `script.js` – form validation, itinerary functions, budget calculation and localStorage

## Run on your computer
1. Extract the ZIP file.
2. Open the `TripTales` folder.
3. Double-click `index.html` to open it in Chrome or Edge.
4. Create a trip, then add places to the itinerary.

No installation is needed. For the best development experience, open the folder in VS Code and use the Live Server extension if it is already available. The project also works by opening `index.html` directly.

## Deploy / publish online (GitHub Pages)
1. Sign in to GitHub and create a new **public** repository, for example `triptales`.
2. Upload `index.html`, `style.css` and `script.js` to the repository's root folder (not inside an extra nested folder).
3. Open the repository's **Settings**.
4. Select **Pages** from the left menu.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then click **Save**.
7. Wait for GitHub Pages to publish. The site address will appear in the Pages section, usually:
   `https://YOUR-USERNAME.github.io/triptales/`

If your teacher provides a different hosting platform, upload these three files to the public web root (often called `public_html` or `www`). Keep all three files in the same folder.

## How to demonstrate the project
1. Enter trip name `Weekend Escape`, destination `Ooty`, choose a date, set 2 days and a budget of `8000`.
2. Save the trip details.
3. Add `Botanical Garden` on Day 1 at 10:00, category Sightseeing, estimated cost ₹100.
4. Add `Ooty Lake` on Day 1 at 14:00, category Sightseeing, estimated cost ₹200.
5. Add `Tea Museum` on Day 2 at 11:00, category Other, estimated cost ₹150.
6. Show the day filter, planned stops count and budget progress.
7. Refresh the page. Your trip should still appear because it is saved in localStorage.
8. Delete a stop and demonstrate Clear trip.

## Important notes / limitations
- This is a front-end-only educational project. It has no user login, server-side database, live maps, live weather or real booking integration.
- `localStorage` saves data only in the same browser on the same device. It is not shared between users or devices. Clearing browser site data may erase the saved trip.
- The budget is an estimate based on the costs entered for itinerary stops; it is not a payment system.
- Google Fonts are loaded from the internet. If there is no internet connection, the browser uses a fallback font.

## Suggested project explanation for viva
**Aim:** To design and develop a responsive Smart Travel Planner web application using HTML, CSS and JavaScript.

**HTML:** Creates the page sections, trip form, itinerary form, buttons and content areas.

**CSS:** Applies colours, spacing, typography, cards, responsive layout and mobile styling.

**JavaScript:** Validates form inputs, adds and deletes itinerary stops, filters stops by day, calculates estimated expenses and updates the page dynamically.

**DOM:** JavaScript uses `getElementById`, `addEventListener` and `innerHTML`/`textContent` to interact with page elements.

**localStorage:** Stores the trip and stop data in the browser so it remains after refreshing the page.

**Validation examples:** Required fields, trimmed text, trip duration between 1 and 30 days, non-negative budget and cost, and stop day not exceeding the trip duration.
