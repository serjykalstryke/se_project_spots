// scripts/index.js
import "../pages/index.css";
import Api from "../utils/Api.js";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
  enableButton,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "09e0c3a7-0560-488d-a5bd-7a3022033f86",
    "Content-Type": "application/json",
  },
});

// ---------- DOM ELEMENTS ----------

// Profile edit
const profileEditButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["edit-profile-form"];
const editProfileNameInput = editProfileForm.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileForm.querySelector(
  "#profile-description-input"
);
const editProfileSubmitButton = editProfileForm.querySelector(".modal__submit-btn");

// New post
const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = document.forms["new-post-form"];
const newPostImageLink = newPostForm.querySelector("#image-link-input");
const newPostCaptionInput = newPostForm.querySelector("#image-caption-input");
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-btn");

// Profile display
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

// Cards
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardList = document.querySelector(".cards__list");

// Delete confirmation modal (you need matching HTML)
const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardForm = deleteCardModal?.querySelector("form");
const deleteCardSubmitButton = deleteCardModal?.querySelector(".modal__submit-btn");

// ---------- STATE ----------

let currentUserId = null;
let selectedCardElement = null;
let selectedCardId = null;

// ---------- HELPERS ----------

function renderLoading(button, isLoading, defaultText, loadingText) {
  if (!button) return;
  button.textContent = isLoading ? loadingText : defaultText;
}

// ---------- MODAL HANDLERS ----------

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (!openedModal) return;

    if (openedModal.id === "new-post-modal") {
      newPostForm.reset();
      resetValidation(newPostForm, settings);
    }

    closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    if (evt.target.id === "new-post-modal") {
      newPostForm.reset();
      resetValidation(newPostForm, settings);
    }
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

// ---------- CARD FACTORY ----------

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;

  // init like state from server (if provided)
  if (cardData.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }

  // like handler → API
  cardLikeBtnEl.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikeBtnEl.classList.contains("card__like-button_active");

    api
      .changeLikeStatus(cardData._id, isCurrentlyLiked)
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeBtnEl.classList.add("card__like-button_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-button_active");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // delete button: only for owner (if owner field exists)
  if (cardData.owner && currentUserId && cardData.owner !== currentUserId) {
    cardDeleteBtnEl.style.display = "none";
  } else if (deleteCardModal && deleteCardForm) {
    cardDeleteBtnEl.addEventListener("click", () => {
      selectedCardElement = cardElement;
      selectedCardId = cardData._id;
      openModal(deleteCardModal);
    });
  } else {
    // fallback to instant delete if confirmation modal not wired yet
    cardDeleteBtnEl.addEventListener("click", () => {
      cardElement.remove();
    });
  }

  // image preview
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = cardData.link;
    previewImageEl.alt = cardData.name;
    previewCaptionEl.textContent = cardData.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ---------- EVENT LISTENERS ----------

// Preview close
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

// Profile edit open
profileEditButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);

  enableButton(editProfileSubmitButton, settings);
  openModal(editProfileModal);
});

// Profile edit close
editProfileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
  resetValidation(editProfileForm, settings);
});

// New post open
newPostButton.addEventListener("click", () => {
  resetValidation(newPostForm, settings);
  openModal(newPostModal);
});

// New post close
newPostCloseButton.addEventListener("click", () => {
  newPostForm.reset();
  resetValidation(newPostForm, settings);
  closeModal(newPostModal);
});

// Profile edit submit → PATCH /users/me
editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  renderLoading(editProfileSubmitButton, true, "Save", "Saving...");

  api
    .editUserInfo({ name, about })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(editProfileSubmitButton, false, "Save", "Saving...");
    });
});

// New post submit → POST /cards
newPostForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const name = newPostCaptionInput.value;
  const link = newPostImageLink.value;

  renderLoading(newPostSubmitButton, true, "Create", "Saving...");

  api
    .addCard({ name, link })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);
      newPostForm.reset();
      resetValidation(newPostForm, settings);
      disableButton(newPostSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(newPostSubmitButton, false, "Create", "Saving...");
    });
});

// Delete confirmation submit → DELETE /cards/:id
if (deleteCardForm && deleteCardSubmitButton) {
  deleteCardForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (!selectedCardId) return;

    renderLoading(deleteCardSubmitButton, true, "Yes", "Deleting...");

    api
      .removeCard(selectedCardId)
      .then(() => {
        if (selectedCardElement) {
          selectedCardElement.remove();
        }
        selectedCardElement = null;
        selectedCardId = null;
        closeModal(deleteCardModal);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        renderLoading(deleteCardSubmitButton, false, "Yes", "Deleting...");
      });
  });
}

// ---------- INITIAL LOAD (user + cards) ----------

api
  .getAppData() // this should be Promise.all([getUserInfo(), getInitialCards()]) in Api.js
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    // we'll wire avatar src here once we hook the avatar element

    cardList.innerHTML = "";
    cards.forEach((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// ---------- FORM VALIDATION ----------

enableValidation(settings);
