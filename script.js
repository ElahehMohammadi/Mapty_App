"use strict";

// prettier-ignore

//////////// SECTION CLASSES
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let map;
let mapEvent;

//////////// SECTION WORKOUT CLASS
class workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; // [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

//////////// SECTION RUNNING ANS CYCLING CLASSES
class running extends workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    // MIN/KM
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class cycling extends workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // KM/H
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// TESTING
// const run = new running([39, -12], 5.2, 24, 178);
// const cycle = new cycling([39, -12], 27, 95, 523);
// console.log(run, cycle);

//////////// SECTION variables

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//////////// SECTION APP CLASS
class App {
  #map;
  #mapEvent;
  #workout = [];
  constructor() {
    this._getPosition();

    //////////// SECTION FORM

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", function () {
      inputElevation
        .closest(".form__row")
        .classList.toggle("form__row--hidden");
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    });
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("could not get your posotion");
        }
      );
    }
  }
  _loadMap(posotion) {
    // console.log(posotion);
    const { latitude } = posotion.coords;
    const { longitude } = posotion.coords;
    // console.log(latitude, longitude);
    console.log(
      `https://www.google.com/maps/@${latitude},${longitude},14z?entry=ttu`
    );
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 13);
    console.log(this.#map);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //  handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  _toggleElevationField() {}

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    /// SUB SECTION form event (enter)
    e.preventDefault();

    /// SUB SECTION // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    /// SUB SECTION // check if the data is valid
    /// SUB SECTION // if workout is running, creat a running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // check if the data is valid

      // !Number.isFinite(distance) ||
      //   !Number.isFinite(duration) ||
      //   !Number.isFinite(cadence);
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers!");
      workout = new running([lat, lng], distance, duration, cadence);
    }
    /// SUB SECTION // if workout is cycling, creat a cycling object
    if (type == "cycling") {
      const elevation = +inputElevation.value;
      // check if the data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers!");
      workout = new cycling([lat, lng], distance, duration, elevation);
    }

    /// SUB SECTION // add new object to workout array
    this.#workout.push(workout);
    console.log(workout);
    /// SUB SECTION render workout on map as marker
    console.log(this.#mapEvent);
    this.renderWorkoutMarker(workout);

    /// SUB SECTION // render workout on list

    /// SUB SECTION // hide form + clear input fields

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
  }
  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`workout.distance`)
      .openPopup();
  }
}
//////////// SECTION class obj
const app = new App();
