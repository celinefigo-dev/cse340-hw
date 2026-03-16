document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(
    'input[type="checkbox"][id^="toggle"]'
  );
  toggles.forEach((toggle) => {
    const passwordInput = toggle
      .closest(".form-group")
      .querySelector('input[type="password"]');
    if (passwordInput) {
      toggle.addEventListener("change", function () {
        passwordInput.type = this.checked ? "text" : "password";
      });
    }
  });
});

setTimeout(() => {
  const notice = document.querySelector(".notice");
  if (notice) {
    notice.classList.add("fade-out");
    setTimeout(() => notice.remove(), 1000); // Remove after fade
  }
}, 30000);

setTimeout(() => {
  const notice = document.querySelector(".error");
  if (notice) {
    notice.classList.add("fade-out");
    setTimeout(() => notice.remove(), 1000); // Remove after fade
  }
}, 30000);