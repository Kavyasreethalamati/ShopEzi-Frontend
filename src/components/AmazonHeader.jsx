import { Link } from 'react-router-dom';

export default function AmazonHeader({
  cartQuantity = 0,
  searchValue = '',
  onSearchValueChange,
  onSearchSubmit,
  onLogoClick
}) {
  return (
    <div className="amazon-header">
      <div className="amazon-header-left-section">
        <Link to="/" className="header-link" onClick={onLogoClick}>
          <img className="amazon-logo" src="images/amazon-logo-white.png" />
          <img
            className="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png"
          />
        </Link>
      </div>

      <div className="amazon-header-middle-section">
        <form
          style={{ display: 'contents' }}
          onSubmit={(event) => {
            event.preventDefault();
            if (onSearchSubmit) {
              onSearchSubmit();
            }
          }}
        >
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={onSearchValueChange ? searchValue : undefined}
            onChange={(event) => {
              if (onSearchValueChange) {
                onSearchValueChange(event.target.value);
              }
            }}
          />
          <button className="search-button" type="submit">
            <img className="search-icon" src="images/icons/search-icon.png" />
          </button>
        </form>
      </div>

      <div className="amazon-header-right-section">
        <Link className="orders-link header-link" to="/orders">
          <span className="returns-text">Returns</span>
          <span className="orders-text">&amp; Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="images/icons/cart-icon.png" />
          <div className="cart-quantity">{cartQuantity}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>
  );
}
