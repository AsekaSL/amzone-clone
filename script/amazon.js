import {cart, saveToStorage, calculateCartQuantity} from '../data/cart.js';
import {products} from '../data/data.js';
import {formatCurrency} from './utils/money.js';

let showHTML = '';
products.forEach( (products) => {
    showHTML += `<div class="product">
    <div class="product-image">
        <img src="${products.image}" class="image">
    </div>
    <div class="product-name">
        ${products.name}
    </div>
    <div class="product-rating">
        <div class="rating-image">
            <img src="images/rating/rating-${products.rating.stars * 10 }.png" class="rating-pic">
        </div>
        <div class="rating-count">
            ${products.rating.count}
        </div>
    </div>
    <div class="product-price">
        $${ formatCurrency(products.priceCents) }
    </div>
    <div class="product-item-select">
        <select class="product-item js-quantity-selector-${products.id}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
    </div>
    <div class="product-add js-add-checkmark-${products.id}">
        <img src="images/checkmark.png" class="checkmark-image">
        <div class="add-checkmark">
            Added
        </div>
    </div>
    <div class="product-add-button">
        <button class="add-to-cart-button js-add-to-cart" data-products-id="${products.id}">
            Add to Cart
        </button>
    </div>
</div>`;
});

let numQuantity = 0;
const previousAddedMassage = {};

document.querySelector('.product-grid').innerHTML = showHTML;


function updateCartQuantity() {
        document.querySelector('.cart-count').innerHTML = calculateCartQuantity();
}

function showAdd(productsId) {
    let addedMassage = document.querySelector(`.js-add-checkmark-${productsId}`);

        addedMassage.classList.add('product-added');
        setTimeout(() => { 
            addedMassage.classList.remove('product-added');
        } , 2000);

        const previousTimeId = previousAddedMassage.productId;

        if (previousAddedMassage) {
            clearTimeout(previousTimeId);
        }

        const timeoutId = setTimeout(() => { 
            addedMassage.classList.remove('product-added');
        } , 2000);

        previousAddedMassage.productId = timeoutId;
}

function addToCart(productsId) {
    let matchingItem;

        cart.forEach((cartItem) => {
            if (productsId === cartItem.productsId) {
                matchingItem = cartItem;
            }
        });

        numQuantity = Number(document.querySelector(`.js-quantity-selector-${productsId}`).value);

        if (matchingItem) {
            matchingItem.quantity += numQuantity;
        } else {
            cart.push({
                productsId: productsId,
                quantity: numQuantity,
                deliveryOptionId: '1'
            });
        }

        saveToStorage();
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {

        const productsId = button.dataset.productsId;

        addToCart(productsId);
        updateCartQuantity();
        showAdd(productsId);
        
    });
});