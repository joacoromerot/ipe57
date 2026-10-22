<<<<<<< HEAD
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
=======
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');
const sendButton = document.querySelector('.send-button');
const quickPrompts = document.querySelectorAll('[data-prompt]');

const conversation = [];

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

function addMessage(role, text, isTyping = false) {
  const wrapper = document.createElement('div');
  wrapper.className = `message message-${role}${isTyping ? ' typing-message' : ''}`;
  if (isTyping) {
    wrapper.setAttribute('aria-label', 'El asistente está escribiendo');
    wrapper.innerHTML = '<span class="message-label">IPET 57 / BOT</span><span class="typing"><i></i><i></i><i></i></span>';
  } else {
    const label = document.createElement('span');
    label.className = 'message-label';
    label.textContent = role === 'bot' ? 'IPET 57 / BOT' : 'VOS';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    wrapper.append(label, paragraph);
  }
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrapper;
}

function setLoading(loading) {
  sendButton.disabled = loading;
  chatInput.disabled = loading;
  sendButton.setAttribute('aria-label', loading ? 'Enviando consulta' : 'Enviar consulta');
}

function resizeInput() {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 96)}px`;
}



async function submitMessage(rawMessage) {
  const message = rawMessage.trim();

  if (!message || sendButton.disabled) return;

  conversation.push({ role: 'user', content: message });
  addMessage('user', message);

  chatInput.value = '';
  resizeInput();
  setLoading(true);

  const typing = addMessage('bot', '', true);

  try {
    // Leer el archivo JSON mediante GET
    const response = await fetch('./chat.json', {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(
        `Error al cargar chat.json: HTTP ${response.status}`
      );
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Tu archivo debe contener una lista de objetos
    if (!Array.isArray(data)) {
      throw new Error(
        'El formato de chat.json debe ser una lista de objetos.'
      );
    }

    // Normalizar texto: minúsculas, sin tildes ni signos
    function normalizar(texto) {
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[¿?¡!.,;:]/g, '')
        .trim();
    }

    const consulta = normalizar(message);

    // Buscar coincidencias en las keywords
    const coincidencias = data
      .filter((item) => {
        if (
          !item ||
          !Array.isArray(item.keywords) ||
          typeof item.respuesta !== 'string'
        ) {
          return false;
        }

        return item.keywords.some((keyword) => {
          const palabra = normalizar(keyword);

          return palabra.length > 0 &&
            consulta.includes(palabra);
        });
      })
      // Priorizar la palabra clave más específica
      .sort((a, b) => {
        const longitudA = Math.max(
          ...a.keywords
            .filter((k) => consulta.includes(normalizar(k)))
            .map((k) => normalizar(k).length)
        );

        const longitudB = Math.max(
          ...b.keywords
            .filter((k) => consulta.includes(normalizar(k)))
            .map((k) => normalizar(k).length)
        );

        return longitudB - longitudA;
      });

    const answer = coincidencias.length > 0
      ? coincidencias[0].respuesta
      : 'No encontré una respuesta para esa consulta. Podés preguntarme por las especialidades, la ubicación, los horarios, las inscripciones o los contactos del I.P.E.T. Nº 57.';

    typing.remove();

    conversation.push({
      role: 'assistant',
      content: answer
    });

    addMessage('bot', answer);

  } catch (error) {
    typing.remove();

    console.error('Error del asistente:', error);

    addMessage(
      'bot',
      `No pude cargar la información del asistente. ${error.message} Revisá la ubicación de chat.json y la consola del navegador.`
    );

  } finally {
    setLoading(false);
    chatInput.focus();
  }
}



chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitMessage(chatInput.value);
});

chatInput?.addEventListener('input', resizeInput);
chatInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

quickPrompts.forEach((button) => {
  button.addEventListener('click', () => {
    const prompt = button.dataset.prompt || '';
    chatInput.value = prompt;
    resizeInput();
    submitMessage(prompt);
  });
});
>>>>>>> 5de10e19ff825efc7a8f099b404cd46865501cc6
