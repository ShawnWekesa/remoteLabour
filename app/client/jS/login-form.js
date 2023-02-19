console.log('hi')
const eyeIcon = document.querySelectorAll('ion-icon');
	passwordField = document.querySelectorAll(".password");
	forms = document.querySelectorAll("form");
	links = document.querySelectorAll(".link");


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
