export function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast show ${type}`;
  toast.innerText = msg;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}