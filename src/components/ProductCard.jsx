import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop';
        }}
      />
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-stock">In Stock: {product.stock} units</p>
        <div className="product-pricing">
          <span className="product-price">${product.sale_price?.toFixed(2)}</span>
          <span className="product-original-price">${product.price?.toFixed(2)}</span>
        </div>
        <button className="product-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
