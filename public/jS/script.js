console.log("hi");

const searchBox = document.querySelector("#search");
      searchIcon = document.querySelector(".search ion-icon");
      form = document.querySelector("form");
      nav = document.querySelector("nav");
      divs = document.querySelectorAll("section > div");
      image = document.querySelector("section > div .images img");

searchIcon.addEventListener("click", () =>{
	searchBox.classList.toggle("hide");
})

divs.forEach(div => {
  div.addEventListener('mouseenter', () => {
    const backgroundColor = window.getComputedStyle(div).backgroundColor;
    nav.style.backgroundColor = backgroundColor;
    nav.style.boxShadow = 'none';
  });
});

divs.forEach(div => {
  div.addEventListener('mouseleave', () => {
    nav.style.backgroundColor = ''; 
    nav.style.boxShadow = ''; 
  });  
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    nav.style.backgroundColor = 'white'; 
  } else {
    nav.style.backgroundColor = ''; 
  }
});

var lazyLoadInstance = new LazyLoad({
    elements_selector: "img"
  });