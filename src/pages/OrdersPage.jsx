import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import ShopeziHeader from '../components/ShopeziHeader.jsx';
import { addToCart, cart } from '../lib/data/cart.js';
import { orders } from '../lib/data/orders.js';
import { formatCurrency } from '../lib/utils/money.js';
import { getProduct, loadProductsFetch } from '../lib/data/products.js';

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export default function OrdersPage() {
  const [cartQuantity, setCartQuantity] = useState(getCartQuantity());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadProductsFetch().finally(() => setReady(true));
  }, []);

  const orderList = useMemo(() => orders, [ready]);

  return (
    <>
      <ShopeziHeader cartQuantity={cartQuantity} />
      <div className="main">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {!orderList.length && <div>No orders yet. Place an order from checkout.</div>}

          {orderList.map((order) => (
            <div className="order-container" key={order.id}>
              <div className="order-header">
                <div className="order-header-left-section">
                  <div className="order-date">
                    <div className="order-header-label">Order Placed:</div>
                    <div>{dayjs(order.orderTime).format('MMMM D')}</div>
                  </div>
                  <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>${formatCurrency(order.totalCostCents || 0)}</div>
                  </div>
                </div>

                <div className="order-header-right-section">
                  <div className="order-header-label">Order ID:</div>
                  <div>{order.id}</div>
                </div>
              </div>

              <div className="order-details-grid">
                {order.products.map((orderProduct) => {
                  const product = getProduct(orderProduct.productId);
                  if (!product) {
                    return null;
                  }

                  return (
                    <div key={product.id} style={{ display: 'contents' }}>
                      <div className="product-image-container">
                        <img src={product.image} />
                      </div>

                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-delivery-date">
                          Arriving on: {dayjs(orderProduct.estimatedDeliveryTime).format('MMMM D')}
                        </div>
                        <div className="product-quantity">Quantity: {orderProduct.quantity}</div>
                        <button
                          className="buy-again-button button-primary"
                          onClick={() => {
                            addToCart(product.id);
                            setCartQuantity(getCartQuantity());
                          }}
                        >
                          <img className="buy-again-icon" src="/images/icons/buy-again.png" />
                          <span className="buy-again-message">Buy it again</span>
                        </button>
                      </div>

                      <div className="product-actions">
                        <Link
                          to={`/tracking?orderId=${order.id}&productId=${product.id}`}
                        >
                          <button className="track-package-button button-secondary">
                            Track package
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
