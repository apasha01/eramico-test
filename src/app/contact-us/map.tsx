import React from "react";
import Image from "next/image";
import Map from "../img/tempmap.png";

const MapComponent = () => {
  return (
    <div style={{ margin: "24px auto" }}>
      <Image  loading="lazy" alt="map" src={Map} />;
    </div>
  );
};

export default MapComponent;
