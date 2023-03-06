console.log('hi')
const passwordInputFields = document.querySelectorAll('.password-input-field');
	forms = document.querySelectorAll(".form");
	links = document.querySelectorAll(".link");
  forgotPasswordLink = document.querySelector(".forgot-password-link");
  forgotPasswordForm = document.querySelector(".forgot-password");

passwordInputFields.forEach((passwordInput) => {
  const eyeOffIcon = passwordInput.parentElement.querySelector('ion-icon[name="eye-off-outline"]');
  const eyeIcon = passwordInput.parentElement.querySelector('ion-icon[name="eye-outline"]');

  eyeOffIcon.addEventListener('click', () => togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon));
  eyeIcon.addEventListener('click', () => togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon));
});

function togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon) {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeOffIcon.classList.add('opacity-null');
    eyeIcon.classList.remove('opacity-null');
  } else {
    passwordInput.type = 'password';
    eyeOffIcon.classList.remove('opacity-null');
    eyeIcon.classList.add('opacity-null');
  }
}

links.forEach(link => {
	link.addEventListener("click", () =>{
		forms.forEach(form => {
			form.classList.toggle('display-none')
		})
	})
});

forms.forEach(form => {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
  });
});

forgotPasswordLink.addEventListener('click', () => {
  forgotPasswordForm.classList.remove('display-none');
  forms.forEach(form => {
    form.classList.add('display-none');
  })
});