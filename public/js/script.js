var inputSearch = document.querySelector('.search-box input#searchProduct');
var searchProduct = function(){
  var input,filter;
  input = document.querySelector('.search-box input#searchProduct');
  filter = input.value.toUpperCase();
  ul = document.querySelector('.product-service > ul');
  li = ul.getElementsByTagName('li');
  var a = [];
  for (i = 0; i < li.length; i++) {
    text = li[i].getElementsByTagName("h4")[0];
    if (text.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
    var liNone = li[i].style.display == "none";
    a.push(liNone);
  }
  a = a.sort();
  if(a[0] == true){
    document.querySelector('h4.not-found').style.display = "block";
  } else {
    document.querySelector('h4.not-found').style.display = "none";
  }
}
var parallax = function(el, d){
  var item,scroll,height;
  item = document.getElementById(el).childNodes[0];

  scroll = window.scrollY;
  height = document.body.clientHeight;
  setTimeout(function(){
    item.setAttribute("style", "transform: translate"+d+"(-"+scroll*.2+"px)");
  }, 10);
}
if(inputSearch){
  inputSearch.addEventListener('keyup', function(){
    searchProduct();
  });
}
window.addEventListener('scroll', function(e){
  parallax("parallax", "X");
})
