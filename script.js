"use strict"

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form")
const containerWorkouts = document.querySelector(".workouts")
const inputType = document.querySelector(".form__input--type")
const inputDistance = document.querySelector(".form__input--distance")
const inputDuration = document.querySelector(".form__input--duration")
const inputCadence = document.querySelector(".form__input--cadence")
const inputElevation = document.querySelector(".form__input--elevation")
// let map, mapEvent
// navigator.geolocation.getCurrentPosition(
//   (position) => {
//     const { latitude, longitude } = position.coords
//     console.log(latitude)
//     console.log(longitude)
//     const coords = [latitude, longitude]
//     //console.log(`https://www.google.co.in/maps/@${latitude},${longitude},7z`)
//     map = L.map("map").setView(coords, 13)

//     L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(map)
//     map.on("click", function (mapE) {
//       form.classList.remove("hidden")
//       inputDistance.focus()
//       mapEvent = mapE
//       console.log(mapEvent)
//     })
//   },
//   () => {
//     alert("Couldn't get the user location details")
//   }
// )

// form.addEventListener("submit", (e) => {
//   e.preventDefault()

//   inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ""
//   const { lat, lng } = mapEvent.latlng
//   console.log(lat, lng)
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 300,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Workouts")
//     .openPopup()
// })

// inputType.addEventListener("change", () => {
//   inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
//   inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
// })

//with Class Version

class App {
  #map
  #mapEvent
  constructor() {
    //why i am calling here
    //bacuse contructor function calls immediately with we have to call manually
    this._getPosition()
    form.addEventListener("submit", this._newWorkouts.bind(this))
    inputType.addEventListener("change", this._toggleElevationField)
  }
  _getPosition() {
    //here this_loadMap() is undefined because it's consider as regular function call
    //so we need to bind the this scope to this function
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
      alert("Couldn't get the user location details")
    })
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords
    console.log(latitude)
    console.log(longitude)
    const coords = [latitude, longitude]
    console.log(this)
    //console.log(`https://www.google.co.in/maps/@${latitude},${longitude},7z`)
    this.#map = L.map("map").setView(coords, 13)

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map)
    this.#map.on("click", this._showForm.bind(this))
  }
  _newWorkouts(e) {
    e.preventDefault()

    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ""
    const { lat, lng } = this.#mapEvent.latlng
    console.log(lat, lng)
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workouts")
      .openPopup()
  }
  _showForm(mapE) {
    console.log("thisKeyword", this)
    form.classList.remove("hidden")
    inputDistance.focus()
    this.#mapEvent = mapE
  }
  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
  }
}

const app = new App()
