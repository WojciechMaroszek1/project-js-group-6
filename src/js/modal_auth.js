// Function to get ID
export let userAuthId = null;
export function getUserAuthId(id) {
  userAuthId = id;

  getDataFromFirebase(userAuthId);
}

export const overlayEl = document.querySelector('.overlay-auth');
export const homePage = document.body;
export function openModalAuth() {
  overlayEl.classList.remove('is-hidden');
  homePage.classList.add('modal-auth-is-open');
}

export function closeModalAuth() {
  overlayEl.classList.add('is-hidden');
  homePage.classList.remove('modal-auth-is-open');
}

export function onCloseBtnModalAuth() {
  closeModalAuth();
  if (homePage.classList.contains('modal-film-is-open')) {
    return;
  }
  if (!userAuthId) {
    window.location.href = 'index.html';
  }
}
