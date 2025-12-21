import type { BlogPost } from "../types/blog";

export const BLOG_POSTS: BlogPost[] = [
  // --- MÀNG SỨC KHỎE TINH THẦN ---
  {
    id: "b1",
    title:
      "7 dấu hiệu bạn đang quá tải cảm xúc (và cách hạ nhiệt trong 10 phút)",
    excerpt:
      "Nhận biết sớm các dấu hiệu quá tải giúp bạn điều chỉnh nhịp sống và tránh kiệt sức kéo dài.",
    category: "Sức khỏe tinh thần",
    dateIso: "2025-11-05",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["Tâm lý", "Sức khỏe", "Nhận biết"],
    author: {
      name: "TS. Nguyễn Minh Anh",
      role: "Chuyên gia Tâm lý lâm sàng",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },

  // --- MẢNG CÔNG VIỆC ---
  {
    id: "b3",
    title: "Mindfulness nơi công sở: 3 thói quen nhỏ để bớt stress",
    excerpt:
      "Tối ưu năng lượng và sự tập trung nhớ các thói quen ngắn, có thể bắt đầu ngay hôm nay.",
    category: "Công việc",
    dateIso: "2025-11-12",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["Mindfulness", "Năng suất", "Work-life"],
    author: {
      name: "BS. Lê Hoàng Nam",
      role: "Bác sĩ Tâm thần",
      avatarUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
  {
    id: "b4",
    title:
      "Toxic Workplace: Nhận diện môi trường làm việc độc hại và cách thoát ra",
    excerpt:
      "Đừng để công việc bào mòn giá trị bản thân. Những red flags cho thấy bạn cần update CV ngay lập tức.",
    category: "Công việc",
    dateIso: "2025-11-20",
    readMinutes: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200&h=800", // Office building
    tags: ["Sự nghiệp", "Burnout", "Nhảy việc"],
    author: {
      name: "MBA. Kevin Nguyễn",
      role: "Chuyên gia Khai vấn Lãnh đạo",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
  {
    id: "b7",
    title:
      "Hội chứng Kẻ mạo danh: Khi thành công nhưng vẫn thấy mình không xứng đáng",
    excerpt:
      "Bạn sợ bị 'bóc mẽ' dù bạn có năng lực thực sự? Đây là cách vượt qua Imposter Syndrome trong môi trường công sở.",
    category: "Công việc",
    dateIso: "2025-12-10",
    readMinutes: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["Sự nghiệp", "Tự tin", "Tâm lý hành vi"],
    author: {
      name: "MBA. Kevin Nguyễn",
      role: "Chuyên gia Khai vấn Lãnh đạo",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },

  // --- MẸO NHỎ ---
  {
    id: "b5",
    title: "Digital Detox: 24h ngắt kết nối để kết nối lại với chính mình",
    excerpt:
      "Cảm thấy kiệt sức vì mạng xã hội? Thử thách 24h cai nghiện smartphone và những thay đổi bất ngờ bạn sẽ nhận được.",
    category: "Mẹo nhỏ",
    dateIso: "2025-12-01",
    readMinutes: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1200&h=800",
    tags: ["Social Media", "Detox", "Gen Z"],
    author: {
      name: "CN. Đặng Văn Hùng",
      role: "Tham vấn viên Tâm lý",
      avatarUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
  {
    id: "b6",
    title: "Viết nhật ký biết ơn: 5 phút mỗi tối thay đổi tư duy tích cực",
    excerpt:
      "Không cần văn hay chữ tốt. Chỉ cần một cuốn sổ và sự chân thành để 'hack' lại não bộ của bạn theo hướng hạnh phúc hơn.",
    category: "Mẹo nhỏ",
    dateIso: "2025-12-03",
    readMinutes: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200&h=800", // Journaling
    tags: ["Journaling", "Biết ơn", "Self-help"],
    author: {
      name: "Blogger Chi Nguyễn",
      role: "Content Creator",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },

  // --- GIA ĐÌNH ---
  {
    id: "b8",
    title:
      "Khoảng cách thế hệ: Làm sao để nói chuyện với bố mẹ mà không cãi vã?",
    excerpt:
      "Giao tiếp với phụ huynh chưa bao giờ dễ dàng. Học cách lắng nghe và thấu hiểu để bữa cơm gia đình bớt căng thẳng.",
    category: "Gia đình",
    dateIso: "2025-12-15",
    readMinutes: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200&h=800", // Family walking
    tags: ["Giao tiếp", "Thế hệ", "Thấu hiểu"],
    author: {
      name: "TS. Nguyễn Minh Anh",
      role: "Chuyên gia Tâm lý lâm sàng",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
  {
    id: "b9",
    title: "Khủng hoảng tuổi trung niên: Khi cha mẹ cũng yếu đuối",
    excerpt:
      "Chúng ta thường quên rằng cha mẹ cũng có những nỗi sợ riêng. Góc nhìn tâm lý để bạn cảm thông hơn với đấng sinh thành.",
    category: "Gia đình",
    dateIso: "2025-12-18",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200&h=800", // Old hands/Walk
    tags: ["Người cao tuổi", "Sức khỏe", "Cảm xúc"],
    author: {
      name: "BS. Lê Hoàng Nam",
      role: "Bác sĩ Tâm thần",
      avatarUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },

  // --- TÂM LÝ XÃ HỘI ---
  {
    id: "b11",
    title: "Gaslighting: Khi người thương thao túng tâm lý bạn",
    excerpt:
      "Một dạng bạo hành tinh thần tinh vi khiến bạn nghi ngờ chính trí nhớ và nhận thức của mình. Dấu hiệu và cách phòng vệ.",
    category: "Tâm lý xã hội",
    dateIso: "2025-12-22",
    readMinutes: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1200&h=800", // Shadow/Dark
    tags: ["Thao túng", "Quan hệ", "Red flag"],
    author: {
      name: "ThS. Trần Thu Hà",
      role: "Chuyên viên Tham vấn",
      avatarUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },

  // --- KỸ THUẬT THỰC HÀNH ---
  {
    id: "b12",
    title: "Kỹ thuật 5-4-3-2-1: 'Neo' lại cảm xúc khi cơn hoảng loạn ập tới",
    excerpt:
      "Một bài tập Grounding kinh điển giúp bạn quay về thực tại ngay lập tức khi cảm thấy mất kiểm soát.",
    category: "Kỹ thuật thực hành",
    dateIso: "2025-12-25",
    readMinutes: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200&h=800", // Meditation/Yoga
    tags: ["Grounding", "Panic attack", "Sơ cứu cảm xúc"],
    author: {
      name: "TS. Nguyễn Minh Anh",
      role: "Chuyên gia Tâm lý lâm sàng",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
  {
    id: "b13",
    title: "Ma trận Eisenhower: Quản lý thời gian cho người hay trì hoãn",
    excerpt:
      "Không phải việc nào cũng 'Gấp'. Học cách phân loại công việc để làm ít hơn nhưng hiệu quả hơn.",
    category: "Kỹ thuật thực hành",
    dateIso: "2025-12-28",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200&h=800", // Checklist
    tags: ["Năng suất", "Trì hoãn", "Kỹ năng"],
    author: {
      name: "MBA. Kevin Nguyễn",
      role: "Chuyên gia Khai vấn Lãnh đạo",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    },
  },
];
