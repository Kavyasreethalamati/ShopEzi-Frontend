import { Link } from 'react-router-dom';

export default function CheckoutHeader({ itemCount }) {
  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <Link to="/">
            <img className="shopezi-logo" src="/images/icons/shopezi.png" />
            <img className="shopezi-mobile-logo" src="/images/icons/shopezi.png" />
          </Link>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (<Link className="return-to-home-link" to="/">{itemCount} items</Link>)
        </div>

        <div className="checkout-header-right-section">
          <img src="/images/icons/checkout-lock-icon.png" />
        </div>
      </div>
    </div>
  );
}
