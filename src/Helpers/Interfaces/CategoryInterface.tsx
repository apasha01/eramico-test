export interface Category {
  icon: string | null;
  children: Category[] | null;
  id: number;
  parentId: number | null;
  title: string;
  code: string;
  orderNo: number;
  isChecked: boolean;
}
