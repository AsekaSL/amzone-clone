export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [{
        productsId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
    },{
        productsId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
    }];
}


export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}


export function removeFromCart(productId) {
    let newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productsId !== productId ) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;
        cart.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });
    return cartQuantity;
}

export function updateDeliveryOption(productsId, deliveryOptionId) {
    let matchingItem;

        cart.forEach((cartItem) => {
            if (productsId === cartItem.productsId) {
                matchingItem = cartItem;
            }
        });
    
    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}