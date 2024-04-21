import {cart, removeFromCart, calculateCartQuantity, saveToStorage, updateDeliveryOption} from '../../data/cart.js';
import {getProduct} from '../../data/data.js';
import {formatCurrency} from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {rederPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutheader.js';


export function renderOrderSummary() {

let cartSummaryHTML = '';



cart.forEach((cartItem) => {
    const productId = cartItem.productsId;

    const matachingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    let today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

    let date = deliveryDate.format('dddd');

    if (date === 'Saturday') {
        let deliveryNumber = 2 + deliveryOption.deliveryDays;
        deliveryDate = today.add(deliveryNumber, 'days');
    } else if (date === 'Sunday') {
        let deliveryNumber = 1 + deliveryOption.deliveryDays;
        deliveryDate = today.add(deliveryNumber, 'days');
    }

    let dateString = deliveryDate.format('dddd, MMMM, D');

    cartSummaryHTML += 
    `<div class="product-checkout js-cart-item-container-${matachingProduct.id}">
    <div class="delivery-date">
        Delivery date: ${dateString}
    </div>
    <div class="product-information-grid">
        <img src="${matachingProduct.image}" class="product-pic">
        <div class="product-information">
            <div class="product-name">
                ${matachingProduct.name}
            </div>
            <div class="product-price">
                $${ formatCurrency(matachingProduct.priceCents) }
            </div>
            <div class="product-quantity">
                Quantity: <span class="js-update-${matachingProduct.id}"><span class="js-quantity-count">${cartItem.quantity}</span> <span class="update" data-product-id="${matachingProduct.id}">Update</span><input type="text" class="quantity-input js-quantity-input-${matachingProduct.id}"> <span class="save-quantity-input" data-save-id="${matachingProduct.id}">Save</span></span> <span class="delete js-delete-link" data-product-id="${matachingProduct.id}">Delete</span> 
            </div>                        
        </div>
        <div class="product-delivery-option">
            <p class="delivery-option-name">
                Choose a delivery option:
            </p>
            ${deliveryOptionHTML(matachingProduct, cartItem)}
        </div>
    </div>
</div>`;

});

function deliveryOptionHTML(matachingProduct, cartItem) {

    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

        let date = deliveryDate.format('dddd');

        if (date === 'Saturday') {
            let deliveryNumber = 2 + deliveryOption.deliveryDays;
            deliveryDate = today.add(deliveryNumber, 'days');
        } else if (date === 'Sunday') {
            let deliveryNumber = 1 + deliveryOption.deliveryDays;
            deliveryDate = today.add(deliveryNumber, 'days');
        }

        let dateString = deliveryDate.format('dddd, MMMM, D');

        let priceString = deliveryOption.priceCents === 0
         ? 'FREE'
         : `$${formatCurrency(deliveryOption.priceCents)}`

         const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matachingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''} class="radio-button" name="shipping-value-option-${matachingProduct.id}">
                <div class="shipping">
                    <p class="shipping-date">
                        ${dateString}
                    </p>
                    <p class="free-shipping">
                        ${priceString} Shipping
                    </p>
                </div>
            </div>
        `;
    });

    return html;
}

document.querySelector('.js-product-details-information').innerHTML = cartSummaryHTML;


document.querySelectorAll('.js-delete-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        let conatiner = document.querySelector(`.js-cart-item-container-${productId}`);
        conatiner.remove();
        renderCheckoutHeader();
        rederPaymentSummary();
    });
});



renderCheckoutHeader();
let updateId;

document.querySelectorAll('.update')
.forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
        updateId = updateLink.dataset.productId;
        console.log(updateId);

        document.querySelector(`.js-cart-item-container-${updateId}`).classList.add('is-editing-quantity');
    });
});
let saveProductId;
let updateQuantity;
document.querySelectorAll('.save-quantity-input')
.forEach((link) => {
    link.addEventListener('click', () => {
        saveProductId = link.dataset.saveId;
        
        document.querySelector(`.js-cart-item-container-${saveProductId}`).classList.remove('is-editing-quantity');

        updateQuantity = document.querySelector(`.js-quantity-input-${saveProductId}`).value;
        if (updateQuantity === '') {
            console.log('hello');
        } else {
            if (updateQuantity === '0') {
                console.log('hi');
                removeFromCart(saveProductId);
                let conatiner = document.querySelector(`.js-cart-item-container-${saveProductId}`);
                conatiner.remove();
                renderCheckoutHeader();
            } else {
                document.querySelector(`.js-quantity-input-${saveProductId}`).value = ``;
                document.querySelector('.js-quantity-count').innerHTML = Number(updateQuantity);
                cart.forEach((cartItem) => {
                    if (cartItem.productsId === saveProductId) {
                        cartItem.quantity = Number(updateQuantity);
                        saveToStorage();
                        renderCheckoutHeader();
                        console.log(cart);
                    }
                });
            }
        }
    });
});

document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        rederPaymentSummary();
    });
});

}