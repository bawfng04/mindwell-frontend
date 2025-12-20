export type BlogCategory =
  | "Tất cả"
  | "Sức khỏe tinh thần"
  | "Công việc"
  | "Gia đình"
  | "Tâm lý xã hội"
  | "Mẹo nhỏ"
  | "Kỹ thuật thực hành";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<BlogCategory, "Tất cả">;
  dateIso: string; // yyyy-mm-dd
  readMinutes: number;
  imageUrl: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
};
