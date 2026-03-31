// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navegation = document.querySelector('.navegation');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const isActive = navegation.classList.toggle('active');
      menuToggle.textContent = isActive ? '✕' : '☰';
      
      // Calcular dinámicamente la altura del menú según su contenido
      if (isActive) {
        navegation.style.maxHeight = navegation.scrollHeight + 'px';
      } else {
        navegation.style.maxHeight = '0';
      }
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.navegation li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navegation.classList.remove('active');
        navegation.style.maxHeight = '0';
        menuToggle.textContent = '☰';
      });
    });
  }
});