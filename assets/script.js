let city = "Salt Lake City"
let units = "imperial"
let apiID = "2d43ab4d082a446e6c0b7f98cdd694f5"

window.onload = function () {

    searchButton()
    searchHistory()

    // search local storage to return the last result on page refresh otherwise use default value. 
    if (localStorage.length > 0) {
        getCityWeather(String(Object(localStorage[Object.keys(localStorage)[0]])), units, apiID)
        fiveDayforecast(String(Object(localStorage[Object.keys(localStorage)[0]])), units, apiID)
    } else {
        getCityWeather(city, units, apiID)
        fiveDayforecast(city, units, apiID)
    }


}


function searchHistory() {

    let keys = Object.keys(localStorage)

    let citiesSearched = document.querySelector(".searched-cities")

    // clear items prior to draw
    while (citiesSearched.firstChild) {
        citiesSearched.removeChild(citiesSearched.firstChild)
    }


    for (const elm of keys) {

        let p = document.createElement("p")
        citiesSearched.appendChild(p)

        let searchedButton = document.createElement("button")
        searchedButton.setAttribute("class", "btn btn-primary")
        searchedButton.innerText = elm
        p.appendChild(searchedButton)

        searchedButton.addEventListener("click", function () {
            getCityWeather(elm, units, apiID)
            fiveDayforecast(elm, units, apiID)

        })

    }
}

function searchButton(city) {

    let sButton = document.querySelector("#search-btn")
    sButton.addEventListener("click", function (event) {
        event.preventDefault()

        city = document.querySelector("#search-entry").value
        getCityWeather(city, units, apiID)
        fiveDayforecast(city, units, apiID)

        // add weather to local storage
        localStorage.setItem(city, city)
        searchHistory()


    })
}


function getCityWeather(city, units, apiID) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiID}&units=${units}`)
        .then(response => {

            if (response.ok) {
                return (response.json())
            } else {
                throw new error("The call was not completed succesfully")
            }


        })
        .then(data => {
            //jsonHandler(data)
            //return data
            let weatherData = data

            let lon = data.coord.lon
            let lat = data.coord.lat

            fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiID}`)
                .then(response => {
                    if (response.ok) {
                        return (response.json())
                    } else {
                        throw new error("The call was not completed succesfully")
                    }
                }).then(data => {
                    jsonHandler(weatherData, data)
                })


        })
        .catch(error => {
            console.log("error", error)

        });

}


function jsonHandler(data, uvData) {

    let city = data.name
    let temp = data.main.temp
    let icon = data.weather[0].icon

    let currentWeather = document.getElementById("current-weather")
    // clear old results from Dom
    while (currentWeather.firstChild) {
        currentWeather.removeChild(currentWeather.lastChild)
    }

    uvValue = uvData.value
    //draw elements to page
    let currentCard = document.createElement("div")
    currentCard.setAttribute("class", "card weather-card")
    currentWeather.appendChild(currentCard)

    let currentCardBody = document.createElement("div")
    currentCardBody.setAttribute("class", "card-body")
    currentCardBody.innerHTML = (`<h2>${city} Weather <span><img src="https://openweathermap.org/img/wn/${icon}@2x.png"></span></h2><p class="card-text">Tempreture: ${temp} F <br> WindSpeed ${data.wind.speed} MPH <br>Humidity: ${data.main.humidity}%</p>`)
    currentCard.appendChild(currentCardBody)

    let uvIndex = document.createElement("div")
    uvIndex.setAttribute("class", "card-text")
    uvIndex.innerHTML = (uvIndex)
    currentCardBody.appendChild(uvIndex)
    uvIndex.innerHTML = (`UV Index: ${uvValue}`)
    // style uv element
    if (uvValue < 3) {
        uvIndex.classList.remove("med-uv-index", "high-uv-index")
        uvIndex.setAttribute("class", "low-uv-index")

    } else if (uvValue > 3 && uvValue < 8) {
        uvIndex.classList.remove("low-uv-index", "high-uv-index")
        uvIndex.setAttribute("class", "med-uv-index")

    } else if (uvValue > 8) {
        uvIndex.classList.remove("low-uv-index", "med-uv-index")
        uvIndex.setAttribute("class", "high-uv-index")
    }

}

function fiveDayforecast(city, units, apiID) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiID}&units=${units}`)
        .then(response => {
            if (response.ok) {
                return (response.json())
            } else {
                throw new error("Call did not complete succesfully")
            }


        })
        .then(data => {
            fiveDayJson(data)

        })
        .catch(error => console.log('error', error));

}

function fiveDayJson(data) {

    let fiveDay = document.querySelector("#forecast")

    // clear old results from Dom
    while (fiveDay.firstChild) {
        fiveDay.removeChild(fiveDay.lastChild)
    }

    let fiveDayHeader = document.createElement("h1")
    fiveDayHeader.innerText = "5-Day Forecast:"
    fiveDay.appendChild(fiveDayHeader)



    for (let i = 0; i < data.list.length; i = i + 8) {

        let column = document.createElement("div")
        column.setAttribute("class", "col-md forecast-item-holder")
        fiveDay.append(column)

        let card = document.createElement("div")
        card.setAttribute("class", "card five-day-card")
        column.appendChild(card)


        let cardBody = document.createElement("div")
        cardBody.setAttribute("class", "card-body")
        cardBody.innerHTML = (`<h5 class="card-title">${data.list[i].dt_txt} <span><img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"></span></h5> <p>Min Temp: ${data.list[i].main.temp_min} <br> Max Temp: ${data.list[i].main.temp_max} <br> Humidity: ${data.list[i].main.humidity}%</p>`)
        card.appendChild(cardBody)


    }

}