import React from 'react';

const products = [
  { id: 1, name: "Cotton Blue Dress", price: "₹899", img: "https://images.pexels.com/photos/1619697/pexels-photo-1619697.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 2, name: "Wooden Toy Train", price: "₹450", img: "https://images.pexels.com/photos/255514/pexels-photo-255514.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 3, name: "Pink Floral Frock", price: "₹1200", img: "https://images.pexels.com/photos/3663068/pexels-photo-3663068.jpeg?auto=compress&cs=tinysrgb&w=400" }
];

const ProductGrid = () => {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
          <div className="p-4 text-center">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-pink-600 font-semibold">{product.price}</p>
            <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;