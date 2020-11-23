API_URL = "https://api.spacexdata.com/v3/roadster"

const total = 300

const cox = total;
const coy = total;
const le = total; 

async function getRoadsterData(){
    // api ophalen en inlezen
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // elementen uit api halen
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

    // Datum yyyy-mm-dd converteren naar dd-mm-yyyy
    const dateSplit = date.split('T')[0]
    const dateOld = dateSplit.split('-')
    const newDate = [dateOld[2],dateOld[1],dateOld[0]].join("-");

    // gegevens klaarzetten om door te sturen naar html
    const formattedSpeed = `Speed: ${Math.round((speed*100)/100)} km/u`
    const formattedDate = `Launch date: ${newDate}`
    const formattedDays = `Days in space: ${Math.floor(days)} days`
    const formattedEarthDistance = `Distance from Earth: ${Math.floor(Edistance)} km`
    const formattedMarsDistance = `Distance from Mars: ${Math.floor(Mdistance)} km`

    // gegevens naar html doorsturen
    document.getElementById('Speed_Roadster').innerHTML = formattedSpeed;
    document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
    document.getElementById('Days_Roadster').innerHTML = formattedDays
    document.getElementById('DistanceEarth').innerHTML = formattedEarthDistance
    document.getElementById('DistanceMars').innerHTML = formattedMarsDistance

    // roadster zijn baan maken met gegevens uit api
    Roadster(apoapsis, periapsis, eccentricity)
}

const drawXYaxes = function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const zerocox = 300
    const zerocoy = 300
 
    // Draw the x-axis
    ctx.beginPath();
    ctx.setLineDash([5, 1]);
    ctx.strokeStyle = "transparant";
    // ctx.strokeStyle = "Transparant";
    ctx.moveTo(0, zerocoy);
    ctx.lineTo(zerocox*2, zerocoy);
    ctx.stroke();

    // Draw the y-axis
    ctx.beginPath();
    ctx.setLineDash([5, 1]);
    ctx.moveTo(zerocox, 0);
    ctx.lineTo(zerocox, zerocoy*2);
    ctx.stroke();
}


const drawPlanet = function(planet, clr, angle, cox, coy, le){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const zerocox = cox
    const zerocoy = coy
 
    //angle = angle + 45
    angle = angle * (-1)
    // console.log("angle = " + angle)

    length =  le;

    x1 = zerocox
    y1 = zerocoy

    x2 = x1 + Math.cos((Math.PI / 180.0) * (angle)) * length
    y2 = y1 + Math.sin((Math.PI / 180.0) * (angle)) * length

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = clr;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

const drawPlanetOrbit = function(Planet, Clr, X, MaA, MiA, cox, coy){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // console.log(X)
    // console.log(MaA)
    // console.log(MiA)

    const zerocox = cox
    const zerocoy = coy

    X = zerocox + X
    Y = zerocoy
    // console.log(X)
    
    ctx.setLineDash([1, 0]);
    ctx.strokeStyle = Clr;

    var radiusx = MaA/2;
    var radiusy = MiA/2;
    ctx.beginPath();
    ctx.ellipse(X, Y, radiusx, radiusy, 0, 0, 2 * Math.PI);
    
    ctx.stroke();
}

var Earth = function(){
    const EarthPeriApsisKM = 147098291
    const EarthApoApsisKM = 152098233
    const DivisionFactor = 1000000

    const EarthEccentricity = (EarthApoApsisKM-EarthPeriApsisKM)/(EarthApoApsisKM+EarthPeriApsisKM)
    const EarthMajorAxisKM = EarthApoApsisKM + EarthPeriApsisKM
    const EarthSemiMajorAxisKM = EarthMajorAxisKM / 2

    const EarthSemiMinorAxisKM = EarthSemiMajorAxisKM * Math.sqrt(1-(EarthEccentricity*EarthEccentricity))
    const EarthMinorAxisKM = EarthSemiMinorAxisKM * 2
    const EarthCentralPointKMY = 0
    const EarthCentralPointKMX = -EarthApoApsisKM + EarthSemiMajorAxisKM

    const EarthCentralPointXDivided = EarthCentralPointKMX / DivisionFactor
    const EarthMajorAxisDivided = EarthMajorAxisKM / DivisionFactor
    const EarthMinorAxisDivided = EarthMinorAxisKM / DivisionFactor

    drawPlanetOrbit("Earth","#6483ff", EarthCentralPointXDivided, EarthMajorAxisDivided, EarthMinorAxisDivided, cox, coy)
    drawPlanet("Earth", "#6483ff", 61, cox, coy, le)
}

var Mars = function(){
    const MarsPeriApsisKM = 206655215
    const MarsApoApsisKM = 249232432
    const DivisionFactor = 1000000

    const MarsEccentricity = (MarsApoApsisKM-MarsPeriApsisKM)/(MarsApoApsisKM+MarsPeriApsisKM)
    const MarsMajorAxisKM = MarsApoApsisKM + MarsPeriApsisKM
    const MarsSemiMajorAxisKM = MarsMajorAxisKM / 2

    const MarsSemiMinorAxisKM = MarsSemiMajorAxisKM * Math.sqrt(1-(MarsEccentricity*MarsEccentricity))
    const MarsMinorAxisKM = MarsSemiMinorAxisKM * 2
    const MarsCentralPointKMY = 0
    const MarsCentralPointKMX = -MarsApoApsisKM + MarsSemiMajorAxisKM
                           
    const MarsCentralPointXDivided = MarsCentralPointKMX / DivisionFactor
    const MarsMajorAxisDivided = MarsMajorAxisKM / DivisionFactor
    const MarsMinorAxisDivided = MarsMinorAxisKM / DivisionFactor
    
    drawPlanetOrbit("Mars","Red", MarsCentralPointXDivided, MarsMajorAxisDivided, MarsMinorAxisDivided, cox, coy)
    drawPlanet("Mars", "Red", 44, cox, coy, le)
}

const Roadster = function(apoapsis, periapsis, eccentricity){
    const DivisionFactor = 1000000
    const ApoapsisKM = (apoapsis * 149597871);
    const PeriapsisKM = (periapsis * 149597871);

    const MajorAxisKM = ApoapsisKM + PeriapsisKM;
    const SemiMajorAxisKM = MajorAxisKM / 2
    const SemiMinorAxisKM = SemiMajorAxisKM * Math.sqrt(1-(eccentricity*eccentricity))
    const MinorAxisKM = SemiMinorAxisKM * 2

    const CentralPointX = -ApoapsisKM + SemiMajorAxisKM
    const CentralPointXDivided = CentralPointX / DivisionFactor
    const MajorAxisDivided = MajorAxisKM / DivisionFactor
    const MinorAxisDivided = MinorAxisKM / DivisionFactor

    drawPlanetOrbit("Roadster", "Violet", CentralPointXDivided, MajorAxisDivided, MinorAxisDivided, cox, coy)
    drawPlanet("Roadster", "violet", 316-270, cox, coy, le)
}

const WelcomeMessage = function(){
    console.log("Project: Where is Roadster")
    console.log("Author: Mathias De Herdt")
    console.log("Class: 2MCT3")
    console.log("Module: Interaction Design")
    console.log("Year: 2020-2021")
    console.log("School: Howest Kortrijk")

}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded")
    WelcomeMessage()
    drawXYaxes()
    getRoadsterData()
    Earth()
    Mars()
});