const toggle = document.getElementById('menu-toggle');
const mobile = document.getElementById('nav-mobile');

if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
}
