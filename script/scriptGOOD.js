// Variables
API_URL = "https://api.spacexdata.com/v3/roadster"

const total = 300

const cox = total;
const coy = total;
const le = total; 

// =========================
// Function - data from API
// =========================
async function getRoadsterData(){
    // Get api and read data
    const response = await fetch(API_URL);
    const data = await response.json();
    
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
    // document.getElementById('Speed_Roadster').innerHTML = formattedSpeed;
    // document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
    // document.getElementById('Days_Roadster').innerHTML = formattedDays
    // document.getElementById('DistanceEarth').innerHTML = formattedEarthDistance
    // document.getElementById('DistanceMars').innerHTML = formattedMarsDistance

    // Function with data from api that draws roadsters orbit
    Roadster(apoapsis, periapsis, eccentricity)
}

// =========================
// Function - draw x and y axes
// =========================
const drawXYaxes = function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const zerocox = 300
    const zerocoy = 300
 
    // Draw the x-axis
    ctx.beginPath();
    ctx.setLineDash([5, 1]);
    ctx.strokeStyle = "transparant";
    //ctx.strokeStyle = "white";
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

// =========================
// Function - position of the planet in the orbit
// =========================
const drawPlanet = function(planet, clr, X, angle, cox, coy, le, MaA, MiA){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const zerocox = cox
    const zerocoy = coy
    // console.log("Planet = " + planet)
    // console.log("------------------------")
    
    // console.log("cox = " + cox)
 
    //angle = angle + 45

    //draw line
    angle = angle * (-1)
    
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

    // THE LINES
    //ctx.stroke();


    //calculate xy coordinate of the planet
    // Formula line: y = mx + q
    //                   q = 0 (line through origin)
    //                   m = rico = tan of the angle
    //               y = tan(angle) * x
    //
    // Formula ellips:  (x-h/a)² + (y-k/b)² = 1
    //                  a = semimajor axis
    //                  b = semiminor axis
    //                  y = tan(angle) * x
    //                  h = x coordinate of middle of ellips
    //                  k = y coordinate of middle of ellips (= 0 as it lays on the x-axis)
    //                  m = tan(angle)
    //                  x = (  (b² * h) + a*b * sqrt(b² + a² * m² - m² * h²) ) / (b² + a² * m²)
    // http://www.ambrsoft.com/TrigoCalc/Circles2/Ellipse/EllipseLine.htm
    
    angle = angle * (-1)
    // console.log("angle = " + angle)
    angleRadians = angle * Math.PI / 180
    // console.log("AngleRadians = " + angleRadians)
    tangent = Math.tan(angleRadians)
    // console.log("Tangent = " + tangent)
    SeMaA = MaA/2
    SeMiA = MiA/2
    // console.log("a = semimajor = " + SeMaA)
    // console.log("b = semiminor = " + SeMiA)
    // console.log("Middle = (" + X + ",0)")

    SeMiASqr = SeMiA*SeMiA
    SeMaASqr = SeMaA*SeMaA
    h = X
    TangentSqr = tangent*tangent
    SqrtPart = SeMiASqr + (SeMaASqr * TangentSqr) - (TangentSqr * h * h)
    xvalue = (SeMiASqr * h) + (SeMiA * SeMaA) * Math.sqrt(SqrtPart)
    xvalue = xvalue / (SeMiASqr + (SeMaASqr * TangentSqr))
    yvalue = tangent * xvalue
    // console.log("xvalue = " + xvalue)
    // console.log("yvalue = " + yvalue)

    xvalue = xvalue + 300
    yvalue = 300 - yvalue 
    // console.log("xvalue = " + xvalue)
    // console.log("yvalue = " + yvalue)

    ctx.beginPath();
    //ctx.setLineDash([2, 2]);
    //ctx.strokeStyle = "white";
    //ctx.moveTo(xvalue, yvalue);
    //ctx.lineTo(xvalue+2, yvalue+2);
    ctx.fillStyle = clr;
    ctx.arc(xvalue, yvalue, 5, 0, 2 * Math.PI)
    ctx.fill()
    //ctx.stroke();
}

// =========================
// Function - draw the orbit of the planet (and roadster)
// =========================
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

// =========================
// Function - Earth calculations
// =========================
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
    //console.log("xx " + EarthMajorAxisDivided)
    drawPlanet("Earth", "#6483ff", EarthCentralPointXDivided, 61, cox, coy, le, EarthMajorAxisDivided, EarthMinorAxisDivided)
}

// =========================
// Function - Mars calculations 
// =========================
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
    drawPlanet("Mars", "Red", MarsCentralPointXDivided, 44, cox, coy, le, MarsMajorAxisDivided, MarsMinorAxisDivided)
}

// =========================
// Function - Roadster calculations with data from api
// =========================
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
    drawPlanet("Roadster", "violet", CentralPointXDivided, 316-270, cox, coy, le, MajorAxisDivided, MinorAxisDivided)
}

// =========================
// Function - Welcome message 
// =========================
const WelcomeMessage = function(){
    console.log("\nProject: Where is Roadster")
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
    //getRoadsterData()
    Earth()
    Mars()
});


