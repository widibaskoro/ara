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
  if(document.getElementById(el) != null){
    item = document.getElementById(el).childNodes[0];
    scroll = window.scrollY;
    height = document.body.clientHeight;
    setTimeout(function(){
      item.setAttribute("style", "transform: translate"+d+"(-"+scroll*.2+"px)");
    }, 10);
  }

}
var callModal = function(e){
  var getModal = e.getAttribute('modal-call');
  var modal = document.querySelector(".modal-ara#"+getModal+"");
  var container = document.querySelectorAll('.container');
  modal.classList.add('active');
  container.forEach(function(i){
    i.classList.add('blur');
  });
}
if(inputSearch){
  inputSearch.addEventListener('keyup', function(){
    searchProduct();
  });
}
window.addEventListener('scroll', function(e){
  parallax("parallax", "X");
});


var closeModal = document.querySelector('.modal-ara .close-btn > a');
if(closeModal){
  closeModal.addEventListener('click', function(e){
    this.closest('.modal-ara').classList.remove('active');
    var container = document.querySelectorAll('.container');
    container.forEach(function(i){
      i.classList.remove('blur');
    });
  })  
}

var modalHandler = document.querySelectorAll('a[modal-call]');
modalHandler.forEach(function(item){
  item.addEventListener('click', function(){
    callModal(this);
  });
});
