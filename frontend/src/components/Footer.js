// frontend/src/components/Footer.js

/**
 * @fileOverview Component Footer hiển thị chân trang.
 */

import '../index.css';
import { FaGoogle, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col about-col">
          <h3>ABOUT US</h3>
          <p className="about-text">
            Những ai điên đủ nghĩ rằng mình có thể thay đổi thế giới sẽ là những người làm được điều đó.
            <br /><br /><em>Steve Jobs</em>
          </p>
          <div className="icon-main">
            <div className="icons"><FaGoogle className="icon" /></div>
            <div className="icons"><FaFacebookF className="icon" /></div>
            <div className="icons"><FaTwitter className="icon" /></div>
            <div className="icons"><FaInstagram className="icon-ins" /></div>
            <div className="icons"><FaLinkedinIn className="icon" /></div>
          </div>
        </div>

        <div className="footer-col">
          <h3>INFORMATION</h3>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">Privacy Information</a></li>
            <li><a href="#">Return &amp; Policy</a></li>
            <li><a href="#">Terms &amp; Condition</a></li>
            <li><a href="#">Manufacturers</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>MY ACCOUNT</h3>
          <ul>
            <li><a href="#">My Account</a></li>
            <li><a href="#">My Cart</a></li>
            <li><a href="#">Login</a></li>
            <li><a href="#">Wishlist</a></li>
            <li><a href="#">Checkout</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>OUR SERVICE</h3>
          <ul>
            <li><a href="#">Help</a></li>
            <li><a href="#">Complain</a></li>
            <li><a href="#">Installation</a></li>
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Warranty Policy</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h3>NEWSLETTER</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Your Mail" />
            <button>Send Mail</button>
          </div>
        </div>
      </div>

      <div className="footer-bt">
        <div className="footer-bottom">
          <p>Copyright Webcaycanh 2025. All Right Reserved.</p>
          <div className="payment-icons">
            <img src="/background/paypol.png" alt="paypol" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
