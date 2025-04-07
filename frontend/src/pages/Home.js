// frontend/src/pages/Home.js

/**
 * @fileOverview Trang chủ hiển thị danh sách sản phẩm.
 * Người dùng có thể xem chi tiết, thêm vào giỏ hoặc mua ngay sản phẩm.
 */

import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api';
import { toast } from 'react-toastify';
import '../index.css';

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaShoppingCart } from 'react-icons/fa';
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) {
      // setProducts(JSON.parse(cachedProducts));
      const allProducts = JSON.parse(cachedProducts);
      const last = allProducts.slice(-12).reverse();
      setProducts(last);
    } else {
      setLoading(true);
      getProducts()
        .then(res => {
          // setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
          const last = res.data.slice(-12).reverse();
          setProducts(last);
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

  const slideImages = [
    "/background/background_0.jpg",
    "/background/background_1.jpg",
    "/background/background_2.jpg",
    "/background/background_3.jpg",
    "/background/background_4.jpg",
    "/background/background_5.jpg"
  ];

  return (
    <div className="home">
      <div className="slideshow">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          className="swiper-container"
        >
          {slideImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`Slide ${index + 1}`} className="slide-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h1>Sản phẩm mới</h1>
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

export default Home;