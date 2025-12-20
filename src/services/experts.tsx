import type { Expert } from "../types/expert";

export const EXPERTS: Expert[] = [
  // --- EXPERT 1: Clinical Psychologist ---
  {
    id: "e1",
    name: "Nguyễn Minh Anh",
    degreePrefix: "TS.",
    title: "Chuyên gia Tâm lý lâm sàng",
    specialty: "Tâm lý lâm sàng",
    gender: "Nữ",
    languages: ["Tiếng Việt", "English"],
    rating: 4.9,
    reviewsCount: 127,
    pricePerSessionVnd: 500_000,
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Minh+Anh",
    experienceYears: 10,
    about:
      "Tiến sĩ Nguyễn Minh Anh là chuyên gia tâm lý lâm sàng với hơn 10 năm kinh nghiệm trong tư vấn và trị liệu cho cá nhân & gia đình. Bác sĩ đề cao môi trường tư vấn an toàn, tôn trọng và dựa trên bằng chứng khoa học.",
    expertise: [
      "Rối loạn lo âu và hoảng sợ",
      "Trầm cảm và rối loạn tâm trạng",
      "Quản lý stress & burnout",
      "Vấn đề hôn nhân và gia đình",
      "Tâm lý học tích cực",
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Nguyễn Thị B",
        dateIso: "2025-11-11",
        rating: 5,
        comment:
          "Bác sĩ rất tận tâm và chuyên nghiệp. Tôi cảm thấy thoải mái hơn rất nhiều sau các buổi tư vấn.",
      },
      {
        id: "r2",
        customerName: "Trần Văn C",
        dateIso: "2025-11-01",
        rating: 4,
        comment:
          "Chuyên gia giỏi, lắng nghe và đưa ra những lời khuyên thiết thực. Rất cảm ơn!",
      },
      {
        id: "r3",
        customerName: "Lê Thị D",
        dateIso: "2025-10-21",
        rating: 5,
        comment:
          "Buổi tư vấn rất hữu ích. Bác sĩ nhiệt tình và am hiểu sâu sắc vấn đề của tôi.",
      },
    ],
  },

  // --- EXPERT 2: Family & Marriage Focus ---
  {
    id: "e2",
    name: "Trần Thu Hà",
    degreePrefix: "ThS.",
    title: "Chuyên gia Tư vấn hôn nhân & gia đình",
    specialty: "Hôn nhân & gia đình",
    gender: "Nữ",
    languages: ["Tiếng Việt"],
    rating: 4.7,
    reviewsCount: 95,
    pricePerSessionVnd: 350_000,
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Thu+Ha",
    experienceYears: 8,
    about:
      "Tập trung vào tham vấn cặp đôi và gia đình, hỗ trợ cải thiện giao tiếp, giải quyết xung đột và xây dựng gắn kết bền vững giữa các thành viên.",
    expertise: [
      "Tham vấn cặp đôi",
      "Kỹ năng giao tiếp",
      "Gắn kết gia đình",
      "Khủng hoảng ly hôn",
    ],
    reviews: [
      {
        id: "r4",
        customerName: "Phạm Văn K",
        dateIso: "2025-09-15",
        rating: 5,
        comment:
          "Cô Hà đã cứu vãn cuộc hôn nhân của chúng tôi. Thực sự biết ơn.",
      },
    ],
  },

  // --- EXPERT 3: Psychiatrist (Medical Focus) ---
  {
    id: "e3",
    name: "Lê Hoàng Nam",
    degreePrefix: "BS.",
    title: "Bác sĩ Chuyên khoa Tâm thần",
    specialty: "Tâm thần",
    gender: "Nam",
    languages: ["Tiếng Việt", "English", "Français"],
    rating: 4.8,
    reviewsCount: 210,
    pricePerSessionVnd: 600_000,
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Hoang+Nam",
    experienceYears: 15,
    about:
      "Bác sĩ Nam có kinh nghiệm dày dặn tại các bệnh viện lớn. Chuyên khám và điều trị dược lý kết hợp liệu pháp tâm lý cho các rối loạn tâm thần phức tạp.",
    expertise: [
      "Rối loạn lưỡng cực",
      "Tâm thần phân liệt",
      "Rối loạn giấc ngủ mạn tính",
      "Cai nghiện chất kích thích",
    ],
    reviews: [], // Giả lập trường hợp chưa load được review hoặc user lười đánh giá
  },

  // --- EXPERT 4: Child & Adolescent Psychology ---
  {
    id: "e4",
    name: "Phạm Đức Thắng",
    degreePrefix: "ThS.",
    title: "Chuyên gia Tâm lý Trẻ em & Vị thành niên",
    specialty: "Tâm lý học đường",
    gender: "Nam",
    languages: ["Tiếng Việt"],
    rating: 4.6,
    reviewsCount: 42,
    pricePerSessionVnd: 300_000,
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Duc+Thang",
    experienceYears: 6,
    about:
      "Thấu hiểu tâm lý trẻ em và tuổi dậy thì. Đồng hành cùng phụ huynh trong việc nuôi dạy con cái và giải quyết các vấn đề học đường.",
    expertise: [
      "Tự kỷ & ADHD",
      "Áp lực học đường",
      "Bắt nạt học đường",
      "Giáo dục giới tính",
    ],
    reviews: [
      {
        id: "r5",
        customerName: "Mẹ bé Sâu",
        dateIso: "2025-12-01",
        rating: 5,
        comment:
          "Thầy Thắng rất kiên nhẫn với bé. Bé nhà mình đã tiến bộ rõ rệt.",
      },
      {
        id: "r6",
        customerName: "Phụ huynh lớp 9A",
        dateIso: "2025-11-20",
        rating: 4,
        comment: "Tư vấn nhiệt tình, phương pháp hiện đại.",
      },
    ],
  },

  // --- EXPERT 5: Career & Workplace Counseling ---
  {
    id: "e5",
    name: "Võ Thị Mỹ Duyên",
    degreePrefix: "CN.",
    title: "Chuyên gia Tham vấn Hướng nghiệp",
    specialty: "Tâm lý tổ chức",
    gender: "Nữ",
    languages: ["Tiếng Việt", "English"],
    rating: 4.5,
    reviewsCount: 18,
    pricePerSessionVnd: 250_000,
    verified: false, // Thử case chưa verify
    avatarUrl: "https://placehold.co/400x400/png?text=My+Duyen",
    experienceYears: 4,
    about:
      "Hỗ trợ người đi làm vượt qua khủng hoảng sự nghiệp (burnout), định hướng phát triển bản thân và cân bằng work-life.",
    expertise: [
      "Burnout (Kiệt sức nghề nghiệp)",
      "Định hướng sự nghiệp",
      "Kỹ năng mềm",
      "Xung đột công sở",
    ],
    reviews: [],
  },

  // --- EXPERT 6: Trauma & Healing Focus (High Price) ---
  {
    id: "e6",
    name: "Sophia Trần",
    degreePrefix: "TS.",
    title: "Chuyên gia Trị liệu Sang chấn",
    specialty: "Tâm lý trị liệu",
    gender: "Nữ",
    languages: ["English", "Tiếng Việt"],
    rating: 5.0,
    reviewsCount: 31,
    pricePerSessionVnd: 1_200_000, // Giá cao hẳn
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Sophia",
    experienceYears: 12,
    about:
      "Tiến sĩ Sophia tu nghiệp tại Mỹ, chuyên sâu về các liệu pháp EMDR và CBT dành cho người bị sang chấn tâm lý nặng.",
    expertise: [
      "PTSD (Rối loạn căng thẳng sau sang chấn)",
      "Trầm cảm kháng trị",
      "Mất mát và đau thương",
      "Trị liệu nhận thức hành vi (CBT)",
    ],
    reviews: [
      {
        id: "r7",
        customerName: "Anonymous",
        dateIso: "2025-12-10",
        rating: 5,
        comment: "A life-changing experience. Highly recommended for expats.",
      },
    ],
  },

  // --- EXPERT 7: Low Cost / Beginner ---
  {
    id: "e7",
    name: "Đặng Văn Hùng",
    degreePrefix: "CN.",
    title: "Tham vấn viên Tâm lý",
    specialty: "Tâm lý xã hội",
    gender: "Nam",
    languages: ["Tiếng Việt"],
    rating: 4.2,
    reviewsCount: 12,
    pricePerSessionVnd: 150_000, // Giá sinh viên
    verified: true,
    avatarUrl: "https://placehold.co/400x400/png?text=Van+Hung",
    experienceYears: 2,
    about:
      "Lắng nghe và chia sẻ các vấn đề khó nói trong cuộc sống thường ngày. Phù hợp với học sinh, sinh viên cần người tâm sự.",
    expertise: ["Tình yêu đôi lứa", "Kỹ năng sống", "Quản lý cảm xúc cơ bản"],
    reviews: [],
  },
];
