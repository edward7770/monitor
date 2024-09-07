
"use strict";
(() => {
  window.addEventListener('scroll', stickyFn);
  var navbar = document.getElementById("sidebar");
  function stickyFn() {
    if(navbar) {
      if (window.scrollY >= 75) {
        document.getElementById("sidebar").classList.add("sticky-pin")
      } else {
        document.getElementById("sidebar").classList.remove("sticky-pin");
      }
    }
  }
  window.addEventListener('scroll', stickyFn);
  window.addEventListener('DOMContentLoaded', stickyFn);
})();

