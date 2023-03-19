const closeButton = document.querySelector('.popup-content ion-icon');
	profilePopupContent = document.querySelector('.popup-content');
	pfpPopupToggle = document.querySelector('.popup-toggle'); 
	userLocation = document.querySelector('.user-location');


pfpPopupToggle.addEventListener("click", () => {
	profilePopupContent.style.display = "block";
})	

closeButton.addEventListener("click", () => {
	profilePopupContent.style.display = "none";
})

