import {cart, calculateCartQuantity} from '../../data/cart.js';
import {getProduct} from '../../data/data.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';

export function rederPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;


    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productsId);
        productPriceCents += product.priceCents * cartItem.quantity;

        
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const toatlCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
    <div class="product-summary-name">
        Order Summary
    </div>
    <div class="order-items-price">
        <div>
            Items (${calculateCartQuantity()}):
        </div>
        <div>
            $${formatCurrency(productPriceCents)}
        </div>
    </div>
    <div class="shipping-handiling">
        <div>
            Shipping & handling:
        </div>
        <div>
            $${formatCurrency(shippingPriceCents)}
        </div>
    </div>
    <hr class="small-line">
    <div class="tax-before-price">
        <div>
            Total before tax:
        </div>
        <div>
            $${formatCurrency(totalBeforeTaxCents)}
        </div>
    </div>
    <div class="tax-price">
        <div>
            Estimated tax (10%):
        </div>
        <div>
            $${formatCurrency(taxCents)}
        </div>
    </div>
    <hr class="big-line">
    <div class="total-price">
        <div>
            Order total:
        </div>
        <div>
            $${formatCurrency(toatlCents)}
        </div>
    </div>
    <div class="paypal-price">
        <div class="paypal-name">
            Use PayPal
        </div>
        <input type="checkbox" class="checkbox">
    </div>
    <button class="place-order">
        Place your order
    </button> 
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

}