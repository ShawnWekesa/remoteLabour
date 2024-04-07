console.log("hi");

const searchBox = document.querySelector("#search");
      searchIcon = document.querySelector(".search i");
      form = document.querySelector("form");
      nav = document.querySelector("nav");
      divs = document.querySelectorAll("section > div");
      image = document.querySelector("section > div .images img");
      open = document.querySelector("ion-icon[name=menu-outline]");
      close = document.querySelector("ion-icon[name=close-outline]");
      logo = document.querySelector(".logo")
      

searchIcon.addEventListener("click", () =>{
	searchBox.classList.toggle("hide");
  if (searchIcon.classList.contains("bx-search")) {
    searchIcon.classList.replace("bx-search", "bx-x");
  }else{
    searchIcon.classList.replace("bx-x", "bx-search");
  }
})

// divs.forEach(div => {
//   div.addEventListener('mouseenter', () => {
//     const backgroundColor = window.getComputedStyle(div).backgroundColor;
//     nav.style.backgroundColor = backgroundColor;
//     nav.style.boxShadow = 'none';
//   });
// });

// divs.forEach(div => {
//   div.addEventListener('mouseleave', () => {
//     nav.style.backgroundColor = 'white';
//     nav.style.boxShadow = '.1em .01em .3em .001em rgba(0, 0, 0, .5)'; 
//   });  
// });

let ticking = false;

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (window.scrollY > 0) {
        nav.style.boxShadow = '.1em .01em .3em .001em rgba(0, 0, 0, .5)';
      } else {
        nav.style.boxShadow = 'none'; 
      }
      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener('scroll', handleScroll);


