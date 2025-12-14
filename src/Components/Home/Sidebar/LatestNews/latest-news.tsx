import { unstable_noStore as noStore } from "next/cache";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { LATEST_NEWS } from "@/lib/urls";
import NewsItem from "./news-item";
import { Content } from "@/Helpers/Interfaces/Feed_interface";

interface NewsResponse extends IAPIResult<Content[]> {}

export default async function LatestNews() {
  noStore();
  const response = await axiosInstance.get<NewsResponse>(LATEST_NEWS);

  if (!response.data.success) {
    return null;
  }

  const news = response.data.data || [];

  return (
    <>
      <section className="row px-3 pb-4">
        <div className="container AdvertisementBG rounded-4 p-3 pb-0">
          <h6 className="col-12 rtl mt-1">آخرین اخبار</h6>
          {news.map((newsItem: Content, index: number) => (
            <>
              <NewsItem
                image={newsItem.image}
                title={newsItem.title}
                description={newsItem.lead}
                to={`/news/${newsItem.id}`}
                id={newsItem.id.toString()}
                date={
                  newsItem?.lastModifiedDatePersian ||
                  newsItem?.publishDate ||
                  newsItem?.createdDatePersian ||
                  ""
                }
              />
              {index !== news.length - 1 && <Divider />}
            </>
          ))}
          <div className="col-12 text-center pb-4 pt-2">
            <Button
              size="small"
              variant="outlined"
              LinkComponent={Link}
              href="/news"
            >
              مشاهده همه
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
