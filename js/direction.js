var waypts = [];

$('#submitWP').on('click',addWayPoint);

//helper functions
function addWayPoint(e){
  e.preventDefault();
  var $WPOutput = $('#WPOutput');
  var waypt = {
    location: $('#waypoint').val(),
    stopover: true
  };
    waypts.push(waypt) ;
    $WPOutput.html('');
    waypts.forEach(function(waypt){
      $WPOutput.append(waypt.location+'<br>');
    });
}

function sum (prev, current){
  return prev+current;
}

//Calling routing and mapping functions
function initMap (){
  console.log(1);
  var mapElem = $('#map')[0];
  var map = new google.maps.Map(mapElem,
            {
              zoom: 7,
              center: {lat: 45.5425909, lng: -122.7948514}  // Portland, OR
            });//end of specifying map obj
  //Declare variables as objs that will get passed to calculateAndDisplayRoute in the even listener below
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  directionsDisplay.setMap(map);
  //Event listener for submit 'button'
  $('#submit').on('click', function(e){
    e.preventDefault();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });//end of submit button event listener
}//end of initmap

function calculateAndDisplayRoute(directionsService, directionsDisplay){
  console.log(waypts);
  if (waypts.length >0){
    var request = {
      origin: $('#start').val(),
      destination: $('#end').val(),
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
  }
  else{
    var request = {
      origin: $('#start').val(),
      destination: $('#end').val(),
      travelMode: google.maps.TravelMode.DRIVING
    };
  }//end of if-else request preparation
  directionsService.route(request,function(response, status){
    if(status===google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
      var routes = response.routes;
      console.log(response);
      var $summaryPanel = $('#directions-panel');
      var $total = $('#total');
      $summaryPanel.html(''); //clear directions panel to display more output
      routes.forEach(function(route){
        var distances = [];
        var counter = 1;
        route.legs.forEach(function(leg){
          var routeSegment = '<b>Segment '+counter+'</b><br>';
          var start_address = 'Start: '+leg.start_address+'<br>';
          var end_address = 'End: '+leg.end_address+'<br>';
          var distance = leg.distance.text+'<br>';
          distances.push(leg.distance.value);
          var insert = routeSegment+start_address+end_address+distance;
          $summaryPanel.append(insert);
          counter++;
        });//end of route.leg.forEach
        var totalDistance = distances.reduce(sum);
        $total.append(Math.round(totalDistance*0.000621371*100)/100+' miles'+ '<br>');
      });//end of routes.forEach. Outputing distances, calculate prices
    }
    else{
      window.alert('Directions request failed due to ' + status);
    }
  });//end of directionsService.route call
}