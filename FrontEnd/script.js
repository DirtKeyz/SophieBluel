// Fonction pour récupérer les œuvres depuis l'API
async function fetchWorks() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url); // Effectue une requête HTTP pour récupérer les données
  if (!response.ok)
    // Vérifie si la réponse est réussie
    throw new Error("Erreur lors de la récupération des données");
  return await response.json(); // Convertit la réponse en format JSON
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
  const url = "http://localhost:5678/api/categories";
  const response = await fetch(url); // Effectue une requête HTTP pour récupérer les catégories
  if (!response.ok)
    // Vérifie si la réponse est réussie
    throw new Error("Erreur lors de la récupération des catégories");
  return await response.json(); // Convertit la réponse en format JSON
}

// Fonction pour supprimer le contenu de la div "gallery"
function clearGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Supprime le contenu actuel de la galerie d'œuvres
}

// Fonction pour créer et ajouter les éléments HTML à la galerie
function createAndAddElements(data) {
  const gallery = document.querySelector(".gallery");

  data.forEach((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = item.imageUrl; // Définit l'URL de l'image
    img.alt = item.title; // Définit le texte alternatif de l'image
    figcaption.textContent = item.title; // Définit le texte du figcaption

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure); // Ajoute la figure à la galerie
  });
}

// Fonction principale pour récupérer les œuvres, les catégories et mettre à jour la galerie
async function fetchAndDisplayWorks() {
  try {
    const worksData = await fetchWorks(); // Récupère les données des œuvres
    const categoriesData = await fetchCategories(); // Récupère les données des catégories

    clearGallery(); // Supprime le contenu actuel de la galerie
    createAndAddElements(worksData); // Ajoute les éléments des œuvres à la galerie

    const filtersContainer = document.querySelector(".filters");
    filtersContainer.innerHTML = ""; // Supprime les anciens boutons de filtrage

    const allButton = document.createElement("button");
    allButton.textContent = "Tous"; // Crée un bouton "Tous"
    allButton.classList.add("active"); // Active le bouton "Tous" par défaut
    filtersContainer.appendChild(allButton);

    categoriesData.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name; // Crée un bouton pour chaque catégorie
      filtersContainer.appendChild(button);
    });

    const filterButtons = document.querySelectorAll(".filters button");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedCategory = button.textContent;
        if (selectedCategory === "Tous") {
          clearGallery();
          createAndAddElements(worksData); // Affiche toutes les œuvres
        } else {
          const filteredWorks = worksData.filter(
            (work) => work.category.name === selectedCategory
          );
          clearGallery();
          createAndAddElements(filteredWorks); // Affiche les œuvres de la catégorie sélectionnée
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// Appel initial pour afficher les œuvres
fetchAndDisplayWorks();
