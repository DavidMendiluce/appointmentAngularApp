import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { css } from 'jquery';
import {Router} from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgmOverlays } from "agm-overlays";
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';


import { Appointment } from '../appointments/appointment.model';

import { AppointmentService } from '../appointments/appointment-service.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import {AfterViewInit} from '@angular/core';





@Component({
  selector: 'app-search-page',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css', '../main-page/main-page.component.css', '../search-page/search-page.component.css'],
  providers: [AppointmentService, DataTableDirective]
})
export class AdminPanelComponent implements OnInit {



  lat = 48.86644197712338;
  lng = 2.3383753433870487;

  latLngArray = [
    {'id': '1', 'title': '900$', 'latitude': 48.8645750968158, 'longitude':  2.332741962709099},
    {'id': '2', 'title': '600$', 'latitude': 48.869875155743244, 'longitude':  2.327377752770743}
    ];

  public  mapTypeStyle: google.maps.MapTypeStyle = {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
};

  showContent = false;


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

  location : string | null;
  checkInDate : string | null;
  checkOutDate: string | null;
  adultGuests: string | null;
  childrenGuests: string | null;
  type: string | null;
  //map: google.maps.Map;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  appointmentsArray: Appointment[] = [];


  constructor(calendar: NgbCalendar, private config: NgbDatepickerConfig, _router: Router
    , private _Activatedroute:ActivatedRoute
    , public appointmentsService: AppointmentService, public dtElement: DataTableDirective
    , private chRef: ChangeDetectorRef) {
    this.location =this._Activatedroute.snapshot.paramMap.get("location");
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
   }

  loadAppointments() {
    this.appointmentsService.getAppointmentList().subscribe((res) => {
      this.appointmentsService.appointments = res as Appointment[];
      this.appointmentsArray = this.appointmentsService.appointments;
      console.log(this.appointmentsService.appointments);
      this.dtTrigger.next();
      $('#myDatatable').css('font-weight', 'lighter');
      setTimeout(() => {
        $('.appointmentId').css('font-weight', 'bold');
      }, 300)

    })
  }

  goNext() {
    console.log('Rendering');

  }


  ngAfterViewInit(): void {
    /*this.dtTrigger.next();*/
}


  ngOnInit(): void {

      setTimeout(()=>{                           // <<<---using ()=> syntax
        this.goNext();
    }, 1000);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };

    this.loadAppointments();

    /*this.appointmentsArray = [
      {_id: '345345345',
      locationId: 2,
      reservationNumber: 3545345345,
      address: 'c/coboncin',
      taxi: 'no',
      carRental: 'yes',
      days: 8,
      propertyType: 'cabin',
      fromDate: '10/09/2021',
      toDate: '20/10/2021',
      price: 1900,
      clientName: 'Mariano',
      clientSurname: 'Cobo',
      clientEmail: 'cobo@gmail.com',
      clientPhone: 64364567,
      arrivalTime: '18:00'
    }
    ]*/

    //this.loadAppointments();

    setTimeout(function() {
      $('#myDatatable td').css('border-top', '1px solid #FFEE58');
      $('#myDatatable tr').css('border-bottom', 'none');
      $('#myDatatable th').css('border-bottom', 'none');
      $('#myDatatable').css('border-bottom', 'none');
      $('#myDatatable_wrapper').css('width', '92%');
    }, 300);




    console.log(
      'Location: ' + this.location +
      ' From this date: ' + this.checkInDate + ' To this date: ' + this.checkOutDate +
      ' Adults: ' + this.adultGuests + ' Children: ' + this.childrenGuests
      );

      console.log(
        'Type: ' + this.type
        );

    $('.headerNav').css('height', '10vh');
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
    /*var formatedCheckInDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day;
    var formatedCheckOutDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day;
    console.log('From: ' + formatedCheckInDate + ' to: ' + formatedCheckOutDate);*/
    this.router.navigateByUrl('/search');
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



  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

  cancelAppointment(appointmentId: string) {
    this.appointmentsService.deleteAppointment(appointmentId).subscribe((res) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
      });
      this.loadAppointments();
      this.dtTrigger.next();
    });
    window.location.reload();
  }



}
