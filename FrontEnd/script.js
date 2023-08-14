// Fonction pour récupérer les works
async function fetchWorks() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des données");
  return await response.json();
}

// Fonction pour supprimer le contenu de la div "gallery"
function clearGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
}

// Fonction pour créer et ajouter les éléments HTML
function createAndAddElements(data) {
  const gallery = document.querySelector(".gallery");

  data.forEach((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = item.imageUrl;
    img.alt = item.title;
    figcaption.textContent = item.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Fonction principale pour récupérer les œuvres et mettre à jour la galerie
async function fetchAndDisplayWorks() {
  try {
    const worksData = await fetchWorks(); // Appel à votre fonction pour récupérer les œuvres
    clearGallery(); // Suppression du contenu actuel de la galerie
    createAndAddElements(worksData); // Création et ajout des éléments à la galerie
  } catch (error) {
    console.error(error);
  }
}

// Appel initial pour afficher les œuvres
fetchAndDisplayWorks();
