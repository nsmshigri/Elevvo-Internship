// Scroll reveal animation
const reveals = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target); // animate only once
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// Example CTA button click
const ctaBtn = document.getElementById("ctaHero");
if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    alert("Thanks for your interest! Redirecting to pricing...");
  });
}
