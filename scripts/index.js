const profileEditButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["edit-profile-form"];
const editProfileNameInput = editProfileForm.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileForm.querySelector("#profile-description-input");

const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = document.forms["new-post-form"];
const newPostImageLink = newPostForm.querySelector("#image-link-input");
const newPostCaptionInput = newPostForm.querySelector("#image-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const initialCards = [
  {
    name: "Vale Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  },
];

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

profileEditButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", () => closeModal(editProfileModal));
newPostButton.addEventListener("click", () => openModal(newPostModal));
newPostCloseButton.addEventListener("click", () => closeModal(newPostModal));

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
});

newPostForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  console.log(newPostImageLink.value);
  console.log(newPostCaptionInput.value);
  newPostForm.reset();
  closeModal(newPostModal);
});

initialCards.forEach(function(item) {
  console.log(item.name);
  console.log(item.link);
})