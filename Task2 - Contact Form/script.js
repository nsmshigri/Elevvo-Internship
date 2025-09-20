const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault(); 

  
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  
  if (!fullName || !email || !subject || !message) {
    formMessage.textContent = "All fields are required!";
    formMessage.className = "error";
    return;
  }

  
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.className = "error";
    return;
  }

  
  formMessage.textContent = "Message sent successfully!";
  formMessage.className = "success";

  
  form.reset();
});
