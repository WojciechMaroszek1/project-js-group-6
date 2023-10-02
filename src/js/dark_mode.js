const toggle = document.querySelector('.header__toggle');
let btnIcon = document.querySelector('.header__toggle__icon');

let darkMode = localStorage.getItem('darkMode');

const enableDarkMode = () => {
  document.body.style.backgroundColor = '#241D1D';
  btnIcon.style.fill = '#ff6b08';
  localStorage.setItem('darkMode', 'enabled');
  let cardTitle = document.querySelectorAll('.card__title');
  let pageBtn = document.querySelectorAll('.pagination__button');
  let pageCtrl = document.querySelectorAll('.pagination__controls');
  let pagination = document.querySelector('.pagination__numbers');
  cardTitle.forEach(e => e.classList.add('card__title--dark'));
  pageBtn.forEach(e => e.classList.add('pagination__button--dark'));
  pageCtrl.forEach(e => e.classList.add('pagination__controls--dark'));
  pagination.classList.add('pagination--dark');
};

const disableDarkMode = () => {
  document.body.style.backgroundColor = 'white';
  btnIcon.style.fill = 'white';
  localStorage.setItem('darkMode', null);
  let cardTitle = document.querySelectorAll('.card__title');
  let pageBtn = document.querySelectorAll('.pagination__button');
  let pageCtrl = document.querySelectorAll('.pagination__controls');
  let pagination = document.querySelector('.pagination__numbers');
  cardTitle.forEach(e => e.classList.remove('card__title--dark'));
  pageBtn.forEach(e => e.classList.remove('pagination__button--dark'));
  pageCtrl.forEach(e => e.classList.remove('pagination__controls--dark'));
  pagination.classList.remove('pagination--dark');
};

if (darkMode === 'enabled') {
  enableDarkMode();
}

toggle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode');
  if (darkMode !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
