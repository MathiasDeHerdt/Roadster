API_URL = "https://api.spacexdata.com/v3/roadster"


async function getRoadsterData(EarthEccentricity){
    const response = await fetch(API_URL);
    const data = await response.json();
    
    const name = data.name;
    const norad = data.norad_id;
    const epoch = data.epoch_jd;
    const apoapsis = data.apoapsis_au;
    const periapsis = data.periapsis_au;
    const eccentricity = data.eccentricity;
    const inclination = data.inclination;
    const longtlongitude = data.longitude;
    const days = data.period_days;
    const speed = data.speed_kph;
    const Edistance = data.earth_distance_km;
    const Mdistance = data.mars_distance_km;

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

const drawPlanetOrbit = function(Planet, Clr, X, MaA, MiA){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    console.log(X)
    console.log(MaA)
    console.log(MiA)

    const zerocox = 300
    const zerocoy = 300

    X = zerocox + X
    Y = zerocoy
    console.log(X)
    
    ctx.setLineDash([1, 0]);
    ctx.strokeStyle = Clr;

    var radiusx = MaA/2;
    var radiusy = MiA/2;
    ctx.beginPath();
    ctx.ellipse(X, Y, radiusx, radiusy, 0, 0, 360);
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

    drawPlanetOrbit("Earth","#6483ff", EarthCentralPointXDivided, EarthMajorAxisDivided, EarthMinorAxisDivided)

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
    
    drawPlanetOrbit("Mars","Red", MarsCentralPointXDivided, MarsMajorAxisDivided, MarsMinorAxisDivided)
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

    drawPlanetOrbit("Roadster", "Violet", CentralPointXDivided, MajorAxisDivided, MinorAxisDivided)

}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded")
    drawXYaxes()
    getRoadsterData()
    Earth()
    Mars()    
});

// var venus = function() {
//     const VenusPeriApsisKM = 107476170
//     const VenusApoApsisKM = 108942780

//     const DivisionFactor = 1000000

//     const VenusEccentricity = (VenusApoApsisKM-VenusPeriApsisKM)/(VenusApoApsisKM+VenusPeriApsisKM)
//     const VenusMajorAxisKM = VenusApoApsisKM + VenusPeriApsisKM
//     const VenusSemiMajorAxisKM = VenusMajorAxisKM / 2
//     const VenusSemiMinorAxisKM = VenusSemiMajorAxisKM * Math.sqrt(1-(VenusEccentricity*EarthEccentricity))
//     const VenusMinorAxisKM = VenusSemiMinorAxisKM * 2
//     const VenusCentralPointKMY = 0

//     const VenusCentralPointKMX = -VenusApoApsisKM + VenusSemiMajorAxisKM
//     const VenusCentralPointXDivided = VenusCentralPointKMX / DivisionFactor
//     const VenusMajorAxisDivided = VenusMajorAxisKM / DivisionFactor
//     const VenusMinorAxisDivided = VenusMinorAxisKM / DivisionFactor

//     drawPlanetOrbit("Venus","Hotpink", VenusCentralPointXDivided, VenusMajorAxisDivided, VenusMinorAxisDivided)
// }


