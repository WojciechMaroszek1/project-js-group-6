// let loader;

// function addLoader() {
//   loader = document.createElement('div');
//   loader.classList.add('loader');
//   document.body.appendChild(loader);
// }

export function showLoader() {
  // addLoader();
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
}
