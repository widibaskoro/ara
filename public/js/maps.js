google.maps.event.addDomListener(window, 'load', init);
   var map, markersArray = [];

   function bindInfoWindow(marker, map, location) {
       google.maps.event.addListener(marker, 'click', function() {
           function close(location) {
               location.ib.close();
               location.infoWindowVisible = false;
               location.ib = null;
           }

           if (location.infoWindowVisible === true) {
               close(location);
           } else {
               markersArray.forEach(function(loc, index){
                   if (loc.ib && loc.ib !== null) {
                       close(loc);
                   }
               });

               var boxText = document.createElement('div');
               boxText.style.cssText = 'background: #fff;';
               boxText.classList.add('md-whiteframe-2dp');

               function buildPieces(location, el, part, icon) {
                   if (location[part] === '') {
                       return '';
                   } else if (location.iw[part]) {
                       switch(el){
                           case 'photo':
                               if (location.photo){
                                   return '<div class="iw-photo" style="background-image: url(' + location.photo + ');"></div>';
                                } else {
                                   return '';
                               }
                               break;
                           case 'iw-toolbar':
                               return '<div class="iw-toolbar"><h3 class="md-subhead">' + location.title + '</h3></div>';
                               break;
                           case 'div':
                               switch(part){
                                   case 'email':
                                       return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' + location.email + '</a></span></div>';
                                       break;
                                   case 'web':
                                       return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted + '</a></span></div>';
                                       break;
                                   case 'desc':
                                       return '<label class="iw-desc" for="cb_details"><input type="checkbox" id="cb_details"/><h3 class="iw-x-details">Details</h3><i class="material-icons toggle-open-details"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><p class="iw-x-details">' + location.desc + '</p></label>';
                                       break;
                                   default:
                                       return '<div class="iw-details"><i class="material-icons"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span>' + location[part] + '</span></div>';
                                   break;
                               }
                               break;
                           case 'open_hours':
                               var items = '';
                               if (location.open_hours.length > 0){
                                   for (var i = 0; i < location.open_hours.length; ++i) {
                                       if (i !== 0){
                                           items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[i].hours +'</strong></li>';
                                       }
                                       var first = '<li><label for="cb_hours"><input type="checkbox" id="cb_hours"/><strong>' + location.open_hours[0].day + '</strong><strong>' + location.open_hours[0].hours +'</strong><i class="material-icons toggle-open-hours"><img src="//cdn.mapkit.io/v1/icons/keyboard_arrow_down.svg"/></i><ul>' + items + '</ul></label></li>';
                                   }
                                   return '<div class="iw-list"><i class="material-icons first-material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><ul>' + first + '</ul></div>';
                                } else {
                                   return '';
                               }
                               break;
                        }
                   } else {
                       return '';
                   }
               }

               boxText.innerHTML =
                   buildPieces(location, 'photo', 'photo', '') +
                   buildPieces(location, 'iw-toolbar', 'title', '') +
                   buildPieces(location, 'div', 'address', 'location_on') +
                   buildPieces(location, 'div', 'web', 'public') +
                   buildPieces(location, 'div', 'email', 'email') +
                   buildPieces(location, 'div', 'tel', 'phone') +
                   buildPieces(location, 'div', 'int_tel', 'phone') +
                   buildPieces(location, 'open_hours', 'open_hours', 'access_time') +
                   buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');

               var myOptions = {
                   alignBottom: true,
                   content: boxText,
                   disableAutoPan: true,
                   maxWidth: 0,
                   pixelOffset: new google.maps.Size(-140, -40),
                   zIndex: null,
                   boxStyle: {
                       opacity: 1,
                       width: '280px'
                   },
                   closeBoxMargin: '0px 0px 0px 0px',
                   infoBoxClearance: new google.maps.Size(1, 1),
                   isHidden: false,
                   pane: 'floatPane',
                   enableEventPropagation: false
               };

               location.ib = new InfoBox(myOptions);
               location.ib.open(map, marker);
               location.infoWindowVisible = true;
           }
       });
   }

   function init() {
       var mapOptions = {
           center: new google.maps.LatLng(-6.976880559294284,110.38940667726706),
           zoom: 17,
           gestureHandling: 'auto',
           fullscreenControl: false,
           zoomControl: true,
           disableDoubleClickZoom: true,
           mapTypeControl: false,
           scaleControl: false,
           scrollwheel: true,
           streetViewControl: false,
           draggable : true,
           clickableIcons: false,
           streetViewControlOptions: {
               position: google.maps.ControlPosition.BOTTOM_CENTER
           },
           mapTypeId: google.maps.MapTypeId.ROADMAP,
           styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#222222"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f1f1f1"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#8737a5"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#8737a5"}]}]
       }

       var mapElement = document.getElementById('maps');
       if(mapElement){
         var map = new google.maps.Map(mapElement, mapOptions);
         var locations = [
           {"title":"Ara Creative","address":"Jl. Anjasmoro Tengah III, Karangayu, Semarang Bar., Kota Semarang, Jawa Tengah 50149, Indonesia","desc":"","tel":"","int_tel":"","email":"","web":"","web_formatted":"","open":"","time":"","lat":-6.976983784602017,"lng":110.38918915819704,"open_hours":"","iw":{"address":true,"desc":true,"email":true,"enable":true,"int_tel":true,"open":true,"open_hours":true,"photo":true,"tel":true,"title":true,"web":true}}
         ];
         for (i = 0; i < locations.length; i++) {
           marker = new google.maps.Marker({
             icon: locations[i].marker,
             position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
             map: map,
             title: locations[i].title,
             address: locations[i].address,
             desc: locations[i].desc,
             tel: locations[i].tel,
             int_tel: locations[i].int_tel,
             vicinity: locations[i].vicinity,
             open: locations[i].open,
             open_hours: locations[i].open_hours,
             photo: locations[i].photo,
             time: locations[i].time,
             email: locations[i].email,
             web: locations[i].web,
             iw: locations[i].iw
           });
           markersArray.push(marker);

           if (locations[i].iw.enable === true){
             bindInfoWindow(marker, map, locations[i]);
           }
         }

       }

   }
