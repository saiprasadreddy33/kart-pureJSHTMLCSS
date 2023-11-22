"use strict";

var listProductHTML = document.querySelector('.listProduct');
var listCartHTML = document.querySelector('.listCart');
var iconCart = document.querySelector('.icon-cart');
var iconCartSpan = document.querySelector('.icon-cart span');
var body = document.querySelector('body');
var closeCart = document.querySelector('.close');
var products = [];
var cart = [];
iconCart.addEventListener('click', function () {
  body.classList.toggle('showCart');
});
closeCart.addEventListener('click', function () {
  body.classList.toggle('showCart');
});

var addDataToHTML = function addDataToHTML() {
  if (products.length > 0) {
    products.forEach(function (product) {
      var newProduct = document.createElement('div');
      newProduct.dataset.id = product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = "<img src=\"".concat(product.image, "\" alt=\"\">\n                <h2>").concat(product.name, "</h2>\n                <div class=\"price\">$").concat(product.price, "</div>\n                <button class=\"addCart\">Add To Cart</button>");
      listProductHTML.appendChild(newProduct);
    });
  }
};

listProductHTML.addEventListener('click', function (event) {
  var positionClick = event.target;

  if (positionClick.classList.contains('addCart')) {
    var id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});

var addToCart = function addToCart(product_id) {
  var positionThisProductInCart = cart.findIndex(function (value) {
    return value.product_id == product_id;
  });

  if (cart.length <= 0) {
    cart = [{
      product_id: product_id,
      quantity: 1
    }];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1
    });
  } else {
    cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
  }

  addCartToHTML();
  addCartToMemory();
};

var addCartToMemory = function addCartToMemory() {
  localStorage.setItem('cart', JSON.stringify(cart));
};

var addCartToHTML = function addCartToHTML() {
  listCartHTML.innerHTML = '';
  var totalQuantity = 0;

  if (cart.length > 0) {
    cart.forEach(function (item) {
      totalQuantity = totalQuantity + item.quantity;
      var newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.dataset.id = item.product_id;
      var positionProduct = products.findIndex(function (value) {
        return value.id == item.product_id;
      });
      var info = products[positionProduct];
      listCartHTML.appendChild(newItem);
      newItem.innerHTML = "\n            <div class=\"image\">\n                    <img src=\"".concat(info.image, "\">\n                </div>\n                <div class=\"name\">\n                ").concat(info.name, "\n                </div>\n                <div class=\"totalPrice\">$").concat(info.price * item.quantity, "</div>\n                <div class=\"quantity\">\n                    <span class=\"minus\"><</span>\n                    <span>").concat(item.quantity, "</span>\n                    <span class=\"plus\">></span>\n                </div>\n            ");
    });
  }

  iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', function (event) {
  var positionClick = event.target;

  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    var product_id = positionClick.parentElement.parentElement.dataset.id;
    var type = 'minus';

    if (positionClick.classList.contains('plus')) {
      type = 'plus';
    }

    changeQuantityCart(product_id, type);
  }
});

var changeQuantityCart = function changeQuantityCart(product_id, type) {
  var positionItemInCart = cart.findIndex(function (value) {
    return value.product_id == product_id;
  });

  if (positionItemInCart >= 0) {
    var info = cart[positionItemInCart];

    switch (type) {
      case 'plus':
        cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
        break;

      default:
        var changeQuantity = cart[positionItemInCart].quantity - 1;

        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }

        break;
    }
  }

  addCartToHTML();
  addCartToMemory();
};

var initApp = function initApp() {
  fetch('products.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    products = data;
    addDataToHTML();

    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  });
};

initApp();
//# sourceMappingURL=app.dev.js.map
