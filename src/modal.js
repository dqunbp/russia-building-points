export function setupModal() {
  const modal = document.getElementById("modal");
  const closeModal = () => modal.classList.remove("is-active");
  const openModal = () => modal.classList.add("is-active");

  document.getElementsByClassName("modal-background").onclick = closeModal;
  document.getElementById("modal-bg").addEventListener("click", closeModal);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("about-large").addEventListener("click", openModal);
  document.getElementById("about-small").addEventListener("click", openModal);
}
