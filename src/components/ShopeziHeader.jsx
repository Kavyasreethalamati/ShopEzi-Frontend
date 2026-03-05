import { Link } from 'react-router-dom';

export default function ShopeziHeader({
  cartQuantity = 0,
  searchValue = '',
  onSearchValueChange,
  onSearchSubmit,
  onLogoClick
}) {
  return (
    <div className="shopezi-header">
      <div className="shopezi-header-left-section">
        <Link to="/" className="header-link" onClick={onLogoClick}>
          <img className="shopezi-logo" src="images/icons/shopezi.png" />
          <img
            className="shopezi-mobile-logo"
            src="images/icons/shopezi.png"
          />
        </Link>
      </div>

      <div className="shopezi-header-middle-section">
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

      <div className="shopezi-header-right-section">
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
