const timeE1 = document.getElementById("time");
const dateE1 = document.getElementById("date");
const currentWeatherItemE1 = document.getElementById("current-weather-items");
const timezoneE1 = document.querySelector(".time-zone");
const latlongE1 = document.getElementById("lat-long");
const WeatherForcastE1 = document.getElementById("weather-forcast");
const currentTempE1 = document.getElementById("current-tempi");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

const api_key = "8f8c2675fa275e6ce2ec39c2252522ba";

searchButton.onclick = async function () {
  const API_KY = "e1baf2089bd1253081f3b24fa4d7091a";
  //   const current = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=b0e89df602025b1b2525a9bd5f0c21d8`;
  //   const hourly = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${search}&appid=b0e89df602025b1b2525a9bd5f0c21d8`;  
  const exclude = "minutely,alerts";
  console.log(searchInput.value);
  const latlonuri = `https://api.opencagedata.com/geocode/v1/json?q=${searchInput.value}&key=145e7f38029f4154aed6b982da60cb61`
  const latlonres = await fetch(latlonuri);
  const latlondata = await latlonres.json();
  const { lat, lng } = latlondata?.results?.[0]?.geometry;
  // timezoneE1.innerHTML = latlondata.data[0].name;

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&units=metric&appid=${api_key}
`)
    .then((response) => response.json())
    .then((data) => {
      fetch(
        `https://api.waqi.info/feed/${searchInput.value}/?token=0af3d4296b8fc5120c2c14d50c50bf1431c7cb9f`
      )
        .then((resp) => resp.json())
        .then((d) => {
          aqi = d?.data?.aqi;
          console.log(d?.data?.aqi);
          data = { ...data, aqi: aqi };
          timezoneE1.innerHTML = data.timezone;
          searchInput.value = "";
          showdata(data);
        });
    });
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hours12 = hour >= 13 ? hour % 12 : hour;
  const minute = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeE1.innerHTML =
    (hours12 < 10 ? "0" + hours12 : hours12) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    `<span id="am-pm">${ampm}</span>`;
  dateE1.innerHTML = days[day] + "," + date + " " + months[month];
}, 1000);

if (searchInput.value == "") {
  getData();
  console.log("called");
}

function getData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${api_key}
`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        timezoneE1.innerHTML = data.timezone;
        showdata(data);
      });
  });
}

function showdata(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  latlongE1.innerHTML = data.lat + "N" + "  " + data.lon + "E";

  currentWeatherItemE1.innerHTML = ` <div class="weather-items">
                               <div>AQI</div>
                               <div>${data.aqi ? data.aqi : 90}</div>
                          </div>
                         <div class="weather-items">
                              <div>Humidity</div>
                               <div>${humidity}%</div>
                            </div>
                          <div class="weather-items">
                               <div>Pressure</div>
                               <div>${pressure}</div>
                            </div>

                          <div class="weather-items">
                               <div>Wind Speed</div>
                               <div>${wind_speed}</div>
                          </div>
                         <div class="weather-items">
                               <div>Sunrise</div>
                               <div>${window
      .moment(sunrise * 1000)
      .format("HH:mm a")}</div>
                          </div >
                            <div class="weather-items">
                               <div>Sunset</div>
                               <div>${window
      .moment(sunset * 1000)
      .format("HH:mm a")}</div>
                          </div>`;

  let futureforcasting = "";
  data.daily.forEach((day, ind) => {
    if (ind == 0) {
      currentTempE1.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon
        }@2x.png" alt="w" class="w-icon">
                <div class="other">   
                <div class="day">${window
          .moment(day.dt * 1000)
          .format("ddd")}</div>
                <div class="temp">Day- ${day.temp.day}&#176</div>
                <div class="temp">Night- ${day.temp.night}&#176</div>
                </div>`;
    } else {
      futureforcasting += `<div class="weather-forcast-item">
                 <div class="day">${window
          .moment(day.dt * 1000)
          .format("ddd")}</div>
                 <img src="http://openweathermap.org/img/wn/${day.weather[0].icon
        }@2x.png" alt="" class="w-icon">
                 <div class="temp">Day- ${day.temp.day}&#176</div>
                <div class="temp">Night- ${day.temp.night}&#176</div>
                </div>`;
    }
  });
  WeatherForcastE1.innerHTML = futureforcasting;
}
