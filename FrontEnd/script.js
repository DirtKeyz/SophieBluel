document.addEventListener("DOMContentLoaded", function () {
  // Fonction pour récupérer les œuvres depuis l'API
  async function fetchWorks() {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");
    return await response.json();
  }

  // Fonction pour récupérer les catégories depuis l'API
  async function fetchCategories() {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    return await response.json();
  }

  // Fonction pour supprimer le contenu de la div "gallery"
  function clearGallery() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
  }

  // Fonction pour créer et ajouter les éléments HTML à la galerie
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

  // Fonction principale pour récupérer les œuvres, les catégories et mettre à jour la galerie
  async function fetchAndDisplayWorks() {
    try {
      const worksData = await fetchWorks();
      const categoriesData = await fetchCategories();

      clearGallery();
      createAndAddElements(worksData);

      const filtersContainer = document.querySelector(".filters");
      filtersContainer.innerHTML = "";

      const allButton = document.createElement("button");
      allButton.textContent = "Tous";
      allButton.classList.add("active");
      filtersContainer.appendChild(allButton);

      categoriesData.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
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
            createAndAddElements(worksData);
          } else {
            const filteredWorks = worksData.filter(
              (work) => work.category.name === selectedCategory
            );
            clearGallery();
            createAndAddElements(filteredWorks);
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  fetchAndDisplayWorks();
});
