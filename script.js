"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//////////// SECTION API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (posotion) {
      // console.log(posotion);
      const { latitude } = posotion.coords;
      const { longitude } = posotion.coords;
      // console.log(latitude, longitude);+
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},14z?entry=ttu`
      );
      const coords = [latitude, longitude];
      const map = L.map("map").setView(coords, 13);
      console.log(map);

      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (mapEvent) {
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
    },
    function () {
      alert("could not get your posotion");
    }
  );
}
