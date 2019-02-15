import $ from 'jquery';
import slick from 'slick-carousel';



// function ready(fn) {
//   if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
//
// ready(function(){
//   console.log('DOM ready');
// });

// Гамбургер

let toggle = document.getElementById('toggle');
let menu = document.getElementById('menuList');

toggle.classList.remove('main-nav__toggle--close');
menu.classList.remove('main-nav__list--open');

toggle.addEventListener('click', menuVisible);
function menuVisible(e) {
  e.preventDefault();
  toggle.classList.toggle('main-nav__toggle--close');
  menu.classList.toggle('main-nav__list--open');
};

//Подключение слайдера на главной
$(function(){
  $('.slider__block').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: true,
    appendArrows: $('.slider__block'),
    prevArrow:'<button class="slick-prev" aria-label="Previous" type="button"></button>',
    nextArrow:'<button class="slick-next" aria-label="Next" type="button"></button>',
    adaptiveHeight: true
  });
});
