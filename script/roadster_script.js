// Variables
API_URL = "https://api.spacexdata.com/v3/roadster"

const totalpixels = 600

const zerocox = totalpixels/2;
const zerocoy = totalpixels/2;
const length = totalpixels; 
const DivisionFactor = 1000000;
const AU = 149597871;     //(1 AU = 149597871 km)
const WriteDebugInfo = "off"
const DrawLines = "off"

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
    const apoapsis = data.apoapsis_au;
    const periapsis = data.periapsis_au;
    const periapsis_arg = data.periapsis_arg;
    const eccentricity = data.eccentricity;
    const inclination = data.inclination;
    const longitude = data.longitude;
    const days = data.period_days;

    const speed = data.speed_kph;
    const speedMile = data.speed_mph;

    const Edistance = data.earth_distance_km;
    const EdistanceMile = data.earth_distance_mi;

    const Mdistance = data.mars_distance_km;
    const MdistanceMile = data.mars_distance_mi;


    // Date yyyy-mm-dd converteren to dd-mm-yyyy
    const dateSplit = date.split('T')[0]
    const dateOld = dateSplit.split('-')
    const newDate = [dateOld[2],"Feb",dateOld[0]].join("-");

    // Metric
    const formattedSpeed = `${Math.round((speed*100)/100)} km/u`
    const formattedEarthDistance = `${Math.floor(Edistance)} km`
    const formattedMarsDistance = `${Math.floor(Mdistance)} km`

    // Imperial
    const formattedSpeedMile = `${Math.round((speedMile*100)/100)} mph`;
    const formattedEarthDistanceMile = `${Math.floor(EdistanceMile)} mile`
    const formattedMarsDistanceMile = `${Math.floor(MdistanceMile)} mile`;

    // Standard
    const formattedDate = `${newDate}`
    const formattedDays = `${Math.floor(days)} days`

    var changeToImperial = window.setInterval(imperial, 5000);
    var changeToMetric = window.setInterval(metric, 10000);

    function metric() {
        document.getElementById('Speed_Roadster').innerHTML = formattedSpeed;
        document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
        document.getElementById('Days_Roadster').innerHTML = formattedDays
        document.getElementById('DistanceEarth').innerHTML = formattedEarthDistance
        document.getElementById('DistanceMars').innerHTML = formattedMarsDistance
    }
   
    function imperial() {
        document.getElementById('Speed_Roadster').innerHTML = formattedSpeedMile;
        document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
        document.getElementById('Days_Roadster').innerHTML = formattedDays
        document.getElementById('DistanceEarth').innerHTML = formattedEarthDistanceMile
        document.getElementById('DistanceMars').innerHTML = formattedMarsDistanceMile
    }

    // Send data to html
    document.getElementById('Speed_Roadster').innerHTML = formattedSpeed;
    document.getElementById('LaunchDate_Roadster').innerHTML = formattedDate
    document.getElementById('Days_Roadster').innerHTML = formattedDays
    document.getElementById('DistanceEarth').innerHTML = formattedEarthDistance
    document.getElementById('DistanceMars').innerHTML = formattedMarsDistance

    // Function with data from api that draws roadsters orbit
    Roadster(apoapsis, periapsis, eccentricity, longitude, days)
}

// =========================
// Function - WriteConsoleLogging
// =========================
const WriteConsoleLogging = function(text){
    if (WriteDebugInfo == "on") {
        console.log(text)
    };
}

// =========================
// Function - draw x and y axes
// =========================
const drawXYaxes = function(){
    if (DrawLines == "on") {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
    
        // Draw the x-axis
        ctx.beginPath();
        ctx.setLineDash([5, 1]);
        ctx.strokeStyle = "white";
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
}

// =========================
// Function - position of the planet in the orbit
// =========================
const drawPlanet = function(planet, clr, X, Y, angle, MaA, MiA){
    WriteConsoleLogging("Drawing " + planet + " on the orbit")
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

     // Drawing the line - the intersection of this line with the orbit is where the planet is
    if (DrawLines == "on") {
        x1 = zerocox
        y1 = zerocoy
        x2 = x1 + Math.cos((Math.PI / 180.0) * (angle*(-1))) * length
        y2 = y1 + Math.sin((Math.PI / 180.0) * (angle*(-1))) * length
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = clr;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    //calculate xy coordinate of the planet
    // Formula line: y = mx + q
    //                   q = 0 (line through origin)
    //                   m = rico = tan of the angle
    //               y = tan(angle) * x
    //
    // Formula ellips:  ((x-h)/a)² + ((y-k)/b)² = 1
    //                  a = semimajor axis
    //                  b = semiminor axis
    //                  y = tan(angle) * x
    //                  h = x coordinate of middle of ellips
    //                  k = y coordinate of middle of ellips 
    //                  m = tan(angle)
    //                  µ = q - k (q = 0 -> µ = -k)
    //                  Kwadrant I and IV
    //                     x = (  (b² * h) - a²*m*µ + a*b * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) ) / (b² + a² * m²)
    //                  Kwadrant II and III
    //                     x = (  (b² * h) - a²*m*µ - a*b * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) ) / (b² + a² * m²)
    // http://www.ambrsoft.com/TrigoCalc/Circles2/Ellipse/EllipseLine.htm
    
    angleRadians = angle * Math.PI / 180
    tangent = Math.tan(angleRadians)
    TangentSqr = tangent*tangent

    WriteConsoleLogging("  - Angle = " + angle + "°")
    WriteConsoleLogging("  - AngleRadians = " + angleRadians)
    WriteConsoleLogging("  - Tangent = " + tangent)

    a = MaA/2
    b = MiA/2
    h = X
    k = Y
    µ = k * (-1)

    WriteConsoleLogging("  - a = semimajor axis = " + a)
    WriteConsoleLogging("  - b = semiminor axis = " + b)
    WriteConsoleLogging("  - h = x co of ellips centre = " + h)
    WriteConsoleLogging("  - k = y co of ellips centre = " + k)
    WriteConsoleLogging("  - m = tan(" + angle + ")")
    WriteConsoleLogging("  - µ = -k = " + µ)
    
    
    if (angle > 0 && angle <90) {
        //         b²    + a² * m²          - 2*m*µ*h         - µ²    - m² * h²) 
        SqrtPart = (b*b) + (a*a*TangentSqr) - (2*tangent*µ*h) - (µ*µ)   - (TangentSqr*h*h)
        //    (  (b² * h) + a²*m*µ          + a*b   * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) )
        xvalue = (b*b*h)  - (a*a*tangent*µ) + (a*b) * Math.sqrt(SqrtPart)
        xvalue = xvalue / (b*b + (a*a*TangentSqr))
        yvalue = tangent * xvalue

        WriteConsoleLogging("Kwadrant I - x = " + xvalue + " - y = " + yvalue)
        WriteConsoleLogging("  - xvalue = " + xvalue)
        WriteConsoleLogging("  - yvalue = " + yvalue)

        xvalue = xvalue + 300
        yvalue = 300 - yvalue 
    }

    if (angle > 90 && angle <180) {
        //         b²    + a² * m²          - 2*m*µ*h         - µ²    - m² * h²) 
        SqrtPart = (b*b) + (a*a*TangentSqr) - (2*tangent*µ*h) - (µ*µ)   - (TangentSqr*h*h)
        //    (  (b² * h) + a²*m*µ          - a*b   * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) )
        xvalue = (b*b*h)  - (a*a*tangent*µ) - (a*b) * Math.sqrt(SqrtPart)
        xvalue = xvalue / (b*b + (a*a*TangentSqr))
        yvalue = tangent * xvalue

        WriteConsoleLogging("Kwadrant II - x = " + xvalue + " - y = " + yvalue)
        WriteConsoleLogging("  - xvalue = " + xvalue)
        WriteConsoleLogging("  - yvalue = " + yvalue)

        xvalue = 300 + xvalue 
        yvalue = 300 - yvalue
    }

    if (angle > 180 && angle <270) {
        //         b²    + a² * m²          - 2*m*µ*h         - µ²    - m² * h²) 
        SqrtPart = (b*b) + (a*a*TangentSqr) - (2*tangent*µ*h) - (µ*µ)   - (TangentSqr*h*h)
        //    (  (b² * h) + a²*m*µ          - a*b   * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) )
        xvalue = (b*b*h)  - (a*a*tangent*µ) - (a*b) * Math.sqrt(SqrtPart)
        xvalue = xvalue / (b*b + (a*a*TangentSqr))
        yvalue = tangent * xvalue

        WriteConsoleLogging("Kwadrant III - x = " + xvalue + " - y = " + yvalue)
        WriteConsoleLogging("  - xvalue = " + xvalue)
        WriteConsoleLogging("  - yvalue = " + yvalue)

        xvalue = 300 + xvalue
        yvalue = 300 - yvalue 
    }
    if (angle > 270) {
        //         b²    + a² * m²          - 2*m*µ*h         - µ²    - m² * h²) 
        SqrtPart = (b*b) + (a*a*TangentSqr) - (2*tangent*µ*h) - (µ*µ)   - (TangentSqr*h*h)
        //    (  (b² * h) + a²*m*µ          + a*b   * sqrt(b² + a² * m² - 2*m*µ*h - µ² - m² * h²) )
        xvalue = (b*b*h)  - (a*a*tangent*µ) + (a*b) * Math.sqrt(SqrtPart)
        xvalue = xvalue / (b*b + (a*a*TangentSqr))
        yvalue = tangent * xvalue

        WriteConsoleLogging("Kwadrant IV - x = " + xvalue + " - y = " + yvalue)
        WriteConsoleLogging("  - xvalue = " + xvalue)
        WriteConsoleLogging("  - yvalue = " + yvalue)

        xvalue = 300 + xvalue
        yvalue = 300 - yvalue 
    }

    WriteConsoleLogging("  - xvalue in raster = " + xvalue)
    WriteConsoleLogging("  - yvalue in raster = " + yvalue)

    ctx.beginPath();
    ctx.fillStyle = clr;

    //ctx.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
    //x           The x-axis (horizontal) coordinate of the circle's center.
    //y           The y-axis (vertical) coordinate of the circle's center.
    //radius      The circle's radius. Must be non-negative.
    //startAngle  The angle at which the circle starts, in radians. 
    //endAngle    The angle at which the circle ends, in radians.
    //anticlockwise Optional
    //ctx.arc(xvalue, yvalue, 5, 0, 2 * Math.PI)

    ctx.arc(xvalue, yvalue, 10, 0, 2 * Math.PI)
    ctx.fill()
}

// =========================
// Function - draw the orbit of the planet (and roadster)
// =========================
const drawPlanetOrbit = function(Planet, Clr, X, Y, MaA, MiA){
    WriteConsoleLogging("Drawing the orbit of " + Planet)

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    WriteConsoleLogging("  - X = " + X)
    WriteConsoleLogging("  - Y = " + Y)

    X = zerocox + X
    Y = zerocoy + (-Y)

    WriteConsoleLogging("  - Orbit Centre X = " + X)
    WriteConsoleLogging("  - Orbit Centre Y = " + Y)
       
    ctx.setLineDash([1, 0]);
    ctx.strokeStyle = Clr;
    var radiusx = MaA/2;
    var radiusy = MiA/2;
    ctx.beginPath();
    ctx.lineWidth = 3;

    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
    //x           The x-axis (horizontal) coordinate of the ellipse's center.
    //y           The y-axis (vertical) coordinate of the ellipse's center.
    //radiusX     The ellipse's major-axis radius. Must be non-negative.
    //radiusY     The ellipse's minor-axis radius. Must be non-negative.
    //rotation    The rotation of the ellipse, expressed in radians.
    //startAngle  The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.
    //endAngle    The angle at which the ellipse ends, measured clockwise from the positive x-axis and expressed in radians.
    //anticlockwise Optional
    //An optional Boolean which, if true, draws the ellipse anticlockwise (counter-clockwise). The default value is false (clockwise).
    
    ctx.ellipse(X, Y, radiusx, radiusy, 0 * Math.PI, 0 * Math.PI , 2 * Math.PI);
    ctx.stroke();
}

// =========================
// Function - Earth calculations
// =========================
var Earth = function(){
    WriteConsoleLogging("Earth")
    WriteConsoleLogging("-----")

    const EarthPeriApsisKM = 147098291 // https://en.wikipedia.org/wiki/Apsis
    const EarthApoApsisKM = 152098233
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
    const EarthHelioCentricLongitude_1Nov2020 = 39 // https://planetarium.wvu.edu/files/d/e0ba9626-6377-4fff-8589-16ec25f27712/heliocentric-longitudes-2020pdf.pdf
    const EarthDaysPerOrbitPeriod = 365.256
    const EarthDegreesPerDay = 360 / EarthDaysPerOrbitPeriod

    WriteConsoleLogging("period = " + EarthDaysPerOrbitPeriod + " degreesperday = " + EarthDegreesPerDay)

    var StartDate = new Date("11/01/2020") //.toLocaleDateString("nl-be")
    var Today = new Date() //.toLocaleDateString("nl-be")

    WriteConsoleLogging("Today = " + Today + " " + StartDate)

    var Days2Add = (Today.getTime() - StartDate.getTime()) /(1000 * 60 * 60 * 24);

    WriteConsoleLogging("Days = " + Days2Add)

    const EarthHelioCentricLongitudeNow = EarthHelioCentricLongitude_1Nov2020 + (Days2Add*EarthDegreesPerDay)

    WriteConsoleLogging("Real values:")
    WriteConsoleLogging("  - ApoApsis  = " + EarthApoApsisKM + "km")
    WriteConsoleLogging("  - PeriApsis = " + EarthPeriApsisKM + "km")
    WriteConsoleLogging("  - MajorAxis = " + EarthMajorAxisKM + "km")
    WriteConsoleLogging("  - MinorAxis = " + EarthMinorAxisKM + "km") 
    WriteConsoleLogging("  - Heliocentric longitude = " + EarthHelioCentricLongitudeNow + "°")
    WriteConsoleLogging("Scaled values (/" + DivisionFactor + "):")
    WriteConsoleLogging("  - MajorAxisScaled = " + EarthMajorAxisDivided + "km")
    WriteConsoleLogging("  - MinorAxisScaled = " + EarthMinorAxisDivided + "km") 
    WriteConsoleLogging("  - CentreX = " + EarthCentralPointXDivided)

    drawPlanetOrbit("Earth","#6483ff", EarthCentralPointXDivided, 0, EarthMajorAxisDivided, EarthMinorAxisDivided)
    drawPlanet("Earth", "#6483ff", EarthCentralPointXDivided, 0, EarthHelioCentricLongitudeNow, EarthMajorAxisDivided, EarthMinorAxisDivided)
}

// =========================
// Function - Mars calculations 
// =========================
var Mars = function(){
    WriteConsoleLogging("Mars")
    WriteConsoleLogging("----")

    const MarsPeriApsisKM = 206655215
    const MarsApoApsisKM = 249232432
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
    const MarsHelioCentricLongitude_1Nov2020 = 32
    const MarsDaysPerOrbitPeriod = 687
    const MarsDegreesPerDay = 360 / MarsDaysPerOrbitPeriod

    WriteConsoleLogging("period = " + MarsDaysPerOrbitPeriod + " degreesperday = " + MarsDegreesPerDay)

    var StartDate = new Date("11/01/2020") //.toLocaleDateString("nl-be")
    var Today = new Date() //.toLocaleDateString("nl-be")

    WriteConsoleLogging("Today = " + Today + " " + StartDate)

    var Days2Add = (Today.getTime() - StartDate.getTime()) /(1000 * 60 * 60 * 24);

    WriteConsoleLogging("Days = " + Days2Add)

    const MarsHelioCentricLongitudeNow = MarsHelioCentricLongitude_1Nov2020 + (Days2Add*MarsDegreesPerDay)

    WriteConsoleLogging("Real values:")
    WriteConsoleLogging("  - ApoApsis  = " + MarsApoApsisKM + "km")
    WriteConsoleLogging("  - PeriApsis = " + MarsPeriApsisKM + "km")
    WriteConsoleLogging("  - MajorAxis = " + MarsMajorAxisKM + "km")
    WriteConsoleLogging("  - MinorAxis = " + MarsMinorAxisKM + "km") 
    WriteConsoleLogging("  - Heliocentric longitude = " + MarsHelioCentricLongitudeNow + "°")
    WriteConsoleLogging("Scaled values (/" + DivisionFactor + "):")
    WriteConsoleLogging("  - MajorAxisScaled = " + MarsMajorAxisDivided + "km")
    WriteConsoleLogging("  - MinorAxisScaled = " + MarsMinorAxisDivided + "km") 
    WriteConsoleLogging("  - CentreX = " + MarsCentralPointXDivided)
    
    drawPlanetOrbit("Mars","Red", MarsCentralPointXDivided, 7, MarsMajorAxisDivided, MarsMinorAxisDivided)
    drawPlanet("Mars", "Red", MarsCentralPointXDivided, 7, MarsHelioCentricLongitudeNow, MarsMajorAxisDivided, MarsMinorAxisDivided)
}

var Venus = function(){
    WriteConsoleLogging("Venus")
    WriteConsoleLogging("----")

    const VenusPeriApsisKM = 107476170
    const VenusApoApsisKM = 108942780
    const VenusEccentricity = (VenusApoApsisKM-VenusPeriApsisKM)/(VenusApoApsisKM+VenusPeriApsisKM)
    const VenusMajorAxisKM = VenusApoApsisKM + VenusPeriApsisKM
    const VenusSemiMajorAxisKM = VenusMajorAxisKM / 2
    const VenusSemiMinorAxisKM = VenusSemiMajorAxisKM * Math.sqrt(1-(VenusEccentricity*VenusEccentricity))
    const VenusMinorAxisKM = VenusSemiMinorAxisKM * 2
    const MarsCentralPointKMY = 0
    const VenusCentralPointKMX = -VenusApoApsisKM + VenusSemiMajorAxisKM
    const VenusCentralPointXDivided = VenusCentralPointKMX / DivisionFactor
    const VenusMajorAxisDivided = VenusMajorAxisKM / DivisionFactor
    const VenusMinorAxisDivided = VenusMinorAxisKM / DivisionFactor
    const VenusHelioCentricLongitude_1Nov2020 = 134
    const VenusDaysPerOrbitPeriod = 255
    const VenusDegreesPerDay = 360 / VenusDaysPerOrbitPeriod

    WriteConsoleLogging("period = " + VenusDaysPerOrbitPeriod + " degreesperday = " + VenusDegreesPerDay)

    var StartDate = new Date("11/01/2020") //.toLocaleDateString("nl-be")
    var Today = new Date() //.toLocaleDateString("nl-be")

    WriteConsoleLogging("Today = " + Today + " " + StartDate)

    var Days2Add = (Today.getTime() - StartDate.getTime()) /(1000 * 60 * 60 * 24);

    WriteConsoleLogging("Days = " + Days2Add)

    const VenusHelioCentricLongitudeNow = VenusHelioCentricLongitude_1Nov2020 + (Days2Add*VenusDegreesPerDay)

    WriteConsoleLogging("Real values:")
    WriteConsoleLogging("  - ApoApsis  = " + VenusApoApsisKM + "km")
    WriteConsoleLogging("  - PeriApsis = " + VenusPeriApsisKM + "km")
    WriteConsoleLogging("  - MajorAxis = " + VenusMajorAxisKM + "km")
    WriteConsoleLogging("  - MinorAxis = " + VenusMinorAxisKM + "km") 
    WriteConsoleLogging("  - Heliocentric longitude = " + VenusHelioCentricLongitudeNow + "°")
    WriteConsoleLogging("Scaled values (/" + DivisionFactor + "):")
    WriteConsoleLogging("  - MajorAxisScaled = " + VenusMajorAxisDivided + "km")
    WriteConsoleLogging("  - MinorAxisScaled = " + VenusMinorAxisDivided + "km") 
    WriteConsoleLogging("  - CentreX = " + VenusCentralPointXDivided)
    
    drawPlanetOrbit("Venus","White", VenusCentralPointXDivided, 7, VenusMajorAxisDivided, VenusMinorAxisDivided)
    drawPlanet("Venus", "White", VenusCentralPointXDivided, 7, VenusHelioCentricLongitudeNow, VenusMajorAxisDivided, VenusMinorAxisDivided)
}

var Mercury = function(){
    WriteConsoleLogging("Mercury")
    WriteConsoleLogging("----")

    const MercuryPeriApsisKM = 46001009
    const MercuryApoApsisKM = 69817445 
    const MercuryEccentricity = (MercuryApoApsisKM-MercuryPeriApsisKM)/(MercuryApoApsisKM+MercuryPeriApsisKM)
    const MercuryMajorAxisKM = MercuryApoApsisKM + MercuryPeriApsisKM
    const MercurySemiMajorAxisKM = MercuryMajorAxisKM / 2
    const MercurySemiMinorAxisKM = MercurySemiMajorAxisKM * Math.sqrt(1-(MercuryEccentricity*MercuryEccentricity))
    const MercuryMinorAxisKM = MercurySemiMinorAxisKM * 2
    const MercuryCentralPointKMY = 0
    const MercuryCentralPointKMX = -MercuryApoApsisKM + MercurySemiMajorAxisKM
    const MercuryCentralPointXDivided = MercuryCentralPointKMX / DivisionFactor
    const MercuryMajorAxisDivided = MercuryMajorAxisKM / DivisionFactor
    const MercuryMinorAxisDivided = MercuryMinorAxisKM / DivisionFactor
    const MercuryHelioCentricLongitude_1Nov2020 = 70
    const MercuryDaysPerOrbitPeriod = 88
    const MercuryDegreesPerDay = 360 / MercuryDaysPerOrbitPeriod

    WriteConsoleLogging("period = " + MercuryDaysPerOrbitPeriod + " degreesperday = " + MercuryDegreesPerDay)

    var StartDate = new Date("11/01/2020") //.toLocaleDateString("nl-be")
    var Today = new Date() //.toLocaleDateString("nl-be")

    WriteConsoleLogging("Today = " + Today + " " + StartDate)

    var Days2Add = (Today.getTime() - StartDate.getTime()) /(1000 * 60 * 60 * 24);

    WriteConsoleLogging("Days = " + Days2Add)

    const MercuryHelioCentricLongitudeNow = MercuryHelioCentricLongitude_1Nov2020 + (Days2Add*MercuryDegreesPerDay)

    WriteConsoleLogging("Real values:")
    WriteConsoleLogging("  - ApoApsis  = " + MercuryApoApsisKM + "km")
    WriteConsoleLogging("  - PeriApsis = " + MercuryPeriApsisKM + "km")
    WriteConsoleLogging("  - MajorAxis = " + MercuryMajorAxisKM + "km")
    WriteConsoleLogging("  - MinorAxis = " + MercuryMinorAxisKM + "km") 
    WriteConsoleLogging("  - Heliocentric longitude = " + MercuryHelioCentricLongitudeNow + "°")
    WriteConsoleLogging("Scaled values (/" + DivisionFactor + "):")
    WriteConsoleLogging("  - MajorAxisScaled = " + MercuryMajorAxisDivided + "km")
    WriteConsoleLogging("  - MinorAxisScaled = " + MercuryMinorAxisDivided + "km") 
    WriteConsoleLogging("  - CentreX = " + MercuryCentralPointXDivided)
    
    drawPlanetOrbit("Mercury","green", MercuryCentralPointXDivided, 7, MercuryMajorAxisDivided, MercuryMinorAxisDivided)
    drawPlanet("Mercury", "green", MercuryCentralPointXDivided, 7, MercuryHelioCentricLongitudeNow, MercuryMajorAxisDivided, MercuryMinorAxisDivided)
}

// =========================
// Function - Roadster calculations with data from api
// =========================
const Roadster = function(apoapsis, periapsis, eccentricity, longitude, Period){
    WriteConsoleLogging("Roadster")
    WriteConsoleLogging("--------")

    const ApoapsisKM = (apoapsis * AU);
    const PeriapsisKM = (periapsis * AU);
    const MajorAxisKM = ApoapsisKM + PeriapsisKM;
    const SemiMajorAxisKM = MajorAxisKM / 2
    const SemiMinorAxisKM = SemiMajorAxisKM * Math.sqrt(1-(eccentricity*eccentricity))
    const MinorAxisKM = SemiMinorAxisKM * 2

    //const CentralPointX = -ApoapsisKM + SemiMajorAxisKM
    //Ellipse center is right from x-axis
    //We have to take the negative periapsis + majoraxis

    const CentralPointX = -PeriapsisKM + SemiMajorAxisKM
    const CentralPointXDivided = CentralPointX / DivisionFactor
    const MajorAxisDivided = MajorAxisKM / DivisionFactor
    const MinorAxisDivided = MinorAxisKM / DivisionFactor
    const RoadsterHelioCentricLongitude_1Nov2020 = 32
    const RoadsterDaysPerOrbitPeriod = Period
    const RoadsterDegreesPerDay = 360 / RoadsterDaysPerOrbitPeriod

    WriteConsoleLogging("period = " + RoadsterDaysPerOrbitPeriod + " degreesperday = " + RoadsterDegreesPerDay)

    var StartDate = new Date("11/01/2020") //.toLocaleDateString("nl-be")
    var Today = new Date() //.toLocaleDateString("nl-be")

    WriteConsoleLogging("Today = " + Today + " " + StartDate)

    var Days2Add = (Today.getTime() - StartDate.getTime()) /(1000 * 60 * 60 * 24);

    WriteConsoleLogging("Days = " + Days2Add)

    const RoadsterHelioCentricLongitudeNow = RoadsterHelioCentricLongitude_1Nov2020 + ((Days2Add)*RoadsterDegreesPerDay)
    
    //end

    WriteConsoleLogging("Real values:")
    WriteConsoleLogging("  - ApoApsis  = " + ApoapsisKM + "km")
    WriteConsoleLogging("  - PeriApsis = " + PeriapsisKM + "km")
    WriteConsoleLogging("  - MajorAxis = " + MajorAxisKM + "km")
    WriteConsoleLogging("  - MinorAxis = " + MinorAxisKM + "km") 
    WriteConsoleLogging("  - Heliocentric longitude = " + RoadsterHelioCentricLongitudeNow + "°")
    WriteConsoleLogging("Scaled values (/" + DivisionFactor + "):")
    WriteConsoleLogging("  - MajorAxisScaled = " + MajorAxisDivided + "km")
    WriteConsoleLogging("  - MinorAxisScaled = " + MinorAxisDivided + "km") 
    WriteConsoleLogging("  - CentreX = " + CentralPointX)
    WriteConsoleLogging("  - CentreXDivided = " + CentralPointXDivided)

    drawPlanetOrbit("Roadster", "Violet", CentralPointXDivided-19, -32, MajorAxisDivided, MinorAxisDivided)
    drawPlanet("Roadster", "violet", CentralPointXDivided-19, -32, RoadsterHelioCentricLongitudeNow, MajorAxisDivided, MinorAxisDivided)
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
    getRoadsterData()
    // Mercury()
    // Venus()
    Earth()
    Mars()
});


