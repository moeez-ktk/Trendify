import React from "react";
import "./Products.css";
import ProductCard from "../../../components/productCard/ProductCard";
import { useEffect, useState } from "react";
import axios from 'axios';
const Products = ({ updateCartLength }) => {
  const [cardsData, setCardsData] = useState([]);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://trendify-bese27c.vercel.app/api/products/filter?limit=8"
        ); // Change the limit as needed
        console.log(response.data);
        setCardsData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    //
   
  }, []);


  return (
    <div className="p-products" id="products">
      <h1 className="p-heading">
        latest<span>products</span>
      </h1>

      <div className="p-box_container">
        {cardsData.map((product) => (
          <ProductCard
                key={product._id}
                _id={product._id}
                imgUrl={`https://res.cloudinary.com/dobqsvkgk/image/upload/${product.images[0]}`}
                name={product.productName}
                price={product.price}
                piece={product.piece}
                fabric={product.fabric}
                updateCartLength={ updateCartLength }
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
