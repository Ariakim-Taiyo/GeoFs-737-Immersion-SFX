let k = 125;
let dc = -1.5;
let m = 0.6;
let vl = 0;
let vr = 0;
let dsl = 0;
let dsr = 0;
let restingpoint = 0;
let dml = 0;
let dmr = 0;
let rrate = 1/240;
let frameD = rrate * 1000;
let autopilotDisconnectSound = new Audio("https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3")

// autopliot disconnect sound
geofs.autopilot._turnOff = geofs.autopilot.turnOff // duplicate the original
geofs.autopilot.turnOff = () => { // override the original function
  geofs.autopilot._turnOff();
  if (audio.on && !geofs.pause) autopilotDisconnectSound.play();
}


//fix bug with reset
geofs.flyTo = function(a, b) {
  clearInterval(soundInt)
  clearInterval(accelInt);
  setTimeout(function(){
    accelInt = setInterval(function(){
      getAccel()
    },10)

    soundInt = setInterval(function(){
      getFinalSoundVolumes();
      //groundEffect();
      getGearFlapsWarn();
      testForApproach();
      testTerrainorAppr();
      doRadioAltCall();
      checkReverse();
      checkCabin();
      doShake();
      getGroundSound();
      getGearThud();
      overspeed();
      getRainVol();
      getTouch();
      getTrimSound();
      getFlapsSound();
      getFlapsClick();
      resetLift();
      applyInertia();
      getPaxCheer();
      getScream();
      getFrontTouch();
      bumpCount()
    })
  }, 2000)
  lastWingPosL = 0;
  lastWingPosR = 0;
  accelerationL = 1;
  accelerationR = 1;
  geofs.animation.values.volumeCabin = null;
  geofs.animation.values.engSoundMultF = null;
  geofs.animation.values.engSoundMultR = null;
  geofs.animation.values.engSoundFar = null;
  geofs.animation.values.reverseThrustVol = null;
  geofs.animation.values.cabinAmb = null;
  geofs.animation.values.groundSound = null;
  geofs.animation.values.gearThud = null;
  geofs.animation.values.overspeed = null;
  geofs.animation.values.rainVol = null;
  geofs.animation.values.tdSoft = null;
  geofs.animation.values.tdHard = null;
  geofs.animation.values.spoilersSound = null;
  geofs.animation.values.shake = null;
  geofs.animation.values.flapsClick = null;
  geofs.animation.values.flapsSound = null;
  geofs.animation.values.trimSound = null;
  geofs.animation.values.liftLeftWing = 1;
  geofs.animation.values.liftRightWing = 1;
  geofs.animation.values.defL = 1;
  geofs.animation.values.defR = 1;
  geofs.animation.values.paxScream = 0;
  geofs.animation.values.paxClap = 0;
  geofs.animation.values.bump = 0;
    if (a) {
        geofs.doPause(1);
        var c = geofs.aircraft.instance;
        a[0] = a[0] || geofs.initialRunways[0][0];
        a[1] = a[1] || geofs.initialRunways[0][1];
        a[2] = a[2] || 0;
        a[3] = a[3] || 0;
        c.absoluteStartAltitude = a[4] ? !0 : !1;
        c.startAltitude = a[2];
        geofs.lastFlightCoordinates = a;
        var d = a[0]
          , e = a[1]
          , g = a[2]
          , f = [0, 0, 0];
        f[0] = a[3];
        var k = 0 == g;
        c.llaLocation = [d, e, g];
        b ? geofs.camera.set(geofs.camera.currentMode) : (geofs.probeTerrain(),
        geofs.camera.reset(),
        controls.reset(),
        weather.reset(),
        weather.refresh());
        geofs.api.waterDetection.reset();
        c.reset(k);
        instruments.reset();
        geofs.objects.update(c.llaLocation);
        geofs.runways.refresh();
        geofs.runwaysLights.updateAll();
        ui.hideCrashNotification();
        geofs.api.getGuarantiedGroundAltitude([d, e, 0]).then(function(m) {
            m = m[0].height || 0;
            geofs.groundElevation = m;
            flight.reset(geofs.groundElevation);
            k ? (c.startAltitude = geofs.groundElevation + c.definition.startAltitude,
            c.absoluteStartAltitude = !1) : c.absoluteStartAltitude || (c.startAltitude += geofs.groundElevation);
            c.llaLocation[2] = c.startAltitude;
            flight.elevationAtPreviousLocation = m;
            k ? (f[1] = c.definition.startTilt || 0,
            c.startOnGround = !0,
            c.groundContact = !0,
            c.place(c.llaLocation, f),
            c.object3d.compute(c.llaLocation),
            c.render()) : (c.startOnGround = !1,
            c.place(c.llaLocation, f),
            c.object3d.compute(c.llaLocation),
            m = c.definition.minimumSpeed / 1.94 * c.definition.mass,
            c.rigidBody.applyCentralImpulse(V3.scale(c.object3d.getWorldFrame()[1], m)));
            geofs.undoPause(1);
            geofs.camera.setToNeutral();
            geofs.camera.update(2);
            flight.recorder.clear();
            $(document).trigger("flyto")
        })
    }
};
//define new variables
geofs.animation.values.volumeCabin = null;
geofs.animation.values.engSoundMultF = null;
geofs.animation.values.engSoundMultR = null;
geofs.animation.values.engSoundFar = null;
geofs.animation.values.reverseThrustVol = null;
geofs.animation.values.cabinAmb = null;
geofs.animation.values.groundSound = null;
geofs.animation.values.gearThud = null;
geofs.animation.values.overspeed = null;
geofs.animation.values.rainVol = null;
geofs.animation.values.tdSoft = null;
geofs.animation.values.tdHard = null;
geofs.animation.values.spoilersSound = null;
geofs.animation.values.shake = null;
geofs.animation.values.flapsClick = null;
geofs.animation.values.flapsSound = null;
geofs.animation.values.trimSound = null;
geofs.animation.values.liftLeftWing = 1;
geofs.animation.values.liftRightWing = 1;
geofs.animation.values.defL = 1;
geofs.animation.values.defR = 1;
geofs.animation.values.paxScream = 0;
geofs.animation.values.paxClap = 0;
geofs.animation.values.tdFront = 0;
geofs.animation.values.bump = 0;
let bumpDist = 10;
let bumpSC = 0;

//get taxiway bumps
function bumpCount() {
  //enable sim continuity when out of cabin
  if (geofs.animation.values.groundContact == 1) {
    var s = geofs.animation.values.kias / 45.0;
    if (s < 0.05) s = 0;
    bumpSC += s;
    if (bumpSC >= bumpDist) {
      bumpSC = 0;
      if (geofs.camera.currentModeName == "cockpit" || geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
        geofs.animation.values.bump = 1;
        setTimeout(function(){geofs.animation.values.bump = 0;},1500);
      }
    }
  }
}
//get clap/scream fx

function getScream() {
  if (geofs.camera.currentModeName == "cockpit" || geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
    if (geofs.animation.values.climbrate <= -6000 && geofs.animation.values.kias > 300) {
      geofs.animation.values.paxScream = 1;
    }
    else {
      geofs.animation.values.paxScream = 0;
    }
  }
  else {
    geofs.animation.values.paxScream = 0;
  }
}

function getPaxCheer() {
  if (weather.definition.turbulences <= 0.8) {
    geofs.animation.values.paxClap = 0;
  }
};

//add g force effect to wingflex 
function resetLift(){
geofs.animation.values.liftLeftWing = (-geofs.aircraft.instance.parts.leftwing.lift / 50000)+((geofs.animation.values.accZ - 9)/50 + geofs.animation.values.shake / 1000) / (geofs.animation.values.kias / 150);
geofs.animation.values.liftRightWing = (-geofs.aircraft.instance.parts.rightwing.lift / 50000)+((geofs.animation.values.accZ - 9)/50 + geofs.animation.values.shake / 1000) / (geofs.animation.values.kias / 150);
};

let lastWingPosL = 0;
let lastWingPosR = 0;
let accelerationL = 1;
let accelerationR = 1;
    
function getAccel() {
  lastWingPosL = geofs.animation.values.liftLeftWing;
  lastWingPosR = geofs.animation.values.liftLeftWing;
  setTimeout(function(){
    accelerationL = 10 *(geofs.animation.values.liftLeftWing - lastWingPosL) / geofs.animation.values.defL + 1;
    accelerationR = 10 *(geofs.animation.values.liftRightWing - lastWingPosR) / geofs.animation.values.defR + 1;
  }, 10)
}

accelInt = setInterval(function(){
  getAccel()
},10)

function applyInertia() {
  geofs.animation.values.defL = ((accelerationL) * lastWingPosL) * -100000;
  geofs.animation.values.defR = ((accelerationR) * lastWingPosR) * -100000;
}

/*
geofs.aircraft.instance.setup.parts[2].animations[0].function = "{return geofs.animation.values.defL}"
geofs.aircraft.instance.setup.parts[3].animations[0].function = "{return geofs.animation.values.defL}"
geofs.aircraft.instance.setup.parts[4].animations[0].function = "{return geofs.animation.values.defL}"

geofs.aircraft.instance.setup.parts[25].animations[0].function = "{return geofs.animation.values.defR}"
geofs.aircraft.instance.setup.parts[26].animations[0].function = "{return geofs.animation.values.defR}"
geofs.aircraft.instance.setup.parts[27].animations[0].function = "{return geofs.animation.values.defR}"
*/


let lastFlapPos = 0;
let lastFlapTarg = 0;

function getFlapsSound() {
  if (geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
    if (geofs.animation.values.flapsPosition != lastFlapPos) {
      geofs.animation.values.flapsSound = 1;
    }
    else {
      geofs.animation.values.flapsSound = 0;
    }
  }
  else {
    geofs.animation.values.flapsSound = 0;
  }
  lastFlapPos = geofs.animation.values.flapsPosition;
}


function getFlapsClick() {
  if (geofs.camera.currentModeName == "cockpit") {
    if (lastFlapTarg != geofs.animation.values.flapsTarget) {
      geofs.animation.values.flapsClick = 1;
      setTimeout(function() {
        geofs.animation.values.flapsClick = 0;
      }, 200)
    }
  }
  else {
    geofs.animation.values.flapsClick = 0;
  }
  lastFlapTarg = geofs.animation.values.flapsTarget
}

let lastTrim = 0;

function getTrimSound() {
  if (geofs.camera.currentModeName == "cockpit") {
    if (lastTrim != geofs.animation.values.trim) {
      geofs.animation.values.trimSound = 1;
    }
    else {
      geofs.animation.values.trimSound = 0;      
    }
  }
  else {
    geofs.animation.values.trimSound = 0;
  }
  lastTrim = geofs.animation.values.trim
}

//ground effect sound sensing

function getGroundSound() {
  if (geofs.animation.values.haglFeet < 20) {
        geofs.animation.values.groundSound = (-(geofs.animation.values.haglFeet) + 20) * (geofs.animation.values.kias / 10) / 500;
  }
  else {
    geofs.animation.values.groundSound = 0;
  }
}

function getGearThud() {
  if (geofs.animation.values.gearPosition != 0 && geofs.animation.values.gearPosition != 1) {
    geofs.animation.values.gearThud = 1;
  }
  else {
    geofs.animation.values.gearThud = 0;
  }
}

function getSpoilerSound() {
  if (geofs.animation.values.airbrakesPosition != 0) {
    geofs.animation.values.spoilersSound = geofs.animation.values.airbrakesPosition * (geofs.animation.values.kias / 10)
  }
  else {
    geofs.animation.values.spoilersSound = 0;
  }
}

function getShake() {
  if (geofs.animation.values.tdHard == 1 || geofs.animation.values.tdSoft == 1) {
    geofs.animation.values.shake = Math.random() * (geofs.animation.values.climbrate / 10)
      return;
  }
  if (geofs.animation.values.groundContact == 1) {
    geofs.animation.values.shake = geofs.animation.values.kias * Math.random();
  }
  else {
    geofs.animation.values.shake = geofs.animation.values.aoa * Math.random();
  }

}

function overspeed() {
  if (geofs.camera.currentModeName == "cockpit") {
  if (geofs.animation.values.kias >= 450) {
    geofs.animation.values.overspeed = 1;
  }
  else {
    geofs.animation.values.overspeed = 0;
    }
  }
  else {
    geofs.animation.values.overspeed = 0;
  }
}

let lastGC = 0;
let lastGCF = 0;
let noseDown = 0;

function getTouch() {
  if (lastGC != geofs.animation.values.groundContact && geofs.animation.values.groundContact != 0) {
    if (Math.abs(geofs.animation.values.climbrate) >= 1000) {
      geofs.animation.values.tdSoft = 0;
      geofs.animation.values.tdHard = 1;
      setTimeout(function(){
        geofs.animation.values.tdHard = 0;
      }, 1000)
    }
    else {
      if (geofs.animation.values.climbrate >= -1000) {
        geofs.animation.values.paxClap = 1;
        setTimeout(function(){
          geofs.animation.values.paxClap = 0;
        }, 5000)
      }
      geofs.animation.values.tdSoft = 1;
      geofs.animation.values.tdHard = 0;
      setTimeout(function(){
        geofs.animation.values.tdSoft = 0;
      }, 1000)
    }
  }
  lastGC = geofs.animation.values.groundContact;
};


function getFrontTouch() {
  if (geofs.animation.values.nose_suspensionSuspension > 0) {
    noseDown = 1;
  }
  else {
    noseDown = 0;
  }

  if (lastGCF != noseDown && noseDown != 0 && geofs.camera.currentModeName === "cockpit") {
    geofs.animation.values.tdFront = 1;
    setTimeout(function(){
      geofs.animation.values.tdFront = 0;
    }, 1000)
  }
  lastGCF = noseDown;
};

function doShake() {

  getShake() 
  geofs.camera.translate(0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake)
  setTimeout(function(){
    geofs.camera.translate(-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake)
  },1)
}

function getRainVol() {
  if (geofs.camera.currentModeName != "cockpit") {
    geofs.animation.values.rainVol = 0;
    return;
  }
  if (weather.definition.precipitationAmount != 0 && weather.definition.precipitationType === "rain") {
    if (geofs.animation.values.altitudeMeters <= weather.definition.ceiling) {
      geofs.animation.values.rainVol = (clamp(weather.definition.precipitationAmount, 0, 10) * geofs.animation.values.kias / 2)/1000
    }
    else {
      geofs.animation.values.rainVol = 0;
    }
  }
  else {
    geofs.animation.values.rainVol = 0;
  }
}

//find direction from camera in degrees. 0 should be directly behind, 90 is to the left of the plane, 180 is in front, and 270 is to the right.
function radians(n) {
  return n * (Math.PI / 180);
};

function degrees(n) {
  return n * (180 / Math.PI);
};

function getCameraDirection() {
  var a = geofs.api.getCameraLla(geofs.camera.cam);
  var b = geofs.aircraft.instance.llaLocation;
  var startLat = radians(a[0]);
  var startLong = radians(a[1]);
  var endLat = radians(b[0]);
  var endLong = radians(b[1]);

  let dLong = endLong - startLong;

  let dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 270.0) % 360.0;
};

//split camera into front and backblast sound cones, front and sides should sound the same, while the back should play a backblast sound.
function checkPos() {
    var a = (getCameraDirection() - geofs.animation.values.heading360) % 360;
    var b = radians(a);
    var c = Math.cos(b);
    var d = Math.sin(b);
    var e = clamp((clamp(d, 0, 1) + Math.abs(c)), 0, 1)
    var f = clamp((clamp(-d, 0, 1) - Math.abs(c)), 0, 1)
    return [e,f]; // e is front sound, f is backblast
  };

//get distance from aircraft
function camDist() {
    var R = 6371 // km
    var lat1 = radians(geofs.api.getCameraLla(geofs.camera.cam)[0])
    var lat2 = radians(geofs.aircraft.instance.llaLocation[0])
    var lon1 = radians(geofs.api.getCameraLla(geofs.camera.cam)[1])
    var lon2 = radians(geofs.aircraft.instance.llaLocation[1])
    var dLat = radians(lat2 - lat1)
    var dLon = radians(lon2 - lon1)


    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d * 1000
};

function findVolumes() {
  var scalar = 100;
  var d = camDist() * 2;
  var v = -0.005 * (((d * 10) - 100) * ((d * 10) - 100)) + 100;
  var v1 = (scalar * -d) + 1000;
  return [clamp(v1/100, 0, 100), clamp(v*10, 0, 10000)];
};

//mix all sound functions
function getFinalSoundVolumes() {
  if (geofs.camera.currentModeName != "cockpit" && geofs.camera.currentModeName != "Left wing" && geofs.camera.currentModeName != "Right wing") {
  var rpm = geofs.animation.values.rpm / 10
  var vClose = findVolumes()[0];
  var vFar = findVolumes()[1];
  var vDf = checkPos()[0];
  var vDb = checkPos()[1];
  var finalVf = vClose * vDf * rpm;
  var finalVb = (vClose * vDb * rpm * 10);
    geofs.animation.values.engSoundMultF = finalVf;
    geofs.animation.values.engSoundMultR = vDb/2 * 7000 * clamp(geofs.animation.values.rpm, 0, 1);
    geofs.animation.values.engSoundFar = vFar;
    geofs.animation.values.volumeCabin = 0;
  }

  else {
    geofs.animation.values.engSoundMultF = 0;
    geofs.animation.values.engSoundMultR = 0;
    geofs.animation.values.engSoundFar = 0;
    geofs.animation.values.volumeCabin = geofs.animation.values.rpm;
  }

}

function checkReverse() {
  if (geofs.animation.values.throttle < 0) {
    geofs.animation.values.reverseThrustVol = Math.abs(geofs.animation.values.throttle) * 10
  }
  else {
    geofs.animation.values.reverseThrustVol = 0;
  }
}

function checkCabin() {
  if (geofs.animation.values.volumeCabin > 0) {
    geofs.animation.values.cabinAmb = 1;
  }
  else {
    geofs.animation.values.cabinAmb = 0;
  }
}

//assign new sounds
function assignSounds() {
geofs.aircraft.instance.definition.sounds[0].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/englowfront.ogg"
geofs.aircraft.instance.definition.sounds[0].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[0].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[1].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/engmidfront.ogg"
geofs.aircraft.instance.definition.sounds[1].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[1].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[2].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighestfront.ogg"
geofs.aircraft.instance.definition.sounds[2].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[2].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[3].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737rolling.mp3"
  

geofs.aircraft.instance.definition.sounds[7] = {};
    geofs.aircraft.instance.definition.sounds[7].id = "rpmback";
geofs.aircraft.instance.definition.sounds[7].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighback.ogg"
geofs.aircraft.instance.definition.sounds[7].effects = {"volume": {"value": "engSoundMultR", "ramp": [6000, 10000, 20000, 50000]},"pitch": {"value": "rpm", "ramp": [1000, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

geofs.aircraft.instance.definition.sounds[8] = {};
  geofs.aircraft.instance.definition.sounds[8].id = "rpmback1";
geofs.aircraft.instance.definition.sounds[8].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighback.ogg"
geofs.aircraft.instance.definition.sounds[8].effects = {"volume": {"value": "engSoundMultR", "ramp": [100, 500, 2000, 10000]},"pitch": {"value": "rpm", "ramp": [1000, 20000, 20000, 20000], "ratio": 1, "offset": 1}}


  geofs.aircraft.instance.definition.sounds[9] = {};
geofs.aircraft.instance.definition.sounds[9].id = "flapswarn"
  geofs.aircraft.instance.definition.sounds[9].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlf.mp3"
geofs.aircraft.instance.definition.sounds[9].effects = {"start": {"value": "isFlapsWarn"}}

  geofs.aircraft.instance.definition.sounds[10] = {};
geofs.aircraft.instance.definition.sounds[10].id = "terrainwarn"
  geofs.aircraft.instance.definition.sounds[10].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlt.mp3"
geofs.aircraft.instance.definition.sounds[10].effects = {"start": {"value": "isTerrainWarn"}}

  geofs.aircraft.instance.definition.sounds[11] = {};
geofs.aircraft.instance.definition.sounds[11].id = "pullwarn"
  geofs.aircraft.instance.definition.sounds[11].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/pullup.mp3"
geofs.aircraft.instance.definition.sounds[11].effects = {"start": {"value": "isPullupWarn"}}

  geofs.aircraft.instance.definition.sounds[12] = {};
geofs.aircraft.instance.definition.sounds[12].id = "bankangle"
  geofs.aircraft.instance.definition.sounds[12].file = ""
geofs.aircraft.instance.definition.sounds[12].effects = {"start": {"value": "isBankWarn"}}

  geofs.aircraft.instance.definition.sounds[13] = {};
geofs.aircraft.instance.definition.sounds[13].id = "1000"
  geofs.aircraft.instance.definition.sounds[13].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/1000gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[13].effects = {"start": {"value": "gpws1000"}}

  geofs.aircraft.instance.definition.sounds[14] = {};
geofs.aircraft.instance.definition.sounds[14].id = "500"
  geofs.aircraft.instance.definition.sounds[14].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/500correct.mp3"
geofs.aircraft.instance.definition.sounds[14].effects = {"start": {"value": "gpws500"}}

  geofs.aircraft.instance.definition.sounds[15] = {};
geofs.aircraft.instance.definition.sounds[15].id = "400"
  geofs.aircraft.instance.definition.sounds[15].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/400gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[15].effects = {"start": {"value": "gpws400"}}

  geofs.aircraft.instance.definition.sounds[16] = {};
geofs.aircraft.instance.definition.sounds[16].id = "300"
  geofs.aircraft.instance.definition.sounds[16].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/300gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[16].effects = {"start": {"value": "gpws300"}}

  geofs.aircraft.instance.definition.sounds[17] = {};
geofs.aircraft.instance.definition.sounds[17].id = "200"
  geofs.aircraft.instance.definition.sounds[17].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/200gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[17].effects = {"start": {"value": "gpws200"}}

  geofs.aircraft.instance.definition.sounds[18] = {};
geofs.aircraft.instance.definition.sounds[18].id = "100"
  geofs.aircraft.instance.definition.sounds[18].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/100gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[18].effects = {"start": {"value": "gpws100"}}

  geofs.aircraft.instance.definition.sounds[19] = {};
geofs.aircraft.instance.definition.sounds[19].id = "50"
  geofs.aircraft.instance.definition.sounds[19].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/50gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[19].effects = {"start": {"value": "gpws50"}}

  geofs.aircraft.instance.definition.sounds[20] = {};
geofs.aircraft.instance.definition.sounds[20].id = "40"
  geofs.aircraft.instance.definition.sounds[20].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/40gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[20].effects = {"start": {"value": "gpws40"}}

  geofs.aircraft.instance.definition.sounds[21] = {};
geofs.aircraft.instance.definition.sounds[21].id = "30"
  geofs.aircraft.instance.definition.sounds[21].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/30gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[21].effects = {"start": {"value": "gpws30"}}

  geofs.aircraft.instance.definition.sounds[22] = {};
geofs.aircraft.instance.definition.sounds[22].id = "20"
  geofs.aircraft.instance.definition.sounds[22].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/20gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[22].effects = {"start": {"value": "gpws20"}}

  geofs.aircraft.instance.definition.sounds[23] = {};
geofs.aircraft.instance.definition.sounds[23].id = "10"
  geofs.aircraft.instance.definition.sounds[23].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/10gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[23].effects = {"start": {"value": "gpws10"}}

geofs.aircraft.instance.definition.sounds[24] = {};
geofs.aircraft.instance.definition.sounds[24].id = "TCAS";
geofs.aircraft.instance.definition.sounds[24].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/traffic.mp3";
geofs.aircraft.instance.definition.sounds[24].effects = {
	"start": {
		"value": "isTCAS"
	}
};

geofs.aircraft.instance.definition.sounds[25] = {};
geofs.aircraft.instance.definition.sounds[25].id = "climb";
geofs.aircraft.instance.definition.sounds[25].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/climb.mp3";
geofs.aircraft.instance.definition.sounds[25].effects = {
	"start": {
		"value": "isTCASClimb"
	}
};

geofs.aircraft.instance.definition.sounds[26] = {};
geofs.aircraft.instance.definition.sounds[26].id = "descend";
geofs.aircraft.instance.definition.sounds[26].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/descend.mp3";
geofs.aircraft.instance.definition.sounds[26].effects = {
	"start": {
		"value": "isTCASDescend"
	}
};

geofs.aircraft.instance.definition.sounds[27] = {};
geofs.aircraft.instance.definition.sounds[27].id = "clear";
geofs.aircraft.instance.definition.sounds[27].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/clear.mp3";
geofs.aircraft.instance.definition.sounds[27].effects = {
	"start": {
		"value": "isTCASClear"
	}
};

  geofs.aircraft.instance.definition.sounds[28] = {};
geofs.aircraft.instance.definition.sounds[28].id = "rpmin1";
geofs.aircraft.instance.definition.sounds[28].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/lowcab.ogg";
geofs.aircraft.instance.definition.sounds[28].effects = {"volume": {"value": "volumeCabin", "ramp": [800, 950, 2500, 3500]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

  geofs.aircraft.instance.definition.sounds[29] = {};
geofs.aircraft.instance.definition.sounds[29].id = "rpmin2";
geofs.aircraft.instance.definition.sounds[29].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/midcab.ogg";
geofs.aircraft.instance.definition.sounds[29].effects = {"volume": {"value": "volumeCabin", "ramp": [1000, 2500, 10000, 10000]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

    geofs.aircraft.instance.definition.sounds[30] = {};
geofs.aircraft.instance.definition.sounds[30].id = "buzzsaw";
geofs.aircraft.instance.definition.sounds[30].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/buzzsawcab.ogg";
geofs.aircraft.instance.definition.sounds[30].effects = {"volume": {"value": "volumeCabin", "ramp": [3000, 10000, 20000, 20000]}};

  geofs.aircraft.instance.definition.sounds[31] = {};
geofs.aircraft.instance.definition.sounds[31].id = "reverse";
geofs.aircraft.instance.definition.sounds[31].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737reverse.mp3";
geofs.aircraft.instance.definition.sounds[31].effects = {"volume": {"value": "reverseThrustVol", "ramp": [0, 100, 1000, 2500]}};

geofs.aircraft.instance.definition.sounds[32] = {};
geofs.aircraft.instance.definition.sounds[32].id = "system";
geofs.aircraft.instance.definition.sounds[32].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737-800_cabin_system.mp3";
geofs.aircraft.instance.definition.sounds[32].effects = {
	"start": {
		"value": "cabinAmb"
	}
};
geofs.aircraft.instance.definition.sounds[33] = {};
geofs.aircraft.instance.definition.sounds[33].id = "pax";
geofs.aircraft.instance.definition.sounds[33].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737-800_cabin_ambience.mp3";
geofs.aircraft.instance.definition.sounds[33].effects = {
	"start": {
		"value": "cabinAmb"
	}
};

geofs.aircraft.instance.definition.sounds[34] = {};
geofs.aircraft.instance.definition.sounds[34].id = "touchH";
geofs.aircraft.instance.definition.sounds[34].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/hardtouch1.mp3";
geofs.aircraft.instance.definition.sounds[34].effects = {
	"start": {
		"value": "tdHard"
	},
  "volume": {
    "ratio": 0.1
  }
};

geofs.aircraft.instance.definition.sounds[35] = {};
geofs.aircraft.instance.definition.sounds[35].id = "touchS";
geofs.aircraft.instance.definition.sounds[35].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/softtouch1.mp3";
geofs.aircraft.instance.definition.sounds[35].effects = {
	"start": {
		"value": "tdSoft"
	},
  "volume": {
    "value": "tdSoft",
    "ratio": 1
  }
};

geofs.aircraft.instance.definition.sounds[36] = {};
geofs.aircraft.instance.definition.sounds[36].id = "overspeed";
geofs.aircraft.instance.definition.sounds[36].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_overspeed.mp3";
geofs.aircraft.instance.definition.sounds[36].effects = {
	"start": {
		"value": "overspeed"
	}
};

geofs.aircraft.instance.definition.sounds[37] = {};
geofs.aircraft.instance.definition.sounds[37].id = "gearThud";
geofs.aircraft.instance.definition.sounds[37].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/wheelthud.mp3";
geofs.aircraft.instance.definition.sounds[37].effects = {
	"start": {
		"value": "gearThud"
	}
};

geofs.aircraft.instance.definition.sounds[38] = {};
geofs.aircraft.instance.definition.sounds[38].id = "rain";
geofs.aircraft.instance.definition.sounds[38].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_rain.mp3";
geofs.aircraft.instance.definition.sounds[38].effects = {
	"volume": {
		"value": "rainVol",
    "ratio": 1
	}
};

geofs.aircraft.instance.definition.sounds[39] = {};
geofs.aircraft.instance.definition.sounds[39].id = "groundwind";
geofs.aircraft.instance.definition.sounds[39].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/groundeffect1.mp3";
geofs.aircraft.instance.definition.sounds[39].effects = {
	"volume": {
		"value": "groundSound",
    "ratio": 1
	}
};

geofs.aircraft.instance.definition.sounds[40] = {};
geofs.aircraft.instance.definition.sounds[40].id = "flapsClick";
geofs.aircraft.instance.definition.sounds[40].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/flapslever.mp3";
geofs.aircraft.instance.definition.sounds[40].effects = {
	"start": {
		"value": "flapsClick"
	}
};

geofs.aircraft.instance.definition.sounds[41] = {};
geofs.aircraft.instance.definition.sounds[41].id = "flapsSound";
geofs.aircraft.instance.definition.sounds[41].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737flaps.mp3";
geofs.aircraft.instance.definition.sounds[41].effects = {
	"start": {
		"value": "flapsSound"
	}
};

geofs.aircraft.instance.definition.sounds[42] = {};
geofs.aircraft.instance.definition.sounds[42].id = "trim";
geofs.aircraft.instance.definition.sounds[42].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_trim.mp3";
geofs.aircraft.instance.definition.sounds[42].effects = {
	"start": {
		"value": "trimSound"
	}
};

geofs.aircraft.instance.definition.sounds[43] = {};
geofs.aircraft.instance.definition.sounds[43].id = "clap";
geofs.aircraft.instance.definition.sounds[43].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/paxclap1.mp3";
geofs.aircraft.instance.definition.sounds[43].effects = {
	"start": {
		"value": "paxClap"
	}
};

geofs.aircraft.instance.definition.sounds[44] = {};
geofs.aircraft.instance.definition.sounds[44].id = "scream";
geofs.aircraft.instance.definition.sounds[44].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/paxscream.mp3";
geofs.aircraft.instance.definition.sounds[44].effects = {
	"start": {
		"value": "paxScream"
	}
};

geofs.aircraft.instance.definition.sounds[45] = {};
geofs.aircraft.instance.definition.sounds[45].id = "frontgearthump";
geofs.aircraft.instance.definition.sounds[45].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/nosetouch.ogg";
geofs.aircraft.instance.definition.sounds[45].effects = {
	"start": {
		"value": "tdFront"
	}
};
  geofs.aircraft.instance.definition.sounds[46] = {};
geofs.aircraft.instance.definition.sounds[46].id = "rpfar";
geofs.aircraft.instance.definition.sounds[46].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/engfar.mp3";
geofs.aircraft.instance.definition.sounds[46].effects = {"volume": {"value": "engSoundFar", "ramp": [0, 2000, 10000, 10000]}}
	
    geofs.aircraft.instance.definition.sounds[47] = {};
geofs.aircraft.instance.definition.sounds[47].id = "spool";
geofs.aircraft.instance.definition.sounds[47].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/spoolcab.mp3";
geofs.aircraft.instance.definition.sounds[47].effects = {"volume": {"value": "volumeCabin", "ramp": [1500, 6000, 7000, 8000]}, "pitch": {"value": "rpm", "ramp": [3500, 10000, 20000, 20000], "ratio": 1, "offset": 1}};	

geofs.aircraft.instance.definition.sounds[48] = {};
geofs.aircraft.instance.definition.sounds[48].id = "taxiBump"
geofs.aircraft.instance.definition.sounds[48].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/bump.mp3"
geofs.aircraft.instance.definition.sounds[48].effects = {"start": {"value": "bump"}}
	
audio.init(geofs.aircraft.instance.definition.sounds)
geofs.aircraft.instance.definition.sounds[0].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[0].effects.volume.ramp = [100, 500, 2000, 10000]
geofs.aircraft.instance.definition.sounds[1].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[2].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ramp = [0, 50, 1000, 1000]
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 1
geofs.aircraft.instance.definition.sounds[7].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[8].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[46].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[28].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[29].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[30].effects.volume.ratio = 350
geofs.aircraft.instance.definition.sounds[31].effects.volume.ratio = 750
geofs.aircraft.instance.definition.sounds[34].effects.volume.ratio = 1
geofs.aircraft.instance.definition.sounds[39].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[47].effects.volume.ratio = 90
geofs.aircraft.instance.definition.sounds[48].effects.volume = {};
geofs.aircraft.instance.definition.sounds[48].effects.volume.ratio = 2;
}
assignSounds()


function groundEffect() {
  if (geofs.animation.values.haglFeet <= 100) {
    geofs.aircraft.instance.rigidBody.applyCentralImpulse([0,0,(-(geofs.animation.values.haglFeet) + 100) * geofs.animation.values.kias] / 10)
  }
}

let restingPoint = 5.152139372973117

//detect and execute GPWS callouts
let isApprConfig = false;
 geofs.animation.values.isFlapsWarn = 0;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isTerrainWarn = 0;
 geofs.animation.values.isPullupWarn = 0;
 geofs.animation.values.isBankWarn = 0;
 geofs.animation.values.gpws1000 = 0;
 geofs.animation.values.gpws500 = 0;
 geofs.animation.values.gpws400 = 0;
 geofs.animation.values.gpws300 = 0;
 geofs.animation.values.gpws200 = 0;
 geofs.animation.values.gpws100 = 0;
 geofs.animation.values.gpws50 = 0;
 geofs.animation.values.gpws40 = 0;
 geofs.animation.values.gpws30 = 0;
 geofs.animation.values.gpws20 = 0;
 geofs.animation.values.gpws10 = 0;
geofs.animation.values.isTCASClimb = 0;
geofs.animation.values.isTCASDescend = 0;
geofs.animation.values.isTCAS = 0;
geofs.animation.values.isTCASClear = 0;

function getGearFlapsWarn() {
if (geofs.animation.values.groundContact == 1) {
  geofs.animation.values.isGearWarn = 0;
  geofs.animation.values.isFlapsWarn = 0;
  return;
}
	if (geofs.animation.values.haglFeet <= 500 && geofs.animation.values.gearPosition == 1 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isGearWarn = 1;
	} else {
		geofs.animation.values.isGearWarn = 0;
	}

	if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.flapsPosition == 0 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isFlapsWarn = 1;
	} else {
		geofs.animation.values.isFlapsWarn = 0;
	}
}

function testTerrainorAppr() {
	if (geofs.animation.values.gearPosition == 0) {
		if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -100 && geofs.animation.values.climbrate >= -5000 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.isFlapsWarn == 0 && isApprConfig == 0) {
			geofs.animation.values.isTerrainWarn = 1;
		} else {
			geofs.animation.values.isTerrainWarn = 0;
		}

		if (geofs.animation.values.haglFeet <= 5000 && geofs.animation.values.climbrate <= -2000 || geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -5000) {
			geofs.animation.values.isPullupWarn = 1;
		} else {
			geofs.animation.values.isPullupWarn = 0;
		}
	} else {
		geofs.animation.values.isTerrainWarn = 0;
    geofs.animation.values.isPullupWarn = 0;
		return;
	}
}


function testForApproach(){
  if (geofs.animation.values.isFlapsWarn == 0 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.climbrate <= -1){
    isApprConfig = true
  }
  else{
    isApprConfig = false
  }
}

function doRadioAltCall(){
  if (isApprConfig){
  if (geofs.animation.values.haglFeet <= 1000 + restingPoint && geofs.animation.values.haglFeet >= 900 + restingPoint){
    geofs.animation.values.gpws1000 = 1;
  }
  else{
    geofs.animation.values.gpws1000 = 0;
  }
   if (geofs.animation.values.haglFeet <= 500 + restingPoint && geofs.animation.values.haglFeet >= 400 + restingPoint){
    geofs.animation.values.gpws500 = 1;
  }
  else{
    geofs.animation.values.gpws500 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 400 + restingPoint && geofs.animation.values.haglFeet >= 300 + restingPoint){
    geofs.animation.values.gpws400 = 1;
  }
  else{
    geofs.animation.values.gpws400 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 300 + restingPoint && geofs.animation.values.haglFeet >= 200 + restingPoint){
    geofs.animation.values.gpws300 = 1;
  }
  else{
    geofs.animation.values.gpws300 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 200 + restingPoint && geofs.animation.values.haglFeet >= 100 + restingPoint){
    geofs.animation.values.gpws200 = 1;
  }
  else{
    geofs.animation.values.gpws200 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 100 + restingPoint && geofs.animation.values.haglFeet >= 50 + restingPoint){
    geofs.animation.values.gpws100 = 1;
  }
  else{
    geofs.animation.values.gpws100 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 50 + restingPoint && geofs.animation.values.haglFeet >= 40 + restingPoint){
    geofs.animation.values.gpws50 = 1;
  }
  else{
    geofs.animation.values.gpws50 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 40 + restingPoint && geofs.animation.values.haglFeet >= 30 + restingPoint){
    geofs.animation.values.gpws40 = 1;
  }
  else{
    geofs.animation.values.gpws40 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 30 + restingPoint && geofs.animation.values.haglFeet >= 20 + restingPoint){
    geofs.animation.values.gpws30 = 1;
  }
  else{
    geofs.animation.values.gpws30 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 20 + restingPoint && geofs.animation.values.haglFeet >= 10 + restingPoint){
    geofs.animation.values.gpws20 = 1;
  }
  else{
    geofs.animation.values.gpws20 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 10 + restingPoint && geofs.animation.values.haglFeet >= 5 + restingPoint){
    geofs.animation.values.gpws10 = 1;
  }
  else{
    geofs.animation.values.gpws10 = 0;
  } 
}
  else {
    geofs.animation.values.gpws1000 = 0;
    geofs.animation.values.gpws500 = 0;
    geofs.animation.values.gpws400 = 0;
    geofs.animation.values.gpws300 = 0;
    geofs.animation.values.gpws200 = 0;
    geofs.animation.values.gpws100 = 0;
    geofs.animation.values.gpws50 = 0;
    geofs.animation.values.gpws40 = 0;
    geofs.animation.values.gpws30 = 0;
    geofs.animation.values.gpws20 = 0;
    geofs.animation.values.gpws10 = 0;
  }
}






soundInt = setInterval(function(){
  getFinalSoundVolumes();
  //groundEffect();
  getGearFlapsWarn();
  testForApproach();
  testTerrainorAppr();
  doRadioAltCall();
  checkReverse();
  checkCabin();
  doShake();
  getGroundSound();
  getGearThud();
  overspeed();
  getRainVol();
  getTouch();
  getTrimSound();
  getFlapsSound();
  getFlapsClick();
  resetLift();
  applyInertia();
  getPaxCheer();
  getScream();
  getFrontTouch();
  bumpCount()
}, 10)


let alreadyChecked = false;
function doTrafficCheck() {
  geofs.animation.values.isTCASDescend = 0;
  geofs.animation.values.isTCASClimb = 0;
  Object.values(multiplayer.visibleUsers).forEach(function(e) {
    if (e.distance <= 1000) {
      if (alreadyChecked) {
        return;
      }
      geofs.animation.values.isTCAS = 1;
      setTimeout(function(){
         alreadyChecked = true
        geofs.animation.values.isTCAS = 0;
      }, 1000)
    }
})
  getTrafficProximity()
}

function getTrafficProximity() {
  if (geofs.animation.values.isTCAS == 1) {
    return;
  }
	Object.values(multiplayer.visibleUsers).forEach(function(e) {
		if (e.distance <= 1000) {
			if (e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters + 1000) {
				geofs.animation.values.isTCASDescend = 1;
				} else {
					geofs.animation.values.isTCASDescend = 0;
				}
				if (e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters - 1000) {
					geofs.animation.values.isTCASClimb = 1;

				} else {
					geofs.animation.values.isTCASClimb = 0;
				}
			}
	});
  if (geofs.animation.values.isTCASClimb == 0 && geofs.animation.values.isTCASDescend == 0) {
    alreadyChecked = false
  }
}


tcasIntervalAnnounce = setInterval(function() {
  if (geofs.animation.values.altitudeMeters >= 1000) {
  doTrafficCheck();
  }
}, 200)



geofs.animation.values.flexl = 0;
geofs.animation.values.flexr = 0;

function getds() {
  dsl = geofs.animation.values.flexl + geofs.aircraft.instance.parts['leftwing'].lift + (geofs.animation.values.accZ - 9.8) * 30;
  dsr = geofs.animation.values.flexr + geofs.aircraft.instance.parts['rightwing'].lift + (geofs.animation.values.accZ - 9.8) * 30;
}

function spring() {
  getds();
  var ldsl = dsl;
  var ldsr = dsr;
  var fl = -k * dsl;
  var fr = -k * dsr;
  dml = dc * vl;
  dmr = dc * vr;
  var al = (fl + dml) / m;
  var ar = (fr + dmr) / m;
  vl += al * rrate;
  vr += ar * rrate;
  geofs.animation.values.flexl += vl * rrate;
  geofs.animation.values.flexr += vr * rrate;
}

geofs.aircraft.instance.setup.parts[2].animations[0].function = "{return -geofs.animation.values.flexl}"
geofs.aircraft.instance.setup.parts[3].animations[0].function = "{return -geofs.animation.values.flexl}"
geofs.aircraft.instance.setup.parts[4].animations[0].function = "{return -geofs.animation.values.flexl}"

geofs.aircraft.instance.setup.parts[25].animations[0].function = "{return -geofs.animation.values.flexr}"
geofs.aircraft.instance.setup.parts[26].animations[0].function = "{return -geofs.animation.values.flexr}"
geofs.aircraft.instance.setup.parts[27].animations[0].function = "{return -geofs.animation.values.flexr}"

flexInterval = setInterval(function(){
  spring();
}, frameD)
//yaw damper
geofs.animation.values.rudderDamp = 0;

function yawDamper() {
  if (geofs.animation.values.haglFeet <= 200) {
    geofs.animation.values.rudderDamp = geofs.animation.values.yaw;
  } else {
    var av = geofs.aircraft.instance.rigidBody.v_angularVelocity[2] * 30
    geofs.animation.values.rudderDamp = geofs.animation.values.yaw - (av / (1 / geofs.animation.values.pitch * 40))
  }
}

geofs.aircraft.instance.parts.rudder.animations[0].value = "rudderDamp";
setInterval(function(){yawDamper();},10)
