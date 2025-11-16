# Spots – Final (API + Webpack)

Spots is a simple social photo-sharing app where users can edit their profile, update their avatar, and create, like, and delete image cards.  

This final stage connects the front-end to a real REST API so that all changes persist on the server and survive page reloads.

---

## Project Pitch Video

Check out my project pitch video, where I walk through the functionality, challenges, and how I approached the build:

👉 [Project Pitch Video](https://drive.google.com/file/d/1mzWwfgRoRD2LcMqmKh5nJoe7btv_kS45/view?usp=sharing)

---

## Tech Stack

- **HTML5**, **CSS3**, **JavaScript (ES6 modules)**
- **Webpack** (bundling, asset handling)
- **Babel** (transpilation)
- **API**: `https://around-api.en.tripleten-services.com/v1`
- **BEM**-style CSS class naming

---

## Features

### User Profile

- Load current user data from the API (`GET /users/me`)
- Display:
  - Name
  - About/description
  - Avatar image
- Edit profile:
  - `PATCH /users/me` with `{ name, about }`
  - Form validation + inline error messages
  - “Save” button shows **“Saving…”** while the request is in progress

### Avatar Editing

- Edit avatar via a dedicated popup:
  - `PATCH /users/me/avatar` with `{ avatar }` (URL)
- Avatar overlay button:
  - **Desktop:** appears on hover over the avatar
  - **Mobile:** visible by default
- Avatar image:
  - Preloaded before showing (to avoid flicker)
  - Starts hidden and is revealed once the image successfully loads
- Button text shows **“Saving…”** while the avatar update request is in progress

### Cards

- Load all cards from the server:
  - `GET /cards`
  - Render using a reusable card template
- Add new card:
  - `POST /cards` with `{ name, link }`
  - New card is prepended to the list
  - “Create” button shows **“Saving…”** while the request is in progress
- Preview image popup:
  - Clicking a card image opens a fullscreen preview with caption

### Likes

- Like / unlike cards:
  - `PUT /cards/:cardId/likes` to like
  - `DELETE /cards/:cardId/likes` to remove a like
- UI:
  - Like button toggles active state
  - Uses updated `isLiked` data from the API response

### Deleting Cards

- Delete confirmation modal:
  - Opens when the trash icon on a card is clicked
  - Asks: “Are you sure you want to delete this image?”
  - Two buttons: **Delete** and **Cancel**
- Behavior:
  - Stores the selected card element and its `_id`
  - On submit:
    - Sends `DELETE /cards/:cardId`
    - On success, removes that specific card from the DOM
    - “Delete” button shows **“Deleting…”** while the request is in progress

### Form Validation & UX

- Shared validation module (`validation.js`):
  - Validates inputs in all modals
  - Shows and hides error messages
  - Disables submit buttons when inputs are invalid
- Better UX:
  - All form buttons show status text while requests are pending:
    - “Saving…” (profile, avatar, new card)
    - “Deleting…” (delete confirmation)
  - Errors from the API are logged via `console.error` in `catch` blocks

---

## API Integration

All API logic is encapsulated in a dedicated `Api` class:

    // utils/Api.js (conceptual)
    class Api {
      constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
      }

      _handleResponse(res) {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      }

      getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
          headers: this._headers,
        }).then(this._handleResponse);
      }

      getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
          headers: this._headers,
        }).then(this._handleResponse);
      }

      editUserInfo({ name, about }) {
        return fetch(`${this._baseUrl}/users/me`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify({ name, about }),
        }).then(this._handleResponse);
      }

      updateAvatar(avatar) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify({ avatar }),
        }).then(this._handleResponse);
      }

      addCard({ name, link }) {
        return fetch(`${this._baseUrl}/cards`, {
          method: "POST",
          headers: this._headers,
          body: JSON.stringify({ name, link }),
        }).then(this._handleResponse);
      }

      removeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
          method: "DELETE",
          headers: this._headers,
        }).then(this._handleResponse);
      }

      changeLikeStatus(cardId, isLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
          method: isLiked ? "DELETE" : "PUT",
          headers: this._headers,
        }).then(this._handleResponse);
      }

      getAppData() {
        return Promise.all([this.getUserInfo(), this.getInitialCards()]);
      }
    }

In `index.js`, the class is instantiated like this:

    const api = new Api({
      baseUrl: "https://around-api.en.tripleten-services.com/v1",
      headers: {
        authorization: "YOUR_PERSONAL_TOKEN_HERE",
        "Content-Type": "application/json",
      },
    });

---

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

    # clone the repo
    git clone https://github.com/serjykalstryke/se_project_spots.git

    cd spots

    # install dependencies
    npm install

### Scripts

    # build for production
    npm run build

    # run dev server (if configured)
    npm run dev

    # or
    npm start

(Check your `package.json` for exact script names.)

---

## Project Structure (high level)

    .
    ├── src
    │   ├── pages/
    │   │   └── index.css
    │   ├── scripts/
    │   │   ├── index.js
    │   │   └── validation.js
    │   ├── utils/
    │   │   └── Api.js
    │   ├── images/
    │   └── index.html
    ├── dist/
    ├── webpack.config.js
    └── package.json

---

## Improvements & Future Ideas

- Show human-friendly error messages in the UI instead of just logging to the console
- Global loading state/spinner while initial user + card data is loading
- Add like counters to cards
- Add pagination or lazy-loading for large card lists
- Basic routing for different views (e.g., profile-only view, card-focused view)

---

## Links

- **GitHub Repo:** `https://github.com/serjykalstryke/se_project_spots.git`  
- **Live Demo (GitHub Pages / other):** `(https://serjykalstryke.github.io/se_project_spots/)`  

---

## License

This project is for educational purposes as part of the TripleTen Web Development program.
