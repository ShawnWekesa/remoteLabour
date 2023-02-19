console.log("hi");

const searchBox = document.querySelector("#search");
      searchIcon = document.querySelector(".search ion-icon");
      form = document.querySelector("form");

searchIcon.addEventListener("click", () =>{
	searchBox.classList.toggle("hide");
})
form.preventDefault();