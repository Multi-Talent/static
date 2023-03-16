//google map

function initMap() {
  // Styles a map in night mode.
  var styledMapType = new google.maps.StyledMapType(
    [
    {
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#212121"
      }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
      {
        "visibility": "off"
      }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#757575"
      }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
      {
        "color": "#212121"
      }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#757575"
      }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#9e9e9e"
      }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
      {
        "visibility": "off"
      }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#bdbdbd"
      }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#757575"
      }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#181818"
      }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#616161"
      }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
      {
        "color": "#1b1b1b"
      }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
      {
        "visibility": "off"
      }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
      {
        "color": "#2c2c2c"
      }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#8a8a8a"
      }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#373737"
      }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#3c3c3c"
      }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#4e4e4e"
      }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#616161"
      }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#757575"
      }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#000000"
      }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
      {
        "color": "#3d3d3d"
      }
      ]
    }
    ],
    {name: 'Dark Map'}
    );

  // Create a map object, and include the MapTypeId to add
  // to the map type control.

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.647, lng: 37.581},
    zoom: 3,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
      'styled_map']
    }
  });
  var latlng = {lat: 55.647, lng: 37.581}
  var image = 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/map-marker-icon.png';
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    icon: image,
    title: 'Hello World'
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
}