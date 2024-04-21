import {calculateCartQuantity} from '../../data/cart.js';

export function renderCheckoutHeader() {
    if (calculateCartQuantity() === 0 ) {
        document.querySelector('.js-items').innerHTML = ``;
    } else {
        document.querySelector('.js-items').innerHTML = `${calculateCartQuantity()} items`; 
    }
}