import './CategoryList.css';

const CategoryList = ({ categories, selectedCategoryId, onSelectCategory, loading }) => {
  if (loading) {
    return <div className="category-list loading">Loading categories...</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="category-list empty">No categories available</div>;
  }

  return (
    <div className="category-list">
      <h2>Categories</h2>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`category-button ${selectedCategoryId === category.id ? 'active' : ''}`}
          >
            {category.ad}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

