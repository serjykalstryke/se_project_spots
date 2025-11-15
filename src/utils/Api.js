// utils/Api.js

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

  _request(path, options = {}) {
    return fetch(`${this._baseUrl}${path}`, {
      headers: this._headers,
      ...options,
    }).then(this._handleResponse);
  }

  // 1) User data
  getUserInfo() {
    return this._request("/users/me");
  }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  // 2) Cards
  getInitialCards() {
    return this._request("/cards");
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  removeCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  changeLikeStatus(cardId, isLiked) {
    return this._request(`/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }

  // 3) Combined load
  getAppData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}

export default Api;
