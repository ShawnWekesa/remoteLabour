const searchBox = document.querySelector("#search");
      searchIcon = document.querySelector(".search ion-icon");

searchIcon.addEventListener("click", () =>{
	searchBox.classList.toggle("hide");
})