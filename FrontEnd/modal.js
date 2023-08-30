document.addEventListener("DOMContentLoaded", () => {
  const worksUrl = "http://localhost:5678/api/works";
  const editLink = document.querySelector(".edit2");
  const modal = document.querySelector("#myModal");
  const closeBtn1 = document.querySelector("#close1");
  const closeBtn2 = document.querySelector("#close2");
  const photoModal = document.querySelector("#addPhotoModal");
  const photoAdd = document.querySelector(".add-photo-btn");
  const backArrow = document.querySelector(".fa-arrow-left");
  const worksEdit = document.querySelector(".edit_works");
  const trashIcon = document.querySelector(".fa-trash-can");
  const photoFileInput = document.getElementById("photoFile");
  const uploadedFileName = document.getElementById("uploadedFileName");

  // Afficher les projets dans la modale
  async function afficherImagesDansModale() {
    try {
      const reponse = await fetch(worksUrl);
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
  editLink.addEventListener("click", () => {
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
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === photoModal) {
      modal.style.display = "none";
      photoModal.style.display = "none";
      window.location.href = "index.html";
    }
  });

  // Supprime tout le contenu de la galerie
  function clearGallery() {
    worksEdit.innerHTML = "";
  }

  // Revenir au contenu précédent en cliquant sur la flèche
  backArrow.addEventListener("click", () => {
    clearGallery(); // Efface les images existantes dans la modale
    modal.style.display = "block";
    photoModal.style.display = "none";
    afficherImagesDansModale(); // Réaffiche les images mises à jour
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

          const response = await fetch(`${worksUrl}/${workId}`, {
            method: "DELETE",
            headers: headers,
          });

          if (response.ok) {
            worksEdit.removeChild(imageContainer);

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
  async function fetchCategories() {
    const categoriesUrl = "http://localhost:5678/api/categories";
    try {
      const response = await fetch(categoriesUrl);
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

  fetchCategories();

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
        const response = await fetch(worksUrl, {
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
            modal.style.display = "block";
          }, 3000);

          // Actualiser la galerie
          afficherImagesDansModale();
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

  // AFFICHAGE DU FICHIER QU'ON CHOISIT

  photoFileInput.addEventListener("change", () => {
    if (photoFileInput.files.length > 0) {
      uploadedFileName.textContent = photoFileInput.files[0].name;
    } else {
      uploadedFileName.textContent = "+ Ajouter photo";
    }
  });
});
