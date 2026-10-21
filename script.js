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
