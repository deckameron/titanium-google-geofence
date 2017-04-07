var geoFence = require('google.geofence');
	
var win = Ti.UI.createWindow({
	backgroundColor : 'white'
}); 

var monitoring = false;
var fences = null;
var label = Ti.UI.createLabel({
	color : 'black',
	text : 'Label'
});
win.add(label);

var button = Titanium.UI.createButton({
	top : 200,
	title : 'Button'
});
win.add(button);

button.addEventListener('click', function(){
	Titanium.API.warn('Button - click');
	Titanium.Geolocation.requestLocationPermissions(Titanium.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		if (!e.success) {
			alert('Error -> User did not allow me to get his location.');
		} else {
			alert('Ongoing -> Can ask for location.');
			Geofence();
		}
		return;
	});
	
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.success) {
			Geofence();
		}
	});
});

geoFence.addEventListener('enterregions', function(e) {
	var regions = JSON.parse(e.regions);
	Ti.API.warn("Entered geofence: " + JSON.stringify(e));
	label.setText("Entered geofence: " + regions[0].identifier);
});

geoFence.addEventListener('exitregions', function(e) {
	var regions = JSON.parse(e.regions);
	Ti.API.warn("Exited geofence: " + regions.identifier);
	label.setText("Exiting geofence: " + regions[0].identifier);
});

geoFence.addEventListener('error', function(e) {
	Ti.API.warn(JSON.stringify(e));
	label.setText("ERROR geofence: " + regions[0].identifier);
});

geoFence.addEventListener('removeregions', function(e) {
	label.setText("Removing regions: " + JSON.stringify(e));
	monitoring = false;
	geoFence.startMonitoringForRegions(JSON.stringify(fences));
});

geoFence.addEventListener('monitorregions', function(e) {
	label.setText("Monitoring regions: " + JSON.stringify(e));
	monitoring = true;
});

if (fences != null) {
	fences = null;
}

fences = [{
	"center" : {
		latitude : -19.933666,	//change these coordinates for testing and or use a location spoofer app to test locations outside of your area.
		longitude : -43.927011
	},
	identifier : "test",
	radius : 100
}];

function Geofence(){
	
	Titanium.API.info('GEOFENCE');
	
	if (monitoring) {
		label.setText('Stopped monitoring');
		geoFence.stopMonitoringAllRegions();
	} else {
		label.setText('Started monitoring');
		geoFence.startMonitoringForRegions(JSON.stringify(fences));
	}
}

win.open();
