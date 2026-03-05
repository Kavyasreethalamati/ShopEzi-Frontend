import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ShopeziHeader from '../components/ShopeziHeader.jsx';
import { cart } from '../lib/data/cart.js';
import { orders } from '../lib/data/orders.js';
import { getProduct, loadProductsFetch } from '../lib/data/products.js';

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export default function TrackingPage() {
  const location = useLocation();
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    loadProductsFetch().finally(() => setProductsLoaded(true));
  }, []);

  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const productId = params.get('productId');

  const order = orders.find((value) => value.id === orderId);
  const orderProduct = order?.products?.find((value) => value.productId === productId);
  const product = productId ? getProduct(productId) : null;

  const deliveryDate = orderProduct?.estimatedDeliveryTime
    ? dayjs(orderProduct.estimatedDeliveryTime)
    : dayjs().add(7, 'day');

  const currentStatus = 'Preparing';
  const progress = 33;

  return (
    <>
      <ShopeziHeader cartQuantity={getCartQuantity()} />
      <div className="main">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">Arriving on {deliveryDate.format('dddd, MMMM D')}</div>

          <div className="product-info">
            {productsLoaded && product ? product.name : 'Black and Gray Athletic Cotton Socks - 6 Pairs'}
          </div>

          <div className="product-info">Quantity: {orderProduct?.quantity || 1}</div>

          <img
            className="product-image"
            src={productsLoaded && product ? product.image : 'images/products/athletic-cotton-socks-6-pairs.jpg'}
          />

          <div className="progress-labels-container">
            <div className={`progress-label ${currentStatus === 'Preparing' ? 'current-status' : ''}`}>
              Preparing
            </div>
            <div className={`progress-label ${currentStatus === 'Shipped' ? 'current-status' : ''}`}>
              Shipped
            </div>
            <div className={`progress-label ${currentStatus === 'Delivered' ? 'current-status' : ''}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
