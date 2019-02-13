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
