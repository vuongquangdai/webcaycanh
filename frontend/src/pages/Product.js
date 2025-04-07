// frontend/src/pages/Product.js

/**
 * @fileOverview Trang sản phẩm.
 * Hiển thị thông tin của sản phẩm, các hình ảnh và cho phép người dùng thêm vào giỏ hoặc mua ngay.
 */

import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api';
import { toast } from 'react-toastify';
import '../index.css';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    } else {
      setLoading(true);
      getProducts()
        .then(res => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
        })
        .catch(err => toast.error("Lỗi tải sản phẩm!"))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    toast.success("Sản phẩm đã được thêm vào giỏ hàng");
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    navigate("/payment", { state: { product, quantity: 1 } });
  };

  return (
    <div className="home product-home">
      <h1>Danh sách cây cảnh</h1>
      {loading ? <p>Đang tải...</p> : (
        <div className="product-grid">
          {products.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleCardClick(product)}
            >
              <img 
                src={`${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_1.jpg`} 
                alt={product.ten_cay} 
                onError={(e) => e.target.src = "/images_tree/default.jpg"} 
              />
              <h3>{product.ten_cay}</h3>
              <p>Giá: {Number(product.gia).toLocaleString()}đ</p>
              <div className="buttons" onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => handleBuyNow(product, e)} className="btn btn-buy">
                  Mua ngay
                </button>
                <button onClick={(e) => handleAddToCart(product, e)} className="btn btn-add-cart-icon">
                  <div className="cart-icon-wrapper">
                    <FaShoppingCart size={20} />
                    <span className="plus-icon">+</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Product;