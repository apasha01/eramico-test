export const NEWS = "/news";

export const SINGLE_NEWS = (id: string | number, title: string) =>
  `/news/${id}`; //${title}`;

export const SINGLE_CONTENT = (id: string | number) => `/news/${id}`;

export const SINGLE_POST = (id: string | number, title?: string) =>
  `/post/${id}`; //${title ? `/${title}` : ""}`;

export const PRODUCT = (slug: string, name?: string) => `/products/${slug}`; ///${name}`;

export const PRODUCT_COMPANIES = (slug: string) =>
  `/products/${slug}/companies`;

export const PRODUCT_AD = (slug: string) => `/products/${slug}/advertises`;

export const PRODUCT_INQ = (slug: string) => `/products/${slug}/inquiries`;

export const PRODUCT_CHARTS = (slug: string) => `/products/${slug}/charts`;

export const PRODUCT_NEWS = (slug: string) => `/products/${slug}/news`;

export const PROFILE = (username: string) => `/profile/${username}`;

export const PROFILE_POSTS = (username: string) => `/profile/${username}/posts`;

export const PROFILE_AD = (username: string) =>
  `/profile/${username}/advertises`;

export const PROFILE_INQ = (username: string) =>
  `/profile/${username}/inquiries`;

export const PROFILE_FOLLOWERS = (username: string) =>
  `/profile/${username}/followers`;

export const PROFILE_FOLLOWING = (username: string) =>
  `/profile/${username}/following`;

export const COMPANY = (slug: string) => `/companies/${slug}`; ///${name}`;

export const COMPANY_MEDIA = (slug: string) => `/companies/${slug}/media`;

export const COMPANY_AD = (slug: string) => `/companies/${slug}/advertises`;

export const COMPANY_INQ = (slug: string) => `/companies/${slug}/inquiries`;

export const COMPANY_FOLLOWERS = (slug: string) =>
  `/companies/${slug}/followers`;

export const ADVERTISE = (id: number | string, title?: string) =>
  `/advertise/${id}`; //${title ? "/" + title : ""}`;

export const ADVERTISES = "/advertises";

export const INQUIRY = (id: number | string, title?: string) =>
  `/inquiries/${id}`; //${title ? "/" + title : ""}`;

export const INQUIRIES = "/inquiries";
