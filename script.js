"use strict"

// prettier-ignore

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
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class Workouts {
  date = new Date()
  id = (Date.now() + "").slice(-10)
  constructor(coords, distance, duration) {
    this.coords = coords
    this.distance = distance
    this.duration = duration
  }
  _setDescription() {
    return (this.descriptionDate = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`)
  }
}

class Running extends Workouts {
  type = "running"
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
    this._setDescription()
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance
    return this.pace
  }
}

class Cycling extends Workouts {
  type = "cycling"
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration)
    this.elevationGain = elevationGain
    this.calcSpeed()
    this._setDescription()
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60)
    return this.speed
  }
}

// const running1 = new Running([12, 45.6], 5.7, 29, 187)
// console.log(running1)
// const cycling1 = new Cycling([12, 45.6], 38, 79, 387)
// console.log(cycling1)
class App {
  #map
  #mapEvent
  #workouts = []
  constructor() {
    //why i am calling here
    //bacuse contructor function calls immediately with we have to call manually
    this._getPosition()
    form.addEventListener("submit", this._newWorkouts.bind(this))
    inputType.addEventListener("change", this._toggleElevationField)
    containerWorkouts.addEventListener("click", this._moveToPopUp.bind(this))
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

    // helper functions

    const validInputs = (...inputs) => inputs.every((input) => Number.isFinite(input))
    const allPositive = (...inputs) => inputs.every((input) => input > 0)

    //get the data values

    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    let workout
    // alert(type)

    const { lat, lng } = this.#mapEvent.latlng
    console.log(lat, lng)

    //check the validation

    //if workout is running
    if (type === "running") {
      const cadence = +inputCadence.value

      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        alert("The number should be in postive")
      }
      workout = new Running([lat, lng], distance, duration, cadence)
    }

    // if workout is cycling
    if (type === "cycling") {
      const elevation = +inputElevation.value

      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) {
        alert("The number should be in postive")
      }
      workout = new Cycling([lat, lng], distance, duration, elevation)
    }
    console.log("workout", workout)
    //create new Object into workout array
    this.#workouts.push(workout)

    this._renderWorkoutMarker(workout)
    this._renderWorkout(workout)
    // console.log(this.#workout)
    this._hideForm()
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.descriptionDate}`)
      .openPopup()
  }
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.descriptionDate}</h2>
          <div class="workout__details">
            <span class="workout__icon"> ${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`
    if (workout.type === "running") {
      html += `
           <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `
    }
    if (workout.type === "cycling") {
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `
    }
    form.insertAdjacentHTML("afterend", html)
  }
  _showForm(mapE) {
    console.log("thisKeyword", this)
    form.classList.remove("hidden")
    inputDistance.focus()
    this.#mapEvent = mapE
  }

  _hideForm() {
    form.style.display = "none"
    form.classList.add("hidden")
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ""
    setTimeout(() => (form.style.display = "grid"), 1000)
  }
  _moveToPopUp(e) {
    const workoutEle = e.target.closest(".workout")
    console.log(workoutEle)
    console.log("workouts", this.#workouts)
    if (!workoutEle) return
    const selectedWorkout = this.#workouts.find((workout) => workout.id === workoutEle.dataset.id)
    console.log(selectedWorkout)
    this.#map.setView(selectedWorkout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    })
  }
  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
  }
}

const app = new App()
