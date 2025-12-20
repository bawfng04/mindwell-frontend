export type ExpertGender = "Nam" | "Nữ" | "Khác";

export type ExpertAvailability =
  | "Tất cả"
  | "Sáng"
  | "Chiều"
  | "Tối"
  | "Cuối tuần";

export type Expert = {
  id: string;
  name: string;
  degreePrefix?: string; // "TS.", "ThS.", "BS."
  title: string; // "Chuyên gia Tâm lý lâm sàng"
  specialty: string; // "Tâm lý lâm sàng"
  gender: ExpertGender;
  languages: string[];
  rating: number; // 0..5
  reviewsCount: number;
  pricePerSessionVnd: number;
  verified: boolean;
  avatarUrl?: string;
};
