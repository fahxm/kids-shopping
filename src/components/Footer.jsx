
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-bold mb-6 block">Kids' World</Link>
          <p className="text-blue-100 max-w-sm mb-6">
            We believe every child deserves to feel special. From imaginative toys to comfy clothes,
            we bring the best brands together in one magical place.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition text-white">
              <span className="sr-only">Facebook</span>
              <FaFacebook size={20} />
            </a>
            <a href="https://www.instagram.com/fah_xm_/" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition text-white">
              <span className="sr-only">Instagram</span>
              <FaInstagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition text-white">
              <span className="sr-only">Pinterest</span>
              <FaPinterest size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-6">Explore</h4>
          <ul className="space-y-4 text-blue-100">
            <li><Link to="/shop?category=Clothing" className="hover:text-white transition">New Clothing</Link></li>
            <li><Link to="/shop?category=Toys" className="hover:text-white transition">Best Selling Toys</Link></li>
            <li><Link to="/shop?age=0-5" className="hover:text-white transition">Baby & Toddler</Link></li>
            <li><Link to="/shop?age=11-15" className="hover:text-white transition">Teen Scene</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-blue-100">
            <li><a href="#" className="hover:text-white transition">Track Order</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-blue-500 text-center text-blue-200 text-sm">
        <p>&copy; {new Date().getFullYear()} Kids' World E-Commerce. Made with 💖 for little explorers.</p>
      </div>
    </footer>
  );
};

export default Footer;
