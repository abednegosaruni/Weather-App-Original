var key = "";

// search
function getWeather(){
  var city = document.getElementById("city").value.trim();

  if(city === ""){
    document.getElementById("cityName").innerText = "Please enter a city name";
    return;
  }

  var safeCity = encodeURIComponent(city);
  fetchData("q=" + safeCity); 
}

// location
function getLocation(){
  navigator.geolocation.getCurrentPosition(function(pos){
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;

    fetchData("lat=" + lat + "&lon=" + lon); 
  }, function(){
    document.getElementById("cityName").innerText = "Location access denied";
  });
}

// fetch current weather
function fetchData(query){

  var url = "https://api.openweathermap.org/data/2.5/weather?" + query + "&appid=" + key + "&units=metric";

  fetch(url)
  .then(r=>r.json())
  .then(d=>{

    if(!d.main){
      document.getElementById("cityName").innerText = "City not found";
      document.getElementById("temp").innerText = "";
      document.getElementById("desc").innerText = "";
      document.getElementById("icon").src = "";
      return;
    }

    document.getElementById("cityName").innerText = d.name;
    document.getElementById("temp").innerText = Math.round(d.main.temp) + "°C";
    document.getElementById("desc").innerText = d.weather[0].description;
    document.getElementById("icon").src =
    "https://openweathermap.org/img/wn/"+d.weather[0].icon+"@2x.png";

    changeColor(d.main.temp, d.weather[0].icon);
    dayNight(d.weather[0].icon);
    rainEffect(d.weather[0].main);

    //  pass SAME query
    getForecast(query);

  })
  .catch(()=>{
    document.getElementById("cityName").innerText = "Error fetching data";
  });
}

// forecast
function getForecast(query){

  var url = "https://api.openweathermap.org/data/2.5/forecast?" + query + "&appid=" + key + "&units=metric";

  fetch(url)
  .then(r=>r.json())
  .then(d=>{

    if(!d.list){
      document.getElementById("forecast").innerHTML = "Forecast error";
      return;
    }

    var fHtml = "";

    for(var i=0;i<5;i++){
      var item = d.list[i*8];

      if(item){
        var day = new Date(item.dt_txt)
        .toLocaleDateString([], {month:'short', day:'numeric'});

        fHtml += "<div style='border:1px solid #ccc; padding:8px; margin:5px; border-radius:5px;'>"
        + day + "<br>" + Math.round(item.main.temp) + "°C</div>";
      }
    }

    document.getElementById("forecast").innerHTML = fHtml;

  })
  .catch(()=>{
    document.getElementById("forecast").innerHTML = "Error fetching forecast";
  });
}

// background color
function changeColor(temp, icon){
  var b = document.getElementById("body");
  var isNight = icon.includes("n");

  if(temp>30) b.style.background = isNight ? "darkorange" : "orange";
  else if(temp>20) b.style.background = isNight ? "darkblue" : "skyblue";
  else b.style.background = isNight ? "darkgray" : "lightgray";
}

// day/night
function dayNight(icon){
  document.body.style.color = icon.includes("n") ? "white" : "black";
}

// rain
function rainEffect(type){
  var rain = document.getElementById("rain");
  rain.innerHTML="";

  if(type=="Rain"){
    for(var i=0;i<50;i++){
      var drop=document.createElement("div");
      drop.className="rain-drop";
      drop.style.left=Math.random()*100+"%";
      drop.style.animationDuration=(Math.random()+0.5)+"s";
      rain.appendChild(drop);
    }
  }
}