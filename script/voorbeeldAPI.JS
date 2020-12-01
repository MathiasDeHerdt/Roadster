API_URL = "https://api.spacexdata.com/v3/roadster"

async function getRoadsterData(){
    // Get api and read data
    const response = await fetch(API_URL); // ik kan gewoon hier mijn api_url meegeven omdat het een globale variabele is
    const data = await response.json();

    console.log(data)
    
    // Get elements from api
    const name = data.name; 
    const date = data.launch_date_utc;
    const norad = data.norad_id;
    const epoch = data.epoch_jd;
    const apoapsis = data.periapsis_au;
    const periapsis = data.apoapsis_au;
    const periapsis_arg = data.periapsis_arg;
    const eccentricity = data.eccentricity;
    const inclination = data.inclination;
    const longitude = data.longitude;
    const days = data.period_days;
    const speed = data.speed_kph;
    const Edistance = data.earth_distance_km;
    const Mdistance = data.mars_distance_km;

    console.log(name)

    // ----- INFO -----
    // in mijn api heb ik dit
    //{
    // "name": "de naam"
    // "date": "de datum"
    // "noard_id": "het id"
    // }

    // dus aangezien dat mijn data gelijk is aan de response van mijn  json kan ik gewoon dit doen
    // const name = data.name
    // ----- INFO ------



    // Date yyyy-mm-dd converteren to dd-mm-yyyy
    const dateSplit = date.split('T')[0]
    const dateOld = dateSplit.split('-')
    const newDate = [dateOld[2],dateOld[1],dateOld[0]].join("-");

    const formattedSpeed = `${Math.round((speed*100)/100)} km/u`
    const formattedDate = `${newDate}`
    const formattedDays = `${Math.floor(days)} days`
    const formattedEarthDistance = `${Math.floor(Edistance)} km`
    const formattedMarsDistance = `${Math.floor(Mdistance)} km`

    // Send data to html
    document.getElementById('Speed_Roadster').innerHTML = formattedSpeed; // VOORBEELD VAN HTML WAAR IK MIJN SPEED DISPLAY ---> <li id="Speed_Roadster" style="color: #6483ff;">Speed </li>
    document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
    document.getElementById('Days_Roadster').innerHTML = formattedDays
    document.getElementById('DistanceEarth').innerHTML = formattedEarthDistance
    document.getElementById('DistanceMars').innerHTML = formattedMarsDistance

    // Function with data from api that draws roadsters orbit | hier stuur ik mijn data van mijn api door naar een functie die de data nodig heeft
    Roadster(apoapsis, periapsis, eccentricity)
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded")
    getRoadsterData()
});