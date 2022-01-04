import { Component, HostListener, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { css } from 'jquery';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { Subscription } from 'rxjs';
export let browserRefresh = false;

import { Location } from '../locations/location.model';

import { LocationService } from '../locations/locations-service.service';



@Component({
  selector: 'app-reservation-details-page',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css', '../main-page/main-page.component.css' ],
  providers: [LocationService]
})
export class ReservationDetailsComponent implements OnInit {

  selectedDate : string = '';

  public setMiniHeader: boolean = false;

  numberOfAdults: number = 0;
  numberOfChildren: number = 0;
  mouse_is_inside=false;

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
  subscription: Subscription;
  previousUrl = history.state.prevPage ?? null

  placeId : string | null;

  city : string | null;
  checkInDate : string | null;
  checkOutDate: string | null;
  adultGuests: string | null;
  childrenGuests: string | null;

  constructor(calendar: NgbCalendar, private config: NgbDatepickerConfig, _router: Router,
     private _Activatedroute:ActivatedRoute, public locationsService: LocationService) {

      this.city =this._Activatedroute.snapshot.paramMap.get("location");
      this.checkInDate =this._Activatedroute.snapshot.paramMap.get("fromDate");
      this.checkOutDate =this._Activatedroute.snapshot.paramMap.get("toDate");
      this.adultGuests =this._Activatedroute.snapshot.paramMap.get("adultGuests");
      this.childrenGuests =this._Activatedroute.snapshot.paramMap.get("childrenGuests");

    this.placeId = this._Activatedroute.snapshot.paramMap.get("id");
    console.log("La id del lugar es" + this.placeId);

    this.router = _router;
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !this.router.navigated;
      }
    });
    this.fromDate = calendar.getToday();
    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);

    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
  };

  }


  loadSelectedLocation(locationId: number) {
    this.locationsService.getSelectedLocation(locationId).subscribe((res) => {
      this.locationsService.selectedLocation = res as Location;

    })
    console.log('loads');
  }

  changeLensImagePath() {
    this.lensImagePath = 'assets/img/icons/lensWhite.png';
  }

  miniHeader() {

    if(this.setMiniHeader == false) {
    $('.headerNav').css('height', '8vh');
      $('.headerNav').css('background-color', 'white');
      $('.headerLogo').addClass('my-auto');
      $('#loginButtonContainer').addClass('my-auto');
      $('.headerNav').css('box-shadow', '0px 2px 2px #b5b5b5');
      $('.headerNav').css('position', 'fixed');
      $('.headerMainUl').css('width', '50%');
      $('.locationSelector').addClass('makeHidden');
      $('.checkInOutSelector').addClass('makeHidden');
      $('.guestsSelector div h5').addClass('makeHidden');
      $('.guestsSelector div p').addClass('makeHidden');
      $('.lineSeparatorCheckIn').addClass('makeHidden');
      $('.lineSeparatorLocation').addClass('makeHidden');
      $('.locationSelector').removeClass('makeVisible');
      $('.checkInOutSelector').removeClass('makeVisible');
      $('.guestsSelector div h5').removeClass('makeVisible');
      $('.guestsSelector div p').removeClass('makeVisible');
      $('.lineSeparatorCheckIn').removeClass('makeVisible');
      $('.lineSeparatorLocation').removeClass('makeVisible');
      $('.guestsSelector').addClass('d-flex justify-content-between');
      $('.lenses').addClass('my-auto');
      $('.miniSearchLocation').removeClass('makeHidden');
      $('.miniSearchLocation').addClass('makeVisible');
      $('.lenses').css('position', 'inherit');
      $('.headerSearchBox').animate({
        'width': '40vh',
        'height': '5vh',
        'top': '1.5vh'

      },500);

      $('.lenses').animate({
        'width': '4.5vh',
        'height': '4.5vh',
        'position': 'inherit',
        'margin-right': '0.5vh'

      }, 500);

      $('.guestsSelector').animate({
        'width': '100%'

      }, 500);
      $('ngb-datepicker').removeClass('makeVisible');
        $('ngb-datepicker').addClass('makeHidden');
        $('.dropdownGuests').removeClass('makeVisible');
        $('.dropdownGuests').addClass('makeHidden');
        $('.loginSignupPopupWrapper').removeClass('makeVisible');
        $('.loginSignupPopupWrapper').addClass('makeHidden');
        this.changeLensImagePath();
    }
      this.setMiniHeader = true;
  }


    ngOnInit(): void {

      var parsedId = Number(this.placeId);

      this.loadSelectedLocation(parsedId);


      $('.headerLogo div').css('height', '8vh');

    this.miniHeader();

    if (!this.previousUrl) {
      console.log('page was refreshed!');
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
    } else {
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
    }

    var mouse_is_inside = false;

    this.lensImagePath = 'assets/img/icons/lensWhite.png';

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
    var locationValue;
    $( "#locationInput" )
      .keyup(function() {
       locationValue = $( this ).val();
      })
      .keyup();

    this.router.navigate(['/search', locationValue, formatedCheckInDate, formatedCheckOutDate, this.numberOfAdults, this.numberOfChildren]);
  }

  searchType(type: any) {
    this.router.navigate(['/searchByType', type]);
  }

  searchCountry(country: any) {
    this.router.navigate(['/searchByCountry', country]);
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

  resetHeaderSerarchBox() {
    if(this.setMiniHeader == true) {
    $('.headerLogo').removeClass('my-auto');
    $('#loginButtonContainer').removeClass('my-auto');
    $('.headerNav').css('box-shadow', '0px 2px 2px #b5b5b5');
    $('.headerNav').css('height', '20vh');
    $('.headerNav li').css('height', '20vh');
    $('.headerMainUl').css('width', '70%');
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
      $('.headerSearchBox').animate({
        'width': '105vh',
        'height': '9vh',
        'top': '5vh'

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
      $('.headerSearchBox').animate({
        'width': '86vh',
        'height': '7vh',
        'top': '5vh'

      }, 500);
      $('.lenses').animate({
        'width': '5.5vh',
        'height': '5.5vh',
        'position': 'relative',
        'margin-right': '0vh',
        'left': '4vh'
      }, 500);

      $('.guestsSelector').animate({
        'width': '31vh'

      }, 500);
    }
    $('ngb-datepicker').css('top', '11vh');
    $('.dropdownGuests').css('top', '11vh');

    }
    this.setMiniHeader = false;
  }

}
