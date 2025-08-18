const profileEditButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form")
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input")

const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageLink = newPostForm.querySelector("#image-link-input");
const newPostCaptionInput = newPostForm.querySelector("#image-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

function openProfileModal() {
     editProfileModal.classList.add("modal_is-opened");
}

function closeProfileModal() {
    editProfileModal.classList.remove("modal_is-opened");
}

function openPostModal() {
    newPostModal.classList.add("modal_is-opened");
}

function closePostModal() {
    newPostModal.classList.remove("modal_is-opened");
}

profileEditButton.addEventListener("click", function() {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    openProfileModal();
})

editProfileCloseButton.addEventListener("click", function() {
    closeProfileModal();
})

newPostButton.addEventListener("click", function() {
    openPostModal();
})

newPostCloseButton.addEventListener("click", function() {
    closePostModal();
})

function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;
    closeProfileModal();
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit)

function handleNewPostSubmit(evt) {
    evt.preventDefault();
    console.log(newPostImageLink.value);
    console.log(newPostCaptionInput.value);
    newPostForm.reset();
    closePostModal();
}

newPostForm.addEventListener("submit", handleNewPostSubmit)