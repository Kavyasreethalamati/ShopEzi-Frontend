import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import CheckoutHeader from '../components/CheckoutHeader.jsx';
import {
  cart,
  clearCart,
  loadCart,
  removeFromCart,
  updateCartItemQuantity,
  updateDeliveryOption
} from '../lib/data/cart.js';
import { deliveryOptions, getDeliveryOption } from '../lib/data/deliveryOptions.js';
import { addOrder } from '../lib/data/orders.js';
import { formatCurrency } from '../lib/utils/money.js';
import { getProduct, loadProductsFetch } from '../lib/data/products.js';

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [renderTick, setRenderTick] = useState(0);
  const [editingItems, setEditingItems] = useState({});
  const [draftQuantities, setDraftQuantities] = useState({});

  useEffect(() => {
    async function loadPage() {
      try {
        await loadProductsFetch();
        await new Promise((resolve) => {
          let settled = false;
          const done = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
          };

          loadCart(done);
          setTimeout(done, 2000);
        });
      } catch (error) {
        console.log('unexpected error. Please try again later.');
      } finally {
        setReady(true);
      }
    }

    loadPage();
  }, []);

  const { productPriceCents, shippingPriceCents, cartDetails } = useMemo(() => {
    let productsTotal = 0;
    let shippingTotal = 0;
    const details = cart
      .map((cartItem) => {
        const product = getProduct(cartItem.productId);
        if (!product) {
          return null;
        }

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        productsTotal += product.priceCents * cartItem.quantity;
        shippingTotal += deliveryOption.priceCents;

        return { cartItem, product, deliveryOption };
      })
      .filter(Boolean);

    return {
      productPriceCents: productsTotal,
      shippingPriceCents: shippingTotal,
      cartDetails: details
    };
  }, [renderTick]);

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  if (!ready) {
    return (
      <>
        <CheckoutHeader itemCount={getCartQuantity()} />
        <div className="main">
          <div className="page-title">Loading checkout...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <CheckoutHeader itemCount={getCartQuantity()} />
      <div className="main">
        <div className="page-title">Review your order</div>
        <div className="checkout-grid">
          <div className="order-summary">
            {cartDetails.map(({ cartItem, product }) => (
              <div className="cart-item-container" key={product.id}>
                <div className="delivery-date">
                  Delivery date:{' '}
                  {dayjs()
                    .add(getDeliveryOption(cartItem.deliveryOptionId).deliveryDays, 'days')
                    .format('dddd, MMMM D')}
                </div>

                <div className="cart-item-details-grid">
                  <img className="product-image" src={product.image} />

                  <div className="cart-item-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{product.getPrice()}</div>
                    <div className="product-quantity">
                      <span>
                        Quantity:{' '}
                        <span className="quantity-label">
                          {editingItems[product.id]
                            ? draftQuantities[product.id] || cartItem.quantity
                            : cartItem.quantity}
                        </span>
                      </span>
                      {!editingItems[product.id] ? (
                        <span
                          className="update-quantity-link link-primary"
                          onClick={() => {
                            setEditingItems((current) => ({ ...current, [product.id]: true }));
                            setDraftQuantities((current) => ({
                              ...current,
                              [product.id]: cartItem.quantity
                            }));
                          }}
                        >
                          Update
                        </span>
                      ) : (
                        <span style={{ marginLeft: '8px' }}>
                          <button
                            className="button-secondary"
                            onClick={() => {
                              setDraftQuantities((current) => ({
                                ...current,
                                [product.id]: Math.max(
                                  1,
                                  Number(current[product.id] || cartItem.quantity) - 1
                                )
                              }));
                            }}
                          >
                            -
                          </button>
                          <button
                            className="button-secondary"
                            style={{ marginLeft: '6px' }}
                            onClick={() => {
                              setDraftQuantities((current) => ({
                                ...current,
                                [product.id]: Number(current[product.id] || cartItem.quantity) + 1
                              }));
                            }}
                          >
                            +
                          </button>
                          <button
                            className="button-primary"
                            style={{ marginLeft: '6px', padding: '4px 10px' }}
                            onClick={() => {
                              updateCartItemQuantity(
                                product.id,
                                Number(draftQuantities[product.id] || cartItem.quantity)
                              );
                              setEditingItems((current) => ({
                                ...current,
                                [product.id]: false
                              }));
                              setRenderTick((value) => value + 1);
                            }}
                          >
                            Save
                          </button>
                        </span>
                      )}
                      <span
                        className="delete-quantity-link link-primary"
                        onClick={() => {
                          removeFromCart(product.id);
                          setRenderTick((value) => value + 1);
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  </div>

                  <div className="delivery-options">
                    <div className="delivery-options-title">Choose a delivery option:</div>
                    {deliveryOptions.map((option) => {
                      const isChecked = option.id === cartItem.deliveryOptionId;
                      const priceString =
                        option.priceCents === 0
                          ? 'FREE'
                          : `$${formatCurrency(option.priceCents)} - `;

                      return (
                        <label
                          className="delivery-option"
                          key={option.id}
                          onClick={() => {
                            updateDeliveryOption(product.id, option.id);
                            setRenderTick((value) => value + 1);
                          }}
                        >
                          <input
                            type="radio"
                            checked={isChecked}
                            className="delivery-option-input"
                            name={`delivery-option-${product.id}`}
                            readOnly
                          />
                          <div>
                            <div className="delivery-option-date">
                              {dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D')}
                            </div>
                            <div className="delivery-option-price">{priceString} Shipping</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Order Summary</div>

            <div className="payment-summary-row">
              <div>Items ({getCartQuantity()}):</div>
              <div className="payment-summary-money">${formatCurrency(productPriceCents)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">${formatCurrency(shippingPriceCents)}</div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">${formatCurrency(totalBeforeTaxCents)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">${formatCurrency(taxCents)}</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">${formatCurrency(totalCents)}</div>
            </div>

            <button
              className="place-order-button button-primary"
              onClick={async () => {
                let orderPlaced = false;
                try {
                  const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      cart
                    })
                  });
                  const order = await response.json();
                  addOrder(order);
                  orderPlaced = true;
                } catch (error) {
                  console.log('string unexpected error.');
                }

                if (orderPlaced) {
                  clearCart();
                }
                navigate('/orders');
              }}
            >
              Place your order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
