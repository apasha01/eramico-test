import React from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import { LiaArrowLeftSolid } from "react-icons/lia";
import NothingFound from "./nothingFound";
interface Article {
  id: number;
  title: string;
  lead: string;
  to: string;
}

interface ArticleListProps {
  articles: Article[];
  onClose?: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onClose }) => {
  return (
    <div>
      {articles?.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          {articles.map((article: Article) => (
            <Link
              href={`/news/${article.id}`}
              key={`/news/${article.id}`}
              style={{ textDecoration: "none" }}
              onClick={onClose}
            >
              <div className="col  px-0 buyAdvertisement px-4 py-2 BorderBottom">
                <div className="d-flex my-1 justify-content-between w-100 align-content-center ">
                  <Typography variant="body1" sx={{ textDecoration: "none" }}>
                    {article.title}
                  </Typography>
                  <LiaArrowLeftSolid size={24} className="black " />
                </div>
                <Typography
                  variant="body2"
                  className="col-12 pt-2"
                  sx={{ textDecoration: "none" }}
                >
                  {article?.lead}
                </Typography>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default ArticleList;
