document.addEventListener("DOMContentLoaded", () => {
  const urlWorks = "http://localhost:5678/api/works";
  const urlCategories = "http://localhost:5678/api/categories";
  const gallery = document.querySelector(".gallery");
  const loginForm = document.querySelector("form");
  const errorMessage = document.getElementById("error_message");
  const logoutLink = document.querySelector(".logout");
  const loginLink = document.querySelector(".login");
  const myfilters = document.querySelector(".filters");
  const adminBox = document.querySelector(".blackbox");
  const edit1 = document.querySelector(".edit1");
  const edit2 = document.querySelector(".edit2");
  const modal = document.querySelector("#myModal");
  const closeBtn1 = document.querySelector("#close1");
  const closeBtn2 = document.querySelector("#close2");
  const photoModal = document.querySelector("#addPhotoModal");
  const photoAdd = document.querySelector(".add-photo-btn");
  const backArrow = document.querySelector(".fa-arrow-left");
  const worksEdit = document.querySelector(".edit_works");
  const trashIcon = document.querySelector(".fa-trash-can");
  const photoFileInput = document.getElementById("photoFile");
  const PrevImg = document.querySelector(".upload_img");
  const newPhotoPreview = document.querySelector(".newPhotoPreview");
  const contentUploadImg = document.querySelector(".content_upload_img");
  const validatePhotoButton = document.getElementById("addPhotoButton");

  // RECUPERATION PROJETS ET CREATION DES FILTRES //

  // Fonction pour récupérer les projets depuis l'API

  async function fetchWorks() {
    const response = await fetch(urlWorks);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des projets");
    return await response.json();
  }

  // Fonction pour récupérer les catégories depuis l'API

  async function fetchCategories() {
    const response = await fetch(urlCategories);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    return await response.json();
  }

  // Fonction pour supprimer le contenu de la div "gallery"

  function clearGallery() {
    gallery.innerHTML = "";
  }

  // Fonction pour ajouter les projets à la galerie (venant de l'API)

  function createAndAddElements(data) {
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
  // Fonction Filtres

  async function fetchAndDisplayWorks() {
    try {
      const worksData = await fetchWorks();
      const categoriesData = await fetchCategories();

      // Nettoie la galerie existante

      clearGallery();

      // Ajoute les éléments des projets à la galerie

      createAndAddElements(worksData);
      myfilters.innerHTML = "";

      // Crée un bouton "Tous" actif pour afficher tous les projets

      const allButton = document.createElement("button");
      allButton.textContent = "Tous";
      allButton.classList.add("active");
      myfilters.appendChild(allButton);

      // Ajoute des boutons de filtre pour chaque catégorie

      categoriesData.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        myfilters.appendChild(button);
      });

      const filterButtons = document.querySelectorAll(".filters button");
      filterButtons.forEach((button) => {
        // Gère le clic sur un bouton de filtre

        button.addEventListener("click", () => {
          // Désactive tous les autres boutons de filtre et active celui sélectionné

          filterButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          const selectedCategory = button.textContent;
          if (selectedCategory === "Tous") {
            // Affiche tous les projets si "Tous" est sélectionné

            clearGallery();
            createAndAddElements(worksData);
          } else {
            // Affiche les projets de la catégorie sélectionnée

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

  // Appelle la fonction pour récupérer et afficher les projets

  fetchAndDisplayWorks();

  // CONNECTION DE L'UTILISATEUR //

  const showLogin = () => {
    loginLink.style.display = "block";
    logoutLink.style.display = "none";
  };

  const showLogout = () => {
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
  };

  const logout = () => {
    localStorage.removeItem("token");
    showLogin();
    window.location.reload();
  };

  if (localStorage.getItem("token")) {
    myfilters.style.display = "none";
    adminBox.style.display = "flex";
    edit1.style.display = "inline-block";
    edit2.style.display = "inline-block";
    showLogout();
  } else {
    showLogin();
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
        showLogout();
      } else {
        errorMessage.textContent = "Email ou Password incorrect";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.textContent =
        "Une erreur est survenue (serveur hors ligne ?)";
    }
  });

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });

  // GESTION DE LA MODALE //

  // Afficher les projets dans la modale

  async function afficherImagesDansModale() {
    try {
      const reponse = await fetch(urlWorks);
      const works = await reponse.json();

      works.forEach((work) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.setAttribute("data-work-id", work.id);
        img.setAttribute("data-image-name", work.title);
        imgContainer.appendChild(img);

        const editText = document.createElement("p");
        editText.textContent = "éditer";
        imgContainer.appendChild(editText);

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        imgContainer.appendChild(trashIcon);

        worksEdit.appendChild(imgContainer);

        imgContainer.addEventListener("mouseenter", () => {
          const icon = document.createElement("i");
          icon.classList.add("fa-solid", "fa-arrows-up-down-left-right");
          imgContainer.appendChild(icon);
        });

        imgContainer.addEventListener("mouseleave", () => {
          const icon = imgContainer.querySelector(
            ".fa-arrows-up-down-left-right"
          );
          if (icon) {
            imgContainer.removeChild(icon);
          }
        });
      });
    } catch (erreur) {
      console.error("Erreur lors de la récupération des works :", erreur);
    }
  }

  afficherImagesDansModale();

  // Ouvrir et fermer les modales

  edit2.addEventListener("click", () => {
    modal.style.display = "block";
  });

  photoAdd.addEventListener("click", () => {
    modal.style.display = "none";
    photoModal.style.display = "block";
  });

  closeBtn1.addEventListener("click", () => {
    modal.style.display = "none";
    window.location.href = "index.html";
  });

  closeBtn2.addEventListener("click", () => {
    photoModal.style.display = "none";
    window.location.href = "index.html";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === photoModal) {
      modal.style.display = "none";
      photoModal.style.display = "none";
      window.location.href = "index.html";
    }
  });

  // Supprime tout le contenu de la galerie

  function clearGalleryModale() {
    worksEdit.innerHTML = "";
  }

  // Revenir au contenu précédent en cliquant sur la flèche

  backArrow.addEventListener("click", () => {
    clearGalleryModale();
    modal.style.display = "block";
    photoModal.style.display = "none";
    afficherImagesDansModale();
  });

  //  SUPPRESSION PROJET

  worksEdit.addEventListener("click", async (event) => {
    event.preventDefault();
    const trashIconClicked = event.target.classList.contains("fa-trash-can");
    if (trashIconClicked) {
      const imageContainer = event.target.closest(".image-container");
      const img = imageContainer.querySelector("img");
      const workId = img.dataset.workId;
      const workName = img.dataset.imageName;

      const confirmDelete = confirm(
        `Êtes-vous sûr de vouloir supprimer le projet n°${workId} : ${workName} ?`
      );
      if (confirmDelete) {
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };

          const response = await fetch(`${urlWorks}/${workId}`, {
            method: "DELETE",
            headers: headers,
          });

          if (response.ok) {
            worksEdit.removeChild(imageContainer);
            fetchAndDisplayWorks();

            // Afficher le message de confirmation

            const confirmationMessageDelete = document.getElementById(
              "confirmationMessageDelete"
            );
            confirmationMessageDelete.textContent = `Le projet "${workName}" a été supprimé avec succès.`;
            confirmationMessageDelete.style.display = "block";

            // Masquer le message après 3 secondes

            setTimeout(() => {
              confirmationMessageDelete.style.display = "none";
            }, 3000);
          } else {
            const errorData = await response.json();
            console.error(
              "Erreur lors de la suppression du projet :",
              errorData
            );
          }
        } catch (erreur) {
          console.error("Erreur lors de la suppression du projet :", erreur);
        }
      }
    }
  });

  //  AJOUT PROJET

  // Récupérer les catégories depuis l'API

  async function fetchInitialCategories() {
    try {
      const response = await fetch(urlCategories);
      const categories = await response.json();
      const categorySelect = document.getElementById("photoCategory");

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }

  fetchInitialCategories();

  // Gérer l'ajout d'un nouveau projet

  const addPhotoButton = document.getElementById("addPhotoButton");

  addPhotoButton.addEventListener("click", async () => {
    const photoFile = document.getElementById("photoFile").files[0];
    const photoTitle = document.getElementById("photoTitle").value;
    const photoCategory = document.getElementById("photoCategory").value;

    //  verification taille fichier

    if (photoFile && photoTitle && photoCategory) {
      if (photoFile.size > 4 * 1024 * 1024) {
        alert("La taille de l'image dépasse 4 Mo.");
        return;
      }

      //  verification format fichier

      const allowedFormats = ["image/jpeg", "image/png"];
      if (!allowedFormats.includes(photoFile.type)) {
        alert(
          "Le format de fichier n'est pas pris en charge. Veuillez utiliser JPG ou PNG."
        );
        return;
      }

      const formData = new FormData();
      formData.append("image", photoFile);
      formData.append("title", photoTitle);
      formData.append("category", photoCategory);

      try {
        const response = await fetch(urlWorks, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const confirmationMessageAdd = document.getElementById(
            "confirmationMessageAdd"
          );
          confirmationMessageAdd.textContent =
            "Le projet a été ajouté avec succès.";
          confirmationMessageAdd.style.display = "block";

          setTimeout(() => {
            confirmationMessageAdd.style.display = "none";
          }, 3000);

          // Actualiser la galerie

          afficherImagesDansModale();
          fetchAndDisplayWorks();
        } else {
          const errorData = await response.json();
          console.error("Erreur lors de l'ajout du projet :", errorData);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  });

  // Preview de la photo à uploader

  photoFileInput.addEventListener("change", () => {
    const selectedFile = photoFileInput.files[0];

    if (selectedFile) {
      // Masquer l'icône, le bouton et le paragraphe
      contentUploadImg.style.display = "none";

      // objet URL pour la photo sélectionnée
      const imageURL = URL.createObjectURL(selectedFile);

      // balise <img> pour afficher la photo
      const imgElement = document.createElement("img");
      imgElement.src = imageURL;
      imgElement.classList.add("selected-image");

      // Ajouter l'image à la div "newPhotoPreview"
      newPhotoPreview.appendChild(imgElement);
    }
  });

  // Activation du bouton Valider si champs remplis

  // Fonction pour gérer la validation
  function handleValidation() {
    const photoFile = document.getElementById("photoFile").files[0];
    const photoTitle = document.getElementById("photoTitle").value;

    // Vérifie si les champs requis sont remplis
    if (photoFile && photoTitle) {
      // Retire la classe .validate-photo-btn
      validatePhotoButton.classList.remove("validate-photo-btn");
    } else {
      // Ajoute la classe .validate-photo-btn si les champs ne sont pas remplis
      validatePhotoButton.classList.add("validate-photo-btn");
    }
  }

  // Écoutez les changements dans les champs photoFile et photoTitle
  document
    .getElementById("photoFile")
    .addEventListener("change", handleValidation);
  document
    .getElementById("photoTitle")
    .addEventListener("input", handleValidation);
});
