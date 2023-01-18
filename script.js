const baseURL="https://api.weatherapi.com/v1/forecast.json?key=fe1f796ba667403f8cc85817231801";
const searchtag=document.getElementById('searchtag');
const searchButton=document.getElementById('searchButton');
const alertPlaceholder=document.getElementById('liveAlertPlaceholder');
let country=document.getElementById('country');
let latLontag=document.getElementsByTagName('small');
let minTemperature=document.getElementById('minTemperature');
let avgTemperature=document.getElementById('avgTemperature');
let maxTemperature=document.getElementById('maxTemperature');
let humidity=document.getElementById('humidity');
let windSpeed=document.getElementById('windSpeed');
let description=document.getElementById('description');
let sunrise=document.getElementById('sunrise');
let sunset=document.getElementById('sunset');
let timetag=document.getElementById('time');
let mainDiv=document.getElementsByClassName('mainDiv');

let carddivs=document.getElementsByClassName('card');
let cardbodydivs=document.getElementsByClassName('card-body');

//let day1img=document.getElementById('day1img');
//let day1airquality=document.getElementById('day1airquality');
//let day1moonrise=document.getElementById('day1moonrise');
//let day1moonset=document.getElementById('day1moonset');

let result={};

/*
    alert function takes the message and type of message as inputs and
    display the type of error in the window screen
*/
let alert = (message, type) => {
    const wrapper=document.createElement('div');
    wrapper.innerHTML=[
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `<div>${message}</div>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
}

/*
    Here we have added a EventListener to searchButton icon in input feild
    to search for the location
*/
searchButton.addEventListener('click', function() {
    const location=searchtag.value;
    if(location==='') {
        alert('Please enter the location', 'danger');
        return;
    } else {
        getWheatherDetails(location);
    }
})

/*
    Below function fetches the wheather details of a particular location
    and appends the relavent details to the HTML Body
*/
const getWheatherDetails=async (location) => {
    try {
        const response=await fetch(`${baseURL}&q=${location}&days=3&aqi=yes&alerts=no`);
        result=await response.json();
        //console.log('result', result)
        if(result?.error?.message!=='No matching location found.') {
            /*
                result.location.localtime.split(' ')[1] it fetches the local time of a location

            */
            let time=result.location.localtime.split(' ')[1];
            let hourstime=time.split(':')[0];
            let minutestime=time.split(':')[1];
            /*
                Below lines convert the 24 hours to 12 hours format
            */
            let AmorPm=hourstime>=12? 'PM':'AM';
            hourstime=(hourstime%12)||12;
            let finaltime=hourstime+':'+minutestime+" "+AmorPm;
            timetag.innerHTML=finaltime;
            //  Appends the location's name and region
            country.innerHTML=`${result?.location?.name}/${result?.location.region}`;
            //  Appends the location's latitude and longitude
            latLontag[0].innerHTML=`${result?.location.lat}<sup>.</sup>N,${result?.location.lon}<sup>.</sup>E`;
            setTableDetails(result, 0);
            let len = result.forecast.forecastday
            for(let index=0; index<len.length; index++){
                // here we have added a onclick event to every card
                // to show relavent details of a particular day of a given location
                carddivs[index].onclick=function() {
                    setTableDetails(result, index);
                }
                //  Below 2 lines is used to get the particular day from provided input date
                const d = new Date(result.forecast.forecastday[index].date);
                let day=getday(d.getDay());
                cardbodydivs[index].remove();
                let airQuality = "Moderate"
                /*
                    here we have created a div element and added a bootstrap class "card-body"
                    and added the relavent details such as image/icon , Day , AirQuality of the 
                    given date, rise of moon and set of moon of the given date
                */
                let wrapper=document.createElement('div');
                wrapper.classList.add('card-body');
                //wrapper.innerHTML = ''
                let src="https:"+result.forecast.forecastday[index].day.condition.icon;
                wrapper.innerHTML=[
                    `<h5 class="card-title">${day}</h5>`,
                    `<img src=${src} class="" alt=${result.forecast.forecastday[index].day.condition.text}>`,
                    `<p class="card-title">AirQuality: ${airQuality}</p>`,
                    `<p class="card-text">Moonrise: ${result.forecast.forecastday[index].astro.moonrise}</p>`,
                    `<p class="card-text">Moonset: ${result.forecast.forecastday[index].astro.moonset}</p>`
                ].join('');
                carddivs[index].appendChild(wrapper);
            }
        } else {
            /*
                error message is shown when an invalid location name is entered in search input feild
            */
            alert(result.error.message, 'danger');
        }
    } catch(error) {
        alert(error.message, 'danger');
    }
}

/*
    below function gives us the shorthand form of AirQuality details
*/
function checkAirQuality(data,index) {
    let airQuality='';
    if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===1) {
        airQuality='Good';
    }
    else if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===2) {
        airQuality='Moderate';
    }
    else if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===3) {
        airQuality='Unhealthy for Sensitive People';
    }
    else if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===4) {
        airQuality='Unhealthy';
    }
    else if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===5) {
        airQuality='Very Unhealthy';
    }
    else if(data.forecast.forecastday[index].day.air_quality["us-epa-index"]===6) {
        airQuality='Hazardous';
    }
    return airQuality;
}

/*
    Below function updates the table with required information
    and sets the background image according to the wheather on that day.
*/

const setTableDetails=(data,index) => {
    minTemperature.innerHTML=`${data.forecast.forecastday[index].day.mintemp_c}<sup>.</sup>C`;
    maxTemperature.innerHTML=`${data.forecast.forecastday[index].day.maxtemp_c}<sup>.</sup>C`;
    humidity.innerHTML=`${data.forecast.forecastday[index].day.avghumidity}%`;
    windSpeed.innerHTML=`${data.forecast.forecastday[index].day.maxwind_kph} kph`;
    description.innerHTML=`${data.forecast.forecastday[index].day.condition.text}`;
    sunrise.innerHTML=`${data.forecast.forecastday[index].astro.sunrise}`;
    sunset.innerHTML=`${data.forecast.forecastday[index].astro.sunset}`;
    for(let i=0; i<carddivs.length; i++){
        carddivs[i].classList.remove('presentday');
    }
    carddivs[index].classList.add('presentday')
    setBackgroundImage(data.forecast.forecastday[index].day.condition.text);
}


function getday(day) {
    let daystr=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daystr[day];
}

/*
    below function sets the relavent background image according to the wheather conditions on the given location
*/
function setBackgroundImage(data) {
    if(data.toLowerCase()==='sunny') {
     mainDiv[0].style.backgroundImage="url(./images/sunnyimage-2.jpg)"; 
    }
    else if(data.toLowerCase()==='partly cloudy' || data.toLowerCase()==='cloudy' || data.toLowerCase()==='overcast') {
        mainDiv[0].style.backgroundImage="url(./images/cloudyimage-1.jpg)"; 
    }
    else if(data.toLowerCase()==='heavy rain' || data.toLowerCase()==='moderate rain' || data.toLowerCase()==='light freezing rain') {
         mainDiv[0].style.backgroundImage="url(./images/Heavyrainimage-2.jpg)"; 
    }
    else if(data.toLowerCase()==='patchy rain possible') {
        mainDiv[0].style.backgroundImage="url(./images/rainpossibleimage-1.jpg)";
    }
    else if(data.toLowerCase()==='mist' || data.toLowerCase()==='freezing fog') {
        mainDiv[0].style.backgroundImage="url(./images/mistimage-1.jpg)";
    }
    else if(data.toLowerCase()==='patchy light snow' || data.toLowerCase()==='moderate or heavy snow showers') {
        mainDiv[0].style.backgroundImage="url(./images/snowfallimage-3.jpg)";
    }
    mainDiv[0].style.backgroundPosition="center";
    mainDiv[0].style.backgroundRepeat="no-repeat";
    mainDiv[0].style.backgroundSize = "cover";  
}




