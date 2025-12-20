import type { BlogPost } from "../types/blog";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title:
      "7 dấu hiệu bạn đang quá tải cảm xúc (và cách hạ nhiệt trong 10 phút)",
    excerpt:
      "Nhận biết sớm các dấu hiệu quá tải giúp bạn điều chỉnh nhịp sống và tránh kiệt sức kéo dài.",
    category: "Sức khỏe tinh thần",
    dateIso: "2025-11-05",
    readMinutes: 5,
    imageUrl: "https://placehold.co/1200x800/png?text=Mental+Health",
    tags: ["Tâm lý", "Sức khỏe", "Nhận biết"],
    author: {
      name: "TS. Nguyễn Minh Anh",
      role: "Chuyên gia Tâm lý lâm sàng",
      avatarUrl: "https://placehold.co/200x200/png?text=MA",
    },
  },
  {
    id: "b2",
    title: "Kỹ thuật thở 4-7-8: bài tập đơn giản để ngủ dễ hơn",
    excerpt:
      "Một kỹ thuật thở ngắn giúp giảm căng thẳng, hỗ trợ thư giãn và cải thiện chất lượng giấc ngủ.",
    category: "Kỹ thuật thực hành",
    // NOTE: nếu bạn muốn y chang category như ảnh thì thêm vào union; hiện giữ theo bộ category trên.
    dateIso: "2025-11-05",
    readMinutes: 5,
    imageUrl: "https://placehold.co/1200x800/png?text=Breathing",
    tags: ["Thư giãn", "Giấc ngủ", "Bài tập"],
    author: {
      name: "ThS. Trần Thu Hà",
      role: "Chuyên gia Tư vấn hôn nhân & gia đình",
      avatarUrl: "https://placehold.co/200x200/png?text=TH",
    },
  },
  {
    id: "b3",
    title: "Mindfulness nơi công sở: 3 thói quen nhỏ để bớt stress",
    excerpt:
      "Tối ưu năng lượng và sự tập trung nhớ các thói quen ngắn, có thể bắt đầu ngay hôm nay.",
    category: "Công việc",
    dateIso: "2025-11-05",
    readMinutes: 5,
    imageUrl: "https://placehold.co/1200x800/png?text=Work",
    tags: ["Mindfulness", "Năng suất", "Work-life"],
    author: {
      name: "BS. Lê Hoàng Nam",
      role: "Bác sĩ Tâm thần",
      avatarUrl: "https://placehold.co/200x200/png?text=LN",
    },
  },
];
