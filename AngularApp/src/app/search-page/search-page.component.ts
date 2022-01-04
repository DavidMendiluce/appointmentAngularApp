import { Component, HostListener, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { css } from 'jquery';
import {Router} from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgmOverlays } from "agm-overlays";
import { ActivatedRoute } from '@angular/router';

import { Location } from '../locations/location.model';
import { Appointment } from '../appointments/appointment.model';

import { LocationService } from '../locations/locations-service.service';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../appointments/appointment-service.service';




@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css', '../main-page/main-page.component.css'],
  providers: [LocationService, AppointmentService]
})
export class SearchPageComponent implements OnInit {


  public lat: number = 0;
  public lng: number = 0;


  public  mapTypeStyle: google.maps.MapTypeStyle = {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
};



   latLngArray: Array<{id: number, price: number, title: string, latitude: number, longitude: number}> = [];

  repeatedLocationsId: Number[] = [];

   locationsArrayFinal: Location[] = [];

   locationsArrayFinalFiltered: Location[] = [];

   pipe = new DatePipe('en-US');

   errorMessage = "Please enter the location, check and check out dates, and guests";

  selectedDate : string = '';

  public setMiniHeader: boolean = false;

  numberOfAdults: number = 0;
  numberOfChildren: number = 0;

  minusChildrenPath: string = '';
  plusChildrenPath: string = '';
  minusAdultPath: string = '';
  plusAdultPath: string = '';
  lensImagePath: string = '';

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  minDate : any;
  router: Router;
  google: any;

  location: string | null = '';

  city : string | null;
  checkInDate : string | null;
  checkOutDate: string | null;
  adultGuests: string | null;
  childrenGuests: string | null;
  type: string | null;
  //map: google.maps.Map;

  constructor(calendar: NgbCalendar, private config: NgbDatepickerConfig, _router: Router,
    private _Activatedroute:ActivatedRoute, public locationsService: LocationService,
    public appointmentService: AppointmentService) {
    this.city =this._Activatedroute.snapshot.paramMap.get("location");
    this.type =this._Activatedroute.snapshot.paramMap.get("type");
    this.checkInDate =this._Activatedroute.snapshot.paramMap.get("fromDate");
    this.checkOutDate =this._Activatedroute.snapshot.paramMap.get("toDate");
    this.adultGuests =this._Activatedroute.snapshot.paramMap.get("adultGuests");
    this.childrenGuests =this._Activatedroute.snapshot.paramMap.get("childrenGuests");



    this.router = _router;
    this.fromDate = calendar.getToday();
    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    //this.map = map;
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
  };

  }

      /*initMap(): void {
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }*/

  changeLensImagePath() {
    this.lensImagePath = 'assets/img/icons/lensWhite.png';
  }



  loadLocationsList(city: string | null) {

    this.locationsService.getLocationListFromCity(city).subscribe((res) => {
      this.locationsService.locations = res as Location[];

    })
  }

  loadLocationsListFromCity(city : string | null) {
    this.locationsService.getLocationListFromCity(city).subscribe((res) => {
      this.locationsService.locations = res as Location[];
      console.log(this.locationsService.locations);
      for(var i =0; i<this.locationsService.locations.length; i++) {
        var mapsObject = {'id': this.locationsService.locations[i].locationId, 'price': this.locationsService.locations[i].price, 'title': '$ ' + this.locationsService.locations[i].price.toString(), 'latitude': this.locationsService.locations[i].lat, 'longitude':  this.locationsService.locations[i].lng}
        this.latLngArray.push(mapsObject)
        console.log(mapsObject);
      }

    })
  }

  loadLocationsListFromType(type : string) {
    this.locationsService.getLocationListFromType(type).subscribe((res) => {
      this.locationsService.locations = res as Location[];
      console.log(this.locationsService.locations);
      for(var i =0; i<this.locationsService.locations.length; i++) {
        var mapsObject = {'id': this.locationsService.locations[i].locationId, 'price': this.locationsService.locations[i].price, 'title': '$ ' + this.locationsService.locations[i].price.toString(), 'latitude': this.locationsService.locations[i].lat, 'longitude':  this.locationsService.locations[i].lng}
        this.latLngArray.push(mapsObject)
        console.log(mapsObject);
      }
    })
  }


  loadAppointments() {
    this.appointmentService.getAppointmentList().subscribe((res) => {
      this.appointmentService.appointments = res as Appointment[];


    })
  }

  filterLocations(fromDateQuery : Date, toDateQuery: Date) {
    for(var i = 0; i<this.appointmentService.appointments.length; i++) {
      for(var j =0; j<this.locationsService.locations.length; j++) {

        var appointmentStringFromDate = this.appointmentService.appointments[i].fromDate.toString();
        var parseAppointmentStringFromDate = Date.parse(appointmentStringFromDate);
        var appointmentFromDate = new Date(parseAppointmentStringFromDate);

        var appointmentStringToDate = this.appointmentService.appointments[i].toDate.toString();
        var parseAppointmentStringToDate = Date.parse(appointmentStringToDate);
        var appointmentToDate = new Date(parseAppointmentStringToDate);
        console.log(this.appointmentService.appointments[i].locationId + " " + this.locationsService.locations[j].locationId);
        if(this.appointmentService.appointments[i].locationId == this.locationsService.locations[j].locationId) {
          this.repeatedLocationsId.push(this.appointmentService.appointments[i].locationId);
          console.log(this.repeatedLocationsId);

          for(var t = 0; t< this.locationsService.locations.length; t++) {
            for(var g = 0; g<this.repeatedLocationsId.length; g++) {
              if(this.locationsService.locations[t].locationId !== this.repeatedLocationsId[g]) {
                this.locationsArrayFinal.push(this.locationsService.locations[t]);
                console.log(this.locationsArrayFinal);
            } else {
              if(appointmentFromDate.getTime() > fromDateQuery.getTime() && appointmentFromDate.getTime() > toDateQuery.getTime()
              ||
               appointmentToDate.getTime() < fromDateQuery.getTime() && appointmentToDate.getTime() < toDateQuery.getTime()) {
                this.locationsArrayFinal.push(this.locationsService.locations[j]);
              }
            }

            }
          }

        } else {

              setTimeout(() => {
                for(var t = 0; t< this.locationsService.locations.length; t++) {
                  if(this.repeatedLocationsId.length <= 0) {
                    this.locationsArrayFinal.push(this.locationsService.locations[t]);
                  } else {
                    for(var g = 0; g<this.repeatedLocationsId.length; g++) {
                      if(this.locationsService.locations[t].locationId !== this.repeatedLocationsId[g]) {
                        this.locationsArrayFinal.push(this.locationsService.locations[t]);
                    }

                    }
                  }


              }
              }, 300)

      }
        setTimeout(() => {
          this.locationsArrayFinalFiltered = this.locationsArrayFinal.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.locationId === value.locationId
            ))
          )
          for(var z =0; z<this.locationsArrayFinalFiltered.length; z++) {
            var mapsObject = {'id': this.locationsArrayFinalFiltered[z].locationId, 'price': this.locationsArrayFinalFiltered[z].price, 'title': '$ ' + this.locationsArrayFinalFiltered[z].price.toString(), 'latitude': this.locationsArrayFinalFiltered[z].lat, 'longitude':  this.locationsArrayFinalFiltered[z].lng}
            this.latLngArray.push(mapsObject)
            console.log(mapsObject);
          }

        }, 500)

      }
    }
  }


  ngOnInit(): void {

    //Init dates
    var noNullFromDate = this.checkInDate.toString();
    var parsedFromDate = Date.parse(noNullFromDate);
    var fromDateFromURL = new Date(parsedFromDate);
    this.fromDate = new NgbDate(fromDateFromURL.getFullYear(),fromDateFromURL.getMonth() + 1,fromDateFromURL.getDate());
    var noNullToDate = this.checkOutDate.toString();
    var parsedToDate = Date.parse(noNullToDate);
    var toDateFromURL = new Date(parsedToDate);
    this.toDate = new NgbDate(toDateFromURL.getFullYear(),toDateFromURL.getMonth() + 1,toDateFromURL.getDate());

    //Init guests
    var noNullAdults = this.adultGuests.toString();
    this.numberOfAdults = parseInt(noNullAdults);
    var noNullChildrens = this.childrenGuests.toString();
    this.numberOfChildren = parseInt(noNullChildrens);

    //initLocation
    var locationString = this.city.toString();

    $( "#locationInput" ).val(locationString);

    if(this.city=="Paris" || this.type=="Apartment") {
      this.lat = 48.863515759432005;
      this.lng = 2.331961041147606;
      this.location = "Paris";
    } else if(this.city=="Moscow" || this.type=="Cabin") {
      this.lat = 55.89739717997191;
      this.lng = 37.801095959242765;
      this.location = "Moscow";
    } else if(this.city=="NewYork" || this.type=="Hotel") {
      this.lat = 40.766376214977974;
      this.lng = -73.97740782694977;
      this.location = "New York";
    } else if(this.city=="Sydney" || this.type=="Villa" || this.type=="Resort") {
      this.lat = -33.81432362868853;
      this.lng = 151.28823867398103;
      this.location = "Sydney";
    }



    this.loadLocationsList(this.location);
    this.loadAppointments();
    setTimeout(() => {
      this.filterLocations(fromDateFromURL, toDateFromURL);
    }, 400)


    if(this.type=="Villa") {
      this.loadLocationsListFromType('villa');
    } else if(this.type=="Resort") {
      this.loadLocationsListFromType('resort');
    } else {
      //this.loadLocationsListFromCity(this.location);
    }



    console.log(
      'Location: ' + this.city +
      ' From this date: ' + this.checkInDate + ' To this date: ' + this.checkOutDate +
      ' Adults: ' + this.adultGuests + ' Children: ' + this.childrenGuests
      );

      console.log(
        'Type: ' + this.type
        );


    $('.locationSelector').removeClass('makeHidden');
    $('.checkInOutSelector').removeClass('makeHidden');
    $('.guestsSelector div h5').removeClass('makeHidden');
    $('.guestsSelector div p').removeClass('makeHidden');
    $('.lineSeparatorCheckIn').removeClass('makeHidden');
    $('.lineSeparatorLocation').removeClass('makeHidden');
    $('.guestsSelector').addClass('makeVisibleFlex')
    $('.locationSelector').addClass('makeVisibleFlex');
    $('.checkInOutSelector').addClass('makeVisibleFlex');
    $('.guestsSelector div h5').addClass('makeVisible');
    $('.guestsSelector div p').addClass('makeVisible');
    $('.lineSeparatorCheckIn').addClass('makeVisible');
    $('.lineSeparatorLocation').addClass('makeVisible');
    $('.guestsSelector').removeClass('d-flex justify-content-between');
    $('.lenses').removeClass('my-auto');
    $('.miniSearchLocation').removeClass('makeVisible');
    $('.miniSearchLocation').addClass('makeHidden');
    $('.lenses').css('position', 'relative');
    var barWidth = $(window).width();
    if(barWidth <= 1440) {
      $('.headerNav').css('height', '14vh');
      $('.headerSearchBox').animate({
        'width': '105vh',
        'height': '9vh',
        'top': '0vh'

      }, 500);
      $('.lenses').animate({
        'width': '7vh',
        'height': '7vh',
        'position': 'relative',
        'margin-right': '0vh'

      }, 500);

      $('.guestsSelector').animate({
        'width': '35vh'

      }, 500);
    } else {
      $('.headerNav').css('height', '10vh');
      $('.headerSearchBox').animate({
        'width': '86vh',
        'height': '7vh',
        'top': '0vh'

      }, 500);
      $('.lenses').animate({
        'width': '5.5vh',
        'height': '5.5vh',
        'position': 'relative',
        'margin-right': '0vh'

      }, 500);

      $('.guestsSelector').animate({
        'width': '31vh'

      }, 500);
    }



    var mouse_is_inside = false;

    this.lensImagePath = 'assets/img/icons/lensWhite.png';

    $('#loginSignupPopupWrapper').addClass('makeHidden');

      $('#headerSearchContainer').hover(function(){
        mouse_is_inside=true;
    }, function(){
        mouse_is_inside=false;
    });

    const component = this;

    /*$("body").mouseup(function(){
        if(! mouse_is_inside) {
        $('ngb-datepicker').removeClass('makeVisible');
        $('ngb-datepicker').addClass('makeHidden');
        $('.dropdownGuests').removeClass('makeVisible');
        $('.dropdownGuests').addClass('makeHidden');
        $('.loginSignupPopupWrapper').removeClass('makeVisible');
        $('.loginSignupPopupWrapper').addClass('makeHidden');
        component.changeLensImagePath();
        $('')
        }

    });*/

    if(this.numberOfAdults > 12) {
      this.plusAdultPath = 'assets/img/icons/plusInactive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    }

    if(this.numberOfChildren > 12) {
      this.plusChildrenPath = 'assets/img/icons/plusInactive.png';
      this.minusChildrenPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusActive.png';
    }

    $('.ngb-dp-content').addClass('d-flex justify-content-center');
    setTimeout(function(){$('.ngb-dp-month').css('margin', '2vh 2vh');$('ngb-dp-navigation-select')
    .css('margin', '1vh 1vh'); $('.ngb-dp-day.disabled').css('color', '#eeeded');

    $('.custom-select')
    .css({'margin-top': '2vh', 'margin-left': '1vh' ,'width': '5vh',
     'border': 'none', 'outline': 'none', 'border-bottom': '1px solid #dbdbdb'});

     $('.ngb-dp-arrow.right button').click(function() {

        if(!$('.ngb-dp-day').hasClass('disabled')) {
          $('.ngb-dp-day').css('color', 'black');
        } else {
          $('.ngb-dp-day.disabled').css('color', '#eeeded');
        }
    })

    $('.ngb-dp-arrow button').click(function() {

        if(!$('.ngb-dp-day').hasClass('disabled')) {
          $('.ngb-dp-day').css('color', 'black');
        } else {
          $('.ngb-dp-day.disabled').css('color', '#eeeded');
        }
    })


    }, 100);





    $('.locationSelector').hover(
      function() {
        $( ".locationSelector" ).addClass('greyBackground');
        $( '.locationSelector input' ).addClass( "greyBackground" );
        $('.lineSeparatorLocation').removeClass('separator');
      }, function() {
        $( ".locationSelector" ).removeClass('greyBackground');
        $( '.locationSelector input').removeClass( "greyBackground" );
        $('.lineSeparatorLocation').addClass('separator');
      }
    )
    $('.checkInOutSelector').hover(
      function() {
        $( ".checkInOutSelector" ).addClass('greyBackground');
        $('.lineSeparatorCheckIn').removeClass('separator');
        $('.lineSeparatorLocation').removeClass('separator');
      }, function() {
        $('.lineSeparatorCheckIn').addClass('separator');
        $('.lineSeparatorLocation').addClass('separator');
        $( ".checkInOutSelector" ).removeClass('greyBackground');
      }
    )
    $('.guestsSelector').hover(
      function() {
        $( ".guestsSelector" ).addClass('greyBackground');
        $('.lineSeparatorCheckIn').removeClass('separator');
      }, function() {
        $('.lineSeparatorCheckIn').addClass('separator');
        $( ".guestsSelector" ).removeClass('greyBackground');
      }
    )

    $('.locationSelector').click(function() {
      $('.locationSelector input').focus();
    })

    $( ".locationSelector input" ).focusin(function() {
      $('.locationSelector input').removeClass('lightGreyBackground');
      $('.locationSelector').removeClass('greyBackground');
      $('.locationSelector input').removeClass('greyBackground');
      $( ".locationSelector input" ).addClass('whiteBackground');
      $('.locationSelector').addClass('whiteBackground');
      $('.guestsSelector').addClass('roundedRight');
      $('.locationSelector').addClass('roundedRight');
      $('.headerSearchBox').removeClass('whiteBackground');
      $('.headerSearchBox').addClass('lightGreyBackground');
      $('.checkInOutSelector').removeClass('whiteBackground');
      $('.guestsSelector').removeClass('whiteBackground');
    });

    $( ".locationSelector input" ).focusout(function() {
      $('.locationSelector').removeClass('whiteBackground');
      $('.locationSelector input').removeClass('whiteBackground');
      $('.guestsSelector').removeClass('roundedRight');
      $('.locationSelector').removeClass('roundedRight');
      $('.headerSearchBox').removeClass('lightGreyBackground');
      $('.headerSearchBox').addClass('whiteBackground');
      $('.locationSelector').removeClass('roundedAll');
      $('.checkInOutSelector').removeClass('whiteBackground');
    });

    $('.headerSearchBox').click(function(event) {
      event.stopPropagation();
    });

    $(document).click(function() {
      $('.locationSelector').removeClass('whiteBackground');
      $('.locationSelector input').removeClass('whiteBackground');
      $('.locationSelector input').removeClass('lightGreyBackground');
      $('.guestsSelector').removeClass('roundedRight');
      $('.locationSelector').removeClass('roundedRight');
      $('.headerSearchBox').removeClass('lightGreyBackground');
      $('.headerSearchBox').addClass('whiteBackground');
      $('.locationSelector').removeClass('roundedAll');
      $('.checkInOutSelector').removeClass('whiteBackground');
      $('.guestsSelector').removeClass('whiteBackground');
    })

    $( ".checkInOutSelector" ).click(function() {
      $('.checkInOutSelector').removeClass('greyBackground');
      $('.checkInOutSelector').addClass('whiteBackground');
      $('.guestsSelector').addClass('roundedRight');
      $('.checkInOutSelector').addClass('roundedAll');
      $('.headerSearchBox').removeClass('whiteBackground');
      $('.headerSearchBox').addClass('lightGreyBackground');
      $('.locationSelector input').removeClass('whiteBackground');
      $('.locationSelector input').addClass('lightGreyBackground');
      $('.guestsSelector').removeClass('whiteBackground');
    });

    $( ".guestsSelector" ).click(function() {
      $('.checkInOutSelector').removeClass('whiteBackground');
      $('.guestsSelector').removeClass('greyBackground');
      $('.guestsSelector').addClass('whiteBackground');
      $('.guestsSelector').addClass('roundedAll');
      $('.headerSearchBox').removeClass('whiteBackground');
      $('.headerSearchBox').addClass('lightGreyBackground');
      $('.locationSelector input').removeClass('whiteBackground');
      $('.locationSelector input').addClass('lightGreyBackground');
    });

    $( ".locationSelector").mouseleave(function(){
      $('.locationSelector').addClass('roundedAll');
    })
    $( ".checkInOutSelector").mouseleave(function(){
      $('.checkInOutSelector').addClass('roundedAll');
    })
    $( ".guestsSelector").mouseleave(function(){
      $('.guestsSelector').addClass('roundedAll');
    })
  }



  searchMain() {
    var formatedCheckInDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day;
    var formatedCheckOutDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day;
    var locationValue: string | string[] | number | undefined = '';
    $( "#locationInput" )
      .keyup(function() {
       locationValue = $( this ).val();
      })
      .keyup();

    if(!locationValue.trim() || !formatedCheckInDate.trim() || !formatedCheckOutDate.trim() ||
        this.numberOfAdults == 0 && this.numberOfChildren == 0){
          $('.errorBannerWrapper').removeClass('makeHidden');
          $('.errorBannerWrapper').addClass('makeVisible');
    } else {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['../search', locationValue, formatedCheckInDate, formatedCheckOutDate, this.numberOfAdults, this.numberOfChildren]);
          $('.errorBannerWrapper').removeClass('makeVisible');
          $('.errorBannerWrapper').addClass('makeHidden');
    }
    console.log('search button works');

  }

  popDatePicker() {
    $('.dropdownGuests').removeClass('makeVisible');
      $('.dropdownGuests').addClass('makeHidden');
    if(!$('ngb-datepicker').hasClass('makeHidden')) {
      $('ngb-datepicker').removeClass('makeVisible');
      $('ngb-datepicker').addClass('makeHidden');

    } else {
      $('ngb-datepicker').removeClass('makeHidden');
      $('ngb-datepicker').addClass('makeVisible');

    }
    this.lensImagePath = 'assets/img/icons/lensBrighter.png'
  }

  removeSearchPops() {
    $('ngb-datepicker').removeClass('makeVisible');
    $('ngb-datepicker').addClass('makeHidden');
    $('.dropdownGuests').removeClass('makeVisible');
    $('.dropdownGuests').addClass('makeHidden');
    this.lensImagePath = 'assets/img/icons/lensBrighter.png'
  }

  addGuests() {
    if(this.setMiniHeader == true) {

    } else {
      $('ngb-datepicker').removeClass('makeVisible');
      $('ngb-datepicker').addClass('makeHidden');
      if(!$('.dropdownGuests').hasClass('makeHidden')) {
        $('.dropdownGuests').removeClass('makeVisible');
        $('.dropdownGuests').addClass('makeHidden');

      } else {
        $('.dropdownGuests').removeClass('makeHidden');
        $('.dropdownGuests').addClass('makeVisible');

      }
      this.lensImagePath = 'assets/img/icons/lensBrighter.png';
    }

  }

  addAdult() {
    if(this.numberOfAdults < 12) {
      this.numberOfAdults++;
    }
    if(this.numberOfAdults == 12) {
      this.plusAdultPath = 'assets/img/icons/plusInactive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    }

    if(this.numberOfChildren == 12) {
      this.plusChildrenPath = 'assets/img/icons/plusInactive.png';
      this.minusChildrenPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfChildren < 1) {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusActive.png';
    }
    $('#addAdultsText').text(this.numberOfAdults + " Adults");
  }

  addChildren() {
    if(this.numberOfChildren <12) {
      this.numberOfChildren++;
    }
    if(this.numberOfAdults == 12) {
      this.plusAdultPath = 'assets/img/icons/plusInactive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    }

    if(this.numberOfChildren == 12) {
      this.plusChildrenPath = 'assets/img/icons/plusInactive.png';
      this.minusChildrenPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfChildren < 1) {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusActive.png';
    }
    $('#addChildrenText').text(this.numberOfChildren + " Children");
    $('#addChildrenText').removeClass('hideVisibility');
    $('#addChildrenText').addClass('showVisibility');
    $('#addGuestsSeparator').removeClass('hideVisibility');
    $('#addGuestsSeparator').addClass('showVisibility');
  }

  restAdult() {
    if(this.numberOfAdults > 0) {
      this.numberOfAdults--;
    }
    if(this.numberOfAdults == 12) {
      this.plusAdultPath = 'assets/img/icons/plusInactive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    }

    if(this.numberOfChildren == 12) {
      this.plusChildrenPath = 'assets/img/icons/plusInactive.png';
      this.minusChildrenPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfChildren < 1) {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusActive.png';
    }
    $('#addAdultsText').text(this.numberOfAdults + " Adults");
  }

  restChildren() {
    if(this.numberOfChildren > 0) {
      this.numberOfChildren--;
    }
    if(this.numberOfAdults == 12) {
      this.plusAdultPath = 'assets/img/icons/plusInactive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfAdults < 1) {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusAdultPath = 'assets/img/icons/plusActive.png';
      this.minusAdultPath = 'assets/img/icons/minusActive.png';
    }

    if(this.numberOfChildren == 12) {
      this.plusChildrenPath = 'assets/img/icons/plusInactive.png';
      this.minusChildrenPath = 'assets/img/icons/minusActive.png';
    } else if(this.numberOfChildren < 1) {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusInactive.png';
    } else {
      this.plusChildrenPath = 'assets/img/icons/plusActive.png';
      this.minusChildrenPath  = 'assets/img/icons/minusActive.png';
    }
    $('#addChildrenText').text(this.numberOfChildren + " Children");
    $('#addChildrenText').removeClass('hideVisibility');
    $('#addChildrenText').addClass('showVisibility');
    $('#addGuestsSeparator').removeClass('hideVisibility');
    $('#addGuestsSeparator').addClass('showVisibility');
  }

  showLoginSignUp() {
    if($('#loginSignupPopupWrapper').hasClass('makeHidden')) {
      $('#loginSignupPopupWrapper').removeClass('makeHidden');
      $('#loginSignupPopupWrapper').addClass('makeVisible');

    } else {
      $('#loginSignupPopupWrapper').removeClass('makeVisible');
      $('#loginSignupPopupWrapper').addClass('makeHidden');

    }
  }






  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    var formatedCheckInDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day;
    var formatedCheckOutDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day;
    $('#addDateText').text(this.pipe.transform(formatedCheckInDate, 'mediumDate') + " - " + this.pipe.transform(formatedCheckOutDate, 'mediumDate'))
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

}
