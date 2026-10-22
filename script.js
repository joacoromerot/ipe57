// IPET 57 - interacciones del sitio
const menuToggle = document.querySelector('#menuToggle');
const nav = document.querySelector('#nav');
menuToggle?.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Animaciones al entrar en pantalla.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Botón volver arriba y enlace activo.
const backTop = document.querySelector('#backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 500);
});
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const sections = [...document.querySelectorAll('main section[id]')];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) current = section.id;
  });
  nav?.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Asistente básico local: no envía mensajes ni guarda datos.
const chatMessages = document.querySelector('#chatMessages');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const answers = [
  { keys: ['especialidad', 'carrera', 'orientacion', 'orientación', 'programacion', 'programación', 'automotor', 'electronica', 'electrónica', 'electricidad'], text: 'En esta maqueta se muestran Programación, Automotores, Electrónica y Electricidad. La oferta vigente debe confirmarse directamente con el colegio o en sus canales oficiales: https://www.facebook.com/Ipet57' },
  { keys: ['donde', 'dirección', 'direccion', 'ubicacion', 'ubicación', 'queda', 'mapa', 'llegar'], text: 'La referencia de ubicación utilizada en esta página es 25 de Mayo 1500, barrio General Paz, Córdoba. Podés revisar el mapa de la sección Contacto y confirmar los datos con la institución.' },
  { keys: ['contacto', 'telefono', 'teléfono', 'llamar', 'correo', 'mail', 'email', 'facebook', 'instagram'], text: 'Canales publicados para verificar: sitio web https://ipet57.edu.ar/ · Facebook https://www.facebook.com/Ipet57 · Instagram https://www.instagram.com/ipet_57 · correo escuelapolitecnico10@hotmail.com. Confirmá que sigan vigentes.' },
  { keys: ['inscripcion', 'inscripción', 'inscribirme', 'inscripciones', 'requisito', 'fecha', 'horario', 'horarios'], text: 'No tengo fechas, requisitos ni horarios confirmados. Consultá los canales oficiales del IPET 57 para obtener información actualizada.' },
  { keys: ['hola', 'buenas', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches'], text: '¡Hola! Puedo orientarte sobre especialidades, ubicación y canales de contacto. ¿Qué querés consultar?' }
];
function addMessage(text, type) {
  const item = document.createElement('div');
  item.className = `message ${type}`;
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function respond(question) {
  const q = question.toLocaleLowerCase('es');
  const found = answers.find(item => item.keys.some(key => q.includes(key)));
  addMessage(found?.text || 'No tengo esa información confirmada. Para evitar darte un dato incorrecto, consultá el sitio oficial https://ipet57.edu.ar/ o el Facebook https://www.facebook.com/Ipet57.', 'bot');
}
function sendQuestion(question) {
  const clean = question.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  chatInput.value = '';
  window.setTimeout(() => respond(clean), 250);
}
chatForm?.addEventListener('submit', event => {
  event.preventDefault();
  sendQuestion(chatInput.value);
});
document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => sendQuestion(button.dataset.question));
});