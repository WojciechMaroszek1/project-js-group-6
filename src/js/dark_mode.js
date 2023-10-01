const toggle = document.querySelector('.header__toggle');
let btnIcon = document.querySelector('.header__toggle__icon');
let darkMode = localStorage.getItem('darkMode');

const enableDarkMode = () => {
    document.body.style.backgroundColor = '#241D1D';
    btnIcon.style.fill = '#ff6b08';
    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.style.backgroundColor = 'white';
    btnIcon.style.fill = 'white';
    localStorage.setItem('darkMode', null);
}

if(darkMode === 'enabled') {
    enableDarkMode();
}

toggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode')
    if(darkMode !== 'enabled') {
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
})