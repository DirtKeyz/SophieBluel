document.addEventListener("DOMContentLoaded", () => {
  // Éléments DOM
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

  // Afficher les images dans la modale
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

  // Revenir au contenu précédent en cliquant sur la flèche
  backArrow.addEventListener("click", () => {
    modal.style.display = "block";
    photoModal.style.display = "none";
  });

  // Supprimer une image
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
          // Ajouter le token dans les en-têtes de la requête
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
            const confirmationMessage = document.getElementById(
              "confirmationMessage"
            );
            confirmationMessage.textContent = `Le projet "${workName}" a été supprimée avec succès.`;
            confirmationMessage.classList.remove("hidden");

            // Masquer le message après 5 secondes
            setTimeout(() => {
              confirmationMessage.classList.add("hidden");
            }, 3000);
          } else {
            const errorData = await response.json();
            console.error(
              "Erreur lors de la suppression de l'image :",
              errorData
            );
          }
        } catch (erreur) {
          console.error("Erreur lors de la suppression de l'image :", erreur);
        }
      }
    }
  });
});
