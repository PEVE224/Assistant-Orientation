const whatsappNumber = '+224611016900';
const priceValue = 50000;

const state = {
  lastName: '',
  firstName: '',
  phone: '',
  location: '',
  series: '',
  average: '',
  university: '',
  email: '',
};

const priceElement = document.getElementById('priceValue');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const servicePresentation = document.getElementById('servicePresentation');
const heroWhatsapp = document.getElementById('heroWhatsapp');
const contactWhatsapp = document.getElementById('contactWhatsapp');
const backToTop = document.getElementById('backToTop');
const mainHeader = document.getElementById('mainHeader');
let validationAttempted = false;

function formatPrice(value) {
  return value.toLocaleString('fr-FR') + ' GNF';
}

function toggleSendButtonsState() {
  if (formMessage) {
    const messageIcon = formMessage.querySelector('.form-message-icon');
    const messageText = formMessage.querySelector('.form-message-text');

    const formIsValid = contactForm?.checkValidity() ?? false;
    formMessage.hidden = !validationAttempted && !formIsValid;
    formMessage.classList.toggle('form-message--success', formIsValid);
    formMessage.classList.toggle('form-message--warning', !formIsValid);

    if (messageIcon) {
      messageIcon.textContent = formIsValid ? '✓' : '!';
    }

    if (messageText) {
      messageText.textContent = formIsValid
        ? 'Tous les champs obligatoires sont remplis.'
        : 'Veuillez vérifier les champs obligatoires et leur format.';
    }
  }
}

function validateRequiredFields() {
  validationAttempted = true;
  const invalidFields = Array.from(contactForm.querySelectorAll('input')).filter((field) => !field.checkValidity());

  if (invalidFields.length > 0) {
    const firstInvalidField = invalidFields[0];
    const messageText = formMessage?.querySelector('.form-message-text');

    invalidFields.forEach((field) => field.setAttribute('aria-invalid', 'true'));
    formMessage.hidden = false;
    formMessage?.classList.remove('form-message--success');
    formMessage?.classList.add('form-message--warning', 'form-message--attention');
    if (messageText) {
      messageText.textContent = 'Veuillez remplir correctement les champs indiqués avant de continuer.';
    }

    document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      firstInvalidField.focus({ preventScroll: true });
      firstInvalidField.reportValidity();
    }, 450);
    setTimeout(() => formMessage?.classList.remove('form-message--attention'), 1600);
    return false;
  }

  return true;
}

function updatePrice() {
  if (priceElement) {
    priceElement.textContent = formatPrice(priceValue);
  }
}

function collectFormData() {
  state.lastName = document.getElementById('lastName').value.trim();
  state.firstName = document.getElementById('firstName').value.trim();
  state.phone = document.getElementById('phone').value.trim();
  state.location = document.getElementById('location').value.trim();
  state.series = document.getElementById('series').value.trim();
  state.average = document.getElementById('average').value.trim();
  state.university = document.getElementById('university').value.trim();
  state.email = document.getElementById('email').value.trim();
}

function getWhatsAppMessage() {
  return `Bonjour,%0aJe souhaite commencer mon accompagnement.%0a%0aNom : ${encodeURIComponent(state.lastName)}%0aPrénom : ${encodeURIComponent(state.firstName)}%0aTéléphone : ${encodeURIComponent(state.phone)}%0aDépartement : ${encodeURIComponent(state.location)}%0aSérie : ${encodeURIComponent(state.series)}%0aMoyenne : ${encodeURIComponent(state.average || 'Non renseignée')}%0aUniversité souhaitée : ${encodeURIComponent(state.university)}%0aEmail : ${encodeURIComponent(state.email || 'Non renseigné')}%0a%0aMerci.`;
}

function openWhatsApp() {
  if (!validateRequiredFields()) {
    return;
  }

  collectFormData();
  const message = getWhatsAppMessage();
  const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
  window.open(url, '_blank');
}

function showPresentation(element = servicePresentation) {
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderSubmissionSummary() {
  const summary = document.createElement('div');
  summary.className = 'presentation-card';
  const heading = document.createElement('h3');
  heading.textContent = 'Demande préparée avec succès';
  const introduction = document.createElement('p');
  introduction.textContent = `Merci ${state.firstName} ${state.lastName}. Votre message WhatsApp a été préparé. Vérifiez les informations, puis appuyez sur « Envoyer » dans WhatsApp.`;
  const details = document.createElement('ul');
  details.className = 'checklist';
  const fields = [
    ['Téléphone', state.phone],
    ['Département', state.location],
    ['Série', state.series],
    ['Moyenne', state.average || 'Non renseignée'],
    ['Université souhaitée', state.university],
    ['Adresse email', state.email || 'Non renseignée'],
  ];
  fields.forEach(([label, value]) => {
    const item = document.createElement('li');
    const labelElement = document.createElement('strong');
    labelElement.textContent = `${label} :`;
    item.append(labelElement, ` ${value}`);
    details.append(item);
  });
  const notice = document.createElement('p');
  notice.className = 'notice';
  notice.textContent = 'Vos informations sont utilisées pour préparer votre message WhatsApp et votre accompagnement personnalisé.';
  summary.append(heading, introduction, details, notice);
  servicePresentation.replaceWith(summary);
  return summary;
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateRequiredFields()) {
    return;
  }

  collectFormData();
  openWhatsApp();
  const summary = renderSubmissionSummary();
  showPresentation(summary);
}

function handleAccordion(event) {
  const target = event.currentTarget;
  const isActive = target.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach((item) => item.classList.remove('active'));
  document.querySelectorAll('.faq-item').forEach((item) => item.setAttribute('aria-expanded', 'false'));
  if (!isActive) {
    target.classList.add('active');
    target.setAttribute('aria-expanded', 'true');
  }
}

function handleScroll() {
  const offset = window.scrollY;
  if (offset > 60) {
    mainHeader.style.boxShadow = '0 14px 40px rgba(18, 35, 85, 0.12)';
    mainHeader.style.background = 'rgba(255,255,255,0.95)';
  } else {
    mainHeader.style.boxShadow = 'none';
    mainHeader.style.background = 'rgba(255,255,255,0.88)';
  }
  backToTop.classList.toggle('visible', offset > 500);
}

function initialize() {
  updatePrice();
  toggleSendButtonsState();

  contactForm.querySelectorAll('input').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.removeAttribute('aria-invalid');
      }
      toggleSendButtonsState();
    });
    field.addEventListener('change', toggleSendButtonsState);
  });

  contactForm.addEventListener('submit', handleFormSubmit);
  heroWhatsapp.addEventListener('click', openWhatsApp);
  contactWhatsapp.addEventListener('click', openWhatsApp);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', handleScroll);
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('click', handleAccordion));
  document.querySelectorAll('[data-start-form]').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (!contactForm.checkValidity()) {
        event.preventDefault();
        validateRequiredFields();
      }
    });
  });

  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach((element, index) => {
      element.style.animationDelay = `${index * 0.12}s`;
    });
  }, 50);
}

document.addEventListener('DOMContentLoaded', initialize);
