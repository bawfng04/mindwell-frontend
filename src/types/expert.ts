export type ExpertGender = "Nam" | "Nữ" | "Khác";

export type Review = {
  id: string;
  customerName: string;
  dateIso: string; // yyyy-mm-dd
  rating: number; // 0..5
  comment: string;
};

export type ExpertAvailability =
  | "Tất cả"
  | "Sáng"
  | "Chiều"
  | "Tối"
  | "Cuối tuần";

export type Expert = {
  id: string;
  name: string;
  degreePrefix?: string;
  title: string;
  specialty: string;
  gender: ExpertGender;
  languages: string[];
  rating: number;
  reviewsCount: number;
  pricePerSessionVnd: number;
  verified: boolean;
  avatarUrl?: string;

  // detail fields
  experienceYears?: number;
  about?: string;
  expertise?: string[]; // danh sách chuyên môn (bullet)
  reviews?: Review[];
};
