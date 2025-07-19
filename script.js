// Charger les données des animes
async function loadAnimeData() {
  try {
    const response = await fetch('animes.json');
    const animeData = await response.json();
    displayAnimes(animeData);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
}

// Afficher les animes
function displayAnimes(animeData) {
  const animeList = document.getElementById('anime-list');
  animeList.innerHTML = '';
  
  animeData.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    
    const stars = '⭐'.repeat(anime.rating) + '☆'.repeat(5 - anime.rating);
    
    card.innerHTML = `
      <img src="${anime.image}" alt="${anime.title}" />
      <h2>${anime.title}</h2>
      <p><strong>Genre :</strong> ${anime.genre}</p>
      <p><strong>Épisodes :</strong> ${anime.episodes}</p>
      <div class="rating">${stars}</div>
      <button class="review-btn" data-title="${anime.title}"><i class="fas fa-pen"></i> Ajouter un avis</button>
    `;
    
    animeList.appendChild(card);
  });

  // Ajouter les écouteurs d'événements aux nouveaux boutons
  setupReviewButtons();
}

// Gestion du thème
function setupTheme() {
  const themeSelect = document.getElementById('theme-select');
  const applyThemeBtn = document.getElementById('apply-theme');
  const toggleThemeBtn = document.getElementById('toggle-theme');
  
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('light-theme');
      toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }
  
  applyThemeBtn.addEventListener('click', () => {
    applyTheme(themeSelect.value);
  });
  
  toggleThemeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    applyTheme(isLight ? 'dark' : 'light');
    themeSelect.value = isLight ? 'dark' : 'light';
  });
}

// Gestion des boutons d'avis
function setupReviewButtons() {
  const reviewButtons = document.querySelectorAll('.review-btn');
  
  reviewButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentAnimeTitle = button.getAttribute('data-title');
      modal.style.display = 'flex';
    });
  });
}

// Gestion ouverture/fermeture modal 
const modal = document.getElementById('review-modal');
const closeModal = document.getElementById('close-modal');
const submitBtn = document.getElementById('submit-review');
const reviewText = document.getElementById('review-text');
const reviewRating = document.getElementById('review-rating');

let currentAnimeTitle = '';

// Ferme la modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  clearForm();
});

// Ferme la modal si clic en dehors du contenu
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    clearForm();
  }
});

// Fonction pour vider formulaire
function clearForm() {
  reviewText.value = '';
  reviewRating.value = '5';
}

// Gestion soumission revue
submitBtn.addEventListener('click', () => {
  const review = reviewText.value.trim();
  const rating = reviewRating.value;

  if (!review) {
    alert('Veuillez écrire un avis avant de soumettre !');
    return;
  }

  // Charger les reviews depuis localStorage
  let reviews = JSON.parse(localStorage.getItem('animeReviews')) || {};

  if (!reviews[currentAnimeTitle]) {
    reviews[currentAnimeTitle] = [];
  }

  // Ajouter la nouvelle revue
  reviews[currentAnimeTitle].push({ 
    review, 
    rating, 
    date: new Date().toISOString() 
  });

  // Sauvegarder dans localStorage
  localStorage.setItem('animeReviews', JSON.stringify(reviews));

  alert(`Merci pour votre avis sur "${currentAnimeTitle}" !`);
  modal.style.display = 'none';
  clearForm();
});

// Gestion du formulaire de contact
function setupContactForm() {
  const contactForm = document.getElementById('contact');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Ici vous pourriez envoyer les données à un serveur
    alert(`Merci ${name} pour votre message! Nous vous répondrons à ${email} dès que possible.`);
    
    // Réinitialiser le formulaire
    contactForm.reset();
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadAnimeData();
  setupTheme();
  setupContactForm();
});