"use strict";

// prettier-ignore

//////////// SECTION CLASSES
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map;
let mapEvent;

//////////// SECTION APP CLASS
class App {
  constructor() {}
  _getPosition() {}
  _loadMap() {}
  _showForm() {}
  _toggleElevationField() {}
  _newWorkout() {}
}
//////////// SECTION API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (posotion) {
      // console.log(posotion);
      const { latitude } = posotion.coords;
      const { longitude } = posotion.coords;
      // console.log(latitude, longitude);
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},14z?entry=ttu`
      );
      const coords = [latitude, longitude];
      map = L.map("map").setView(coords, 13);
      console.log(map);

      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //  handling clicks on map
      map.on("click", function (mapE) {
        form.classList.remove("hidden");
        inputDistance.focus();
        mapEvent = mapE;
      });
    },
    function () {
      alert("could not get your posotion");
    }
  );
}

//////////// SECTION FORM

form.addEventListener("submit", function (e) {
  /// SUB SECTION form event (enter)
  e.preventDefault();

  /// SUB SECTION clear input fields

  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";

  /// SUB SECTION display marker
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxwidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("workout")
    .openPopup();
});

inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
