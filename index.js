// Copyright 2022 Ariakim Taiyo

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
  if (geofs.animation.values.kias >= 300) {
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

function getTouch() {
  if (lastGC != geofs.animation.values.groundContact) {
    if (Math.abs(geofs.animation.values.climbrate) >= 1000) {
      geofs.animation.values.tdSoft = 0;
      geofs.animation.values.tdHard = 1;
      setTimeout(function(){
        geofs.animation.values.tdHard = 0;
      }, 1000)
    }
    else {
      geofs.animation.values.tdSoft = 1;
      geofs.animation.values.tdHard = 0;
      setTimeout(function(){
        geofs.animation.values.tdSoft = 0;
      }, 1000)
    }
  }
  lastGC = geofs.animation.values.groundContact;
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
  var scalar = 20;
  var d = camDist();
  var v = scalar * Math.sqrt(d) - (d/4);
  var v1 = (scalar * -d) + 1000;
  return [clamp(v1/100, 0, 100), clamp(v/100, 0, 100)];
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
geofs.aircraft.instance.definition.sounds[0].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737englowfront.mp3"
geofs.aircraft.instance.definition.sounds[0].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[0].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[1].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737engmidfront.mp3"
geofs.aircraft.instance.definition.sounds[1].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[1].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[2].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737enghighestfront.mp3"
geofs.aircraft.instance.definition.sounds[2].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[2].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[3].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737rolling.mp3"
  

geofs.aircraft.instance.definition.sounds[7] = {};
    geofs.aircraft.instance.definition.sounds[7].id = "rpmback";
geofs.aircraft.instance.definition.sounds[7].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737enghighback.mp3"
geofs.aircraft.instance.definition.sounds[7].effects = {"volume": {"value": "engSoundMultR", "ramp": [6000, 10000, 20000, 50000]},"pitch": {"value": "rpm", "ramp": [1000, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

geofs.aircraft.instance.definition.sounds[8] = {};
  geofs.aircraft.instance.definition.sounds[8].id = "rpmback1";
geofs.aircraft.instance.definition.sounds[8].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737enghighback.mp3"
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
geofs.aircraft.instance.definition.sounds[28].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737lowcab.mp3";
geofs.aircraft.instance.definition.sounds[28].effects = {"volume": {"value": "volumeCabin", "ramp": [800, 950, 2500, 3500]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

  geofs.aircraft.instance.definition.sounds[29] = {};
geofs.aircraft.instance.definition.sounds[29].id = "rpmin2";
geofs.aircraft.instance.definition.sounds[29].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737engmidcab.mp3";
geofs.aircraft.instance.definition.sounds[29].effects = {"volume": {"value": "volumeCabin", "ramp": [1000, 2500, 10000, 10000]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

    geofs.aircraft.instance.definition.sounds[30] = {};
geofs.aircraft.instance.definition.sounds[30].id = "buzzsaw";
geofs.aircraft.instance.definition.sounds[30].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737enghighestcab.mp3";
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
geofs.aircraft.instance.definition.sounds[34].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/hardtouch.mp3";
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
geofs.aircraft.instance.definition.sounds[35].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/softtouch.mp3";
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
geofs.aircraft.instance.definition.sounds[39].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/groundeffect.mp3";
geofs.aircraft.instance.definition.sounds[39].effects = {
	"volume": {
		"value": "groundSound",
    "ratio": 1
	}
};
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
  geofs.aircraft.instance.definition.sounds[28].effects.volume.ratio = 100
  geofs.aircraft.instance.definition.sounds[29].effects.volume.ratio = 100
  geofs.aircraft.instance.definition.sounds[30].effects.volume.ratio = 100
  geofs.aircraft.instance.definition.sounds[31].effects.volume.ratio = 750
  geofs.aircraft.instance.definition.sounds[34].effects.volume.ratio = 1
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
})


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
