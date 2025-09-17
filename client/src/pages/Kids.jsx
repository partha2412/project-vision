import React from "react";
import products_Category from "../datas/product";
import ProductCard from "../components/ProductCard";

const Kids = () => {
  const kidsProducts = products_Category.filter(product => product.category === "Kids");

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Kids' Glasses</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {kidsProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Kids;
