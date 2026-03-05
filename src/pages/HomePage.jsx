import { useEffect, useState } from 'react';
import AmazonHeader from '../components/AmazonHeader.jsx';
import { addToCart, cart, loadFromStorage } from '../lib/data/cart.js';
import { loadProductsFetch, products } from '../lib/data/products.js';

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export default function HomePage() {
  const [productList, setProductList] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [addedState, setAddedState] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFromStorage();
    setCartQuantity(getCartQuantity());

    loadProductsFetch().then(() => {
      setProductList([...products]);
    });
  }, []);

  const handleAddToCart = (productId) => {
    const quantity = Number(selectedQuantities[productId] || 1);
    addToCart(productId, quantity);
    setCartQuantity(getCartQuantity());
    setAddedState((current) => ({ ...current, [productId]: true }));
    setTimeout(() => {
      setAddedState((current) => ({ ...current, [productId]: false }));
    }, 1500);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = productList.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      product.name,
      product.type,
      ...(Array.isArray(product.keywords) ? product.keywords : [])
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  const productsMarkup = filteredProducts.map((product) => (
        <div className="product-container" key={product.id}>
          <div className="product-image-container">
            <img className="product-image" src={product.image} />
          </div>

          <div className="product-name limit-text-to-2-lines">{product.name}</div>

          <div className="product-rating-container">
            <img className="product-rating-stars" src={product.getStarsUrl()} />
            <div className="product-rating-count link-primary">{product.rating.count}</div>
          </div>

          <div className="product-price">{product.getPrice()}</div>

          <div className="product-quantity-container">
            <select
              value={selectedQuantities[product.id] || '1'}
              onChange={(event) => {
                setSelectedQuantities((current) => ({
                  ...current,
                  [product.id]: event.target.value
                }));
              }}
            >
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

          {product.extraInforHTML() && (
            <div dangerouslySetInnerHTML={{ __html: product.extraInforHTML() }} />
          )}

          <div className="product-spacer" />
          <div
            className="added-to-cart"
            style={{ opacity: addedState[product.id] ? 1 : 0 }}
          >
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button
            className="add-to-cart-button button-primary"
            onClick={() => handleAddToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      ));

  return (
    <div className="amazon-page">
      <AmazonHeader
        cartQuantity={cartQuantity}
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearchSubmit={() => setSearchQuery(searchInput)}
        onLogoClick={() => {
          setSearchInput('');
          setSearchQuery('');
        }}
      />
      <div className="main">
        {normalizedQuery && filteredProducts.length === 0 ? (
          <div style={{ padding: '24px', fontSize: '16px' }}>
            No products found for "{searchQuery}".
          </div>
        ) : null}
        <div className="products-grid">{productsMarkup}</div>
      </div>
    </div>
  );
}
