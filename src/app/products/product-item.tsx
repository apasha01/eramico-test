import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { PRODUCT } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

interface ProductItemProps {
  id: number;
  title: string;
  iconUrl?: string;
  code?: string;
}

const ProductItem = ({ code, id, title, iconUrl }: ProductItemProps) => {
  const firstCharacter = code ? code.charAt(0) : "";

  return (
    <Link
      className="text-decoration-none"
      href={PRODUCT(id.toString(), title)}
      onClick={async () => {
        await saveEntityClick(id, EntityTypeEnum.Product);
      }}
    >
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <div
            className="defaultIcon"
            style={{ backgroundColor: id % 2 === 0 ? "#002664" : "#D80621" }}
          >
            <span className="fs-22" style={{ color: "white" }}>
              {firstCharacter}
            </span>
          </div>
        </div>
        <div className="d-flex flex-column gap-1">
          <div className={styles.title}>{title} </div>
          <div className="fs-14 text-grey">({code})</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
