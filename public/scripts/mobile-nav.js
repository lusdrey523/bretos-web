/**
 * Mejora progresiva del menú móvil (<details> nativo).
 * El menú funciona sin JavaScript: esto solo añade comodidad.
 */
const menu = document.getElementById('nav-mobile');

if (menu) {
  // Cerrar el menú al pulsar un enlace (en móvil la navegación ya ocurre).
  menu.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (link) menu.removeAttribute('open');
  });

  // Cerrar con Escape y devolver el foco al resumen.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.hasAttribute('open')) {
      menu.removeAttribute('open');
      const summary = menu.querySelector('summary');
      if (summary) summary.focus();
    }
  });

  // Cerrar al tocar fuera del menú.
  document.addEventListener('click', (event) => {
    if (!menu.hasAttribute('open')) return;
    const target = event.target;
    if (target instanceof Node && !menu.contains(target)) {
      menu.removeAttribute('open');
    }
  });
}
