export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type LanguageOption = { code: string; name: string };
export type SpecializationOption = { id: number; name: string };

export type ExpertCardDto = {
  expertId: number;
  fullName: string;
  title: string;
  hourlyRate: number;
  isVerified: boolean;
  gender: string;
  avgRating: number;
  reviewCount: number;
  languages: LanguageOption[];
  specializations: SpecializationOption[];
};

export type ExpertDetailDto = ExpertCardDto & {
  experienceYears?: number;
  bio?: string;
  profileImageUrl?: string;
};

export type AvailabilitySlotDto = {
  availabilityId: number;
  startTime: string; // ISO
  endTime: string; // ISO
};

export type ExpertFilterOptionsDto = {
  languages: LanguageOption[];
  specializations: SpecializationOption[];
  genders: string[];
};

export type RegisterRequestDto = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
};

export type LoginRequestDto = { email: string; password: string };

export type AuthResponseDto = {
  tokenType: string; // "Bearer"
  accessToken: string;
  userId: number;
  email: string;
  fullName: string;
};

export type MeDto = {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  mindpointsBalance: number;
};

export type CreateAppointmentDraftRequestDto = { availabilityId: number };

export type CreateAppointmentResponseDto = {
  apptId: number;
  expertId: number;
  userId: number;
  availabilityId: number;
  startTime: string;
  status: string;
  totalAmountPoints: number;
  serviceType?: string;
  platformId?: number;
};

export type MeetingPlatformOptionDto = {
  platformId: number;
  platformKey: string;
  displayName: string;
  isActive: boolean;
};

export type PaymentMethodOptionDto = {
  methodKey: string;
  displayName: string;
  badgeLabel?: string;
  isActive: boolean;
};

export type CheckoutOptionsDto = {
  platforms: MeetingPlatformOptionDto[];
  serviceTypes: string[];
  paymentMethods: PaymentMethodOptionDto[];
};

export type AppointmentCheckoutDto = {
  apptId: number;
  expertId: number;
  expertName: string;
  expertTitle: string;
  platformId?: number;
  platformName?: string;
  serviceType?: string;
  startTime: string;
  endTime: string;
  totalAmountPoints: number;
  userMindpointsBalance: number;
  contactFullName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: string;
};

export type AppointmentConfirmationDto = {
  apptId: number;
  status: string;
  startTime: string;
  endTime: string;
  platformName?: string;
  meetingJoinUrl?: string;
  contactEmail?: string;
};

export type InitiateAppointmentPaymentRequestDto = {
  methodKey: string; // "momo" | "mindpoints" | ...
  platformId?: number;
  serviceType?: string; // "video" | "chat" | "voice"
  contactFullName?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type InitiateAppointmentPaymentResponseDto = {
  paymentId: number;
  status: string;
  redirectUrl?: string | null;
  message?: string | null;
};

export type MyAppointmentItemDto = {
  apptId: number;
  expertId: number;
  expertName: string;
  expertTitle: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceType?: string;
  platformId?: number;
  platformName?: string;
  totalAmountPoints?: number;
  paymentId?: number;
  paymentStatus?: string;
  meetingJoinUrl?: string;
};

export type BlogCategoryDto = {
  categoryId: number;
  name: string;
};

export type BlogAuthorDto = {
  expertId: number;
  fullName: string;
  title: string;
};

export type BlogPostListItemDto = {
  postId: number;
  slug?: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string | null;
  publishedAt: string; // ISO
  readingMinutes: number;
  author: BlogAuthorDto;
  categories: BlogCategoryDto[];
};

export type BlogPostDetailDto = {
  postId: number;
  slug?: string;
  title: string;
  content: string;
  contentFormat: "markdown" | "html" | string;
  coverImageUrl?: string | null;
  publishedAt: string; // ISO
  readingMinutes: number;
  author: BlogAuthorDto;
  categories: BlogCategoryDto[];
};

export type AppointmentDto = {
  apptId: number;
  expertId: number;
  expertName: string;
  expertTitle: string;
  startTime: string; // ISO
  endTime: string; // ISO
  status: string;

  serviceType?: string | null;
  platformId?: number | null;
  platformName?: string | null;

  totalAmountPoints?: number | null;

  paymentId?: number | null;
  paymentStatus?: string | null;

  meetingJoinUrl?: string | null;
};
