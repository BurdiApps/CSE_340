'use strict';

// --- Hamburger Menu Toggle ---
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navList.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// --- Scroll Reveal ---
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// --- Password Toggle ---
const pswdBtn = document.querySelector("#pswdBtn");
if (pswdBtn) {
  pswdBtn.addEventListener("click", function () {
    const pswdInput = document.getElementById("account_password");
    const type = pswdInput.getAttribute("type");
    if (type == "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide Password";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show Password";
    }
  });
}