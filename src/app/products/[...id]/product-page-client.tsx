"use client";

import React, { useState } from "react";
import ProductName from "./product-name";
import ProductDetails from "./product-details";

interface ProductPageClientProps {
  product: any;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedView, setSelectedView] = useState(0);
  const {
    id: productId,
    title,
    isFollowed,
    avatar,
    followerCount,
    engTitle: code,
  } = product;
  return (
    <div className="mainStyle">
      <ProductName
        id={productId}
        title={title}
        isFollowed={isFollowed}
        avatar={avatar}
        followerCount={followerCount}
        code={code}
        setSelectedView={setSelectedView}
      />
      <ProductDetails
        {...product}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
    </div>
  );
}
