console.log("hi");

const searchBox = document.querySelector("#search");
      searchIcon = document.querySelector(".search ion-icon");
      form = document.querySelector("form");
      nav = document.querySelector("nav");
      divs = document.querySelectorAll("section > div");

      console.log(divs)

searchIcon.addEventListener("click", () =>{
	searchBox.classList.toggle("hide");
})

divs.forEach(div => {
  div.addEventListener('mouseenter', () => {
    const backgroundColor = window.getComputedStyle(div).backgroundColor;
    nav.style.backgroundColor = backgroundColor;
  });
});