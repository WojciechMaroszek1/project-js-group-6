let loader;

function addLoader() {
  loader = document.createElement('div');
  loader.classList.add('loader');
  document.body.appendChild(loader);
}

export function showLoader() {
  addLoader();
  loader.style.display = 'block';
}

export function hideLoader() {
  loader.style.display = 'none';
}
