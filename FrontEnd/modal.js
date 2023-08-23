document.addEventListener("DOMContentLoaded", () => {
  const editLink = document.querySelector(".edit2");
  const modal = document.getElementById("myModal");
  const closeBtn = document.querySelector(".close");
  const photoModal = document.getElementById("addPhotoModal");
  const photoAdd = document.querySelector(".add_photo");
  const backArrow = document.querySelector(".fa-arrow-left");

  // Ouvrir la modale lorsqu'on clique sur le lien "modifier"
  editLink.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Ouvrir la modale "Ajouter une photo" lorsqu'on clique sur le bouton correspondant
  photoAdd.addEventListener("click", () => {
    modal.style.display = "none";
    photoModal.style.display = "block";
  });

  // Fermer la modale lorsqu'on clique sur une croix
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    photoModal.style.display = "none";
  });

  // Fermer la modale en cliquant en dehors de celle-ci
  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === photoModal) {
      modal.style.display = "none";
      photoModal.style.display = "none";
    }
  });

  // Revenir au contenu précédent en cliquant sur la flèche
  backArrow.addEventListener("click", () => {
    modal.style.display = "block";
    photoModal.style.display = "none";
  });
});
