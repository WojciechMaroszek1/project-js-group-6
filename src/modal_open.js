export const backdrop = document.querySelector('.backdrop');
export const homePage = document.body;
// When clicked, a modal window opens
function onModalOpen() {
  backdrop.classList.toggle('is-hidden');
  homePage.classList.toggle('modal-developers-is-open');
  document.addEventListener('keydown', onClickBackdrop);
}
// When you click on a backdrop, the modal window closes
function onClickBackdrop(e) {
  if (e.target.classList.contains('backdrop') || e.key === 'Escape') {
    onModalOpen();
    document.removeEventListener('keydown', onClickBackdrop);
  }
}

export { onModalOpen, onClickBackdrop };
