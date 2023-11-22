let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
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
    showAddToCartPopup();

    addCartToHTML();
    addCartToMemory();
};

const showAddToCartPopup = () => {
    const popupMessage = document.createElement('div');
    popupMessage.classList.add('popup-message');
    popupMessage.innerHTML = `
        <p>Item added to your cart!</p>
    `;

    body.appendChild(popupMessage);

    setTimeout(() => {
        body.removeChild(popupMessage);
    }, 2000);
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">$${info.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>
        `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;

            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
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

const clearCart = () => {
    // Implement your logic to clear the cart (e.g., set cart to an empty array)
    cart = [];
    addCartToHTML(); // Update the cart display
    addCartToMemory(); // Update the cart in local storage
};

const showConfirmationPopup = () => {
    // Create a custom confirmation pop-up
    const confirmationPopup = document.createElement('div');
    confirmationPopup.classList.add('confirmation-popup');
    confirmationPopup.innerHTML = `
        <p>Thank you for your order!</p>
        <button id="closePopupBtn">Close</button>
    `;

    // Append the pop-up to the body
    body.appendChild(confirmationPopup);

    // Add event listener to the close button
    const closePopupBtn = document.getElementById('closePopupBtn');
    closePopupBtn.addEventListener('click', () => {
        // Remove the pop-up from the DOM
        body.removeChild(confirmationPopup);
    });
};

const checkoutButton = document.getElementById('checkoutButton'); // Assuming you have a button with the id 'checkoutButton'

checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        // Display the custom confirmation pop-up
        showConfirmationPopup();

        // Clear the cart (optional: you can move this inside the pop-up event listener)
        clearCart();
        
        // Redirect to thank you page (optional: you can move this inside the pop-up event listener)
        console.log("routed to thank you.");
        window.location.href = './thankyou.html';
    } else {
        alert('Your cart is empty. Please add items to your cart before checking out.');
    }
});


const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();
