import './ProductList.css';

const ProductList = ({ products, onAddToCart, loading }) => {
  if (loading) {
    return <div className="product-list loading">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="product-list empty">No products in this category</div>;
  }

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3 className="product-name">
                {/* Adjust field name based on actual Product DTO (e.g., product.ad, product.name, product.urunAdi) */}
                {product.ad || product.name || product.urunAdi || 'Product'}
              </h3>
              {product.aciklama && <p className="product-description">{product.aciklama}</p>}
              {product.description && <p className="product-description">{product.description}</p>}
              <p className="product-price">
                {/* Adjust field name based on actual Product DTO (e.g., product.fiyat, product.price) */}
                {product.fiyat !== undefined ? `₺${product.fiyat.toFixed(2)}` : ''}
                {product.price !== undefined ? `₺${product.price.toFixed(2)}` : ''}
              </p>
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;




