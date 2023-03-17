const closeButton = document.querySelector('.popup-content ion-icon');
	profilePopupContent = document.querySelector('.popup-content');
	pfpPopupToggle = document.querySelector('.popup-toggle'); 


pfpPopupToggle.addEventListener("click", () => {
	profilePopupContent.style.display = "block";
})	

closeButton.addEventListener("click", () => {
	profilePopupContent.style.display = "none";
})