/*
  Quick way to identify which slide the seller is on when adding a listing.
*/
document.getElementById('addlisting').addEventListener("submit", function (event) {

  var slides = document.getElementById('products').children;
  var i = 0;
  while (!slides[i].classList.contains('flex-active-slide') || i > slides.length) {
    i++;
  }
  i += 1;

  document.getElementById('productimgnumber').setAttribute('value', '0' + i.toString());
});