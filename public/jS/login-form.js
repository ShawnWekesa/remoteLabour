console.log('hi')
const passwordInputFields = document.querySelectorAll('.password-input-field');
  emailInputFields = document.querySelectorAll('.email')
	forms = document.querySelectorAll(".form");
	links = document.querySelectorAll(".link");
  forgotPasswordLink = document.querySelector(".forgot-password-link");
  forgotPasswordForm = document.querySelector(".forgot-password");
  buttons = document.querySelectorAll(".form button");

passwordInputFields.forEach((passwordInput) => {
  const eyeOffIcon = passwordInput.parentElement.querySelector('ion-icon[name="eye-off-outline"]');
  const eyeIcon = passwordInput.parentElement.querySelector('ion-icon[name="eye-outline"]');

  eyeOffIcon.addEventListener('click', () => togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon));
  eyeIcon.addEventListener('click', () => togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon));
});

function togglePasswordVisibility(passwordInput, eyeOffIcon, eyeIcon) {
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    });
  });

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

forgotPasswordLink.addEventListener('click', () => {
  forgotPasswordForm.classList.remove('display-none');
  forms.forEach(form => {
    form.classList.add('display-none');
  })
});

const signUpForm = document.querySelector(".signup");
const signUpEmailInput = document.querySelector('.signup input[type="email"]');
const signUpPasswordInputs = document.querySelectorAll('.signup input[type="password"]');
const signUpButton = document.getElementById('sign-up-button');

function checkEmailInput(emailInput) {
  const email = emailInput.value;
  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  return true;
}


function checkPasswordInputs(passwordInputs) {
  const password1 = passwordInputs[0].value;
  const password2 = passwordInputs[1].value;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (password1 !== password2) {
    alert('Passwords do not match.');
    return false;
  }

  if (!passwordRegex.test(password1) || !passwordRegex.test(password2)) {
    alert('Password must have at least one capital letter, one number, and be more than eight characters long.');
    return false;
  }

  return true;
}


signUpButton.addEventListener('click', function(event) {

  if (checkEmailInput(signUpEmailInput) && checkPasswordInputs(signUpPasswordInputs)) {
    signUpForm.submit();
  }
  else{
    event.preventDefault();
  }
});

const signInForm = document.querySelector(".signin");
const signInEmailInput = document.querySelector('.signin input[type="email"]');
const signInPasswordInput = document.querySelector('.signin input[type="password"]');
const signInButton = document.getElementById('sign-in-button');

signInButton.addEventListener('click', function(event) {

  const signInPassword = signInPasswordInput.value;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (passwordRegex.test(signInPassword)) {
    signInForm.submit();
  } else {
    alert('Password must have at least one capital letter, one number, and be more than eight characters long.');
    event.preventDefault();
  }
});
