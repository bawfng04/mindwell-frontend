import { buildUrl, httpJson } from "./http";
import { withAuth } from "./authHeader";
import type {
  AppointmentCheckoutDto,
  AppointmentConfirmationDto,
  AuthResponseDto,
  AvailabilitySlotDto,
  CheckoutOptionsDto,
  CreateAppointmentDraftRequestDto,
  CreateAppointmentResponseDto,
  ExpertDetailDto,
  ExpertFilterOptionsDto,
  InitiateAppointmentPaymentRequestDto,
  InitiateAppointmentPaymentResponseDto,
  LoginRequestDto,
  MeDto,
  MyAppointmentItemDto,
  PageResponse,
  ExpertCardDto,
  RegisterRequestDto,
} from "../types/api";

export const api = {
  auth: {
    register(body: RegisterRequestDto, opts?: { signal?: AbortSignal }) {
      return httpJson<AuthResponseDto>(buildUrl("/api/v1/auth/register"), {
        method: "POST",
        body: JSON.stringify(body),
        signal: opts?.signal,
        headers: { "Content-Type": "application/json" },
      });
    },
    login(body: LoginRequestDto, opts?: { signal?: AbortSignal }) {
      return httpJson<AuthResponseDto>(buildUrl("/api/v1/auth/login"), {
        method: "POST",
        body: JSON.stringify(body),
        signal: opts?.signal,
        headers: { "Content-Type": "application/json" },
      });
    },
  },

  users: {
    me(opts?: { signal?: AbortSignal }) {
      return httpJson<MeDto>(buildUrl("/api/v1/users/me"), {
        method: "GET",
        signal: opts?.signal,
        headers: withAuth(),
      });
    },
  },

  experts: {
    listExperts(
      query?: {
        q?: string;
        specializationIds?: number[];
        languageCodes?: string[];
        gender?: string; // female|male|other
        verified?: boolean;
        minRate?: number;
        maxRate?: number;
        availableFrom?: string; // ISO
        availableTo?: string; // ISO
        page?: number;
        size?: number;
        sort?: string[]; // "avgRating,desc"
      },
      opts?: { signal?: AbortSignal }
    ) {
      return httpJson<PageResponse<ExpertCardDto>>(
        buildUrl("/api/v1/experts", query),
        {
          method: "GET",
          signal: opts?.signal,
        }
      );
    },

    getExpertDetail(expertId: number, opts?: { signal?: AbortSignal }) {
      return httpJson<ExpertDetailDto>(
        buildUrl(`/api/v1/experts/${expertId}`),
        {
          method: "GET",
          signal: opts?.signal,
        }
      );
    },

    getAvailability(
      expertId: number,
      query?: { from?: string; to?: string },
      opts?: { signal?: AbortSignal }
    ) {
      return httpJson<AvailabilitySlotDto[]>(
        buildUrl(`/api/v1/experts/${expertId}/availability`, query),
        { method: "GET", signal: opts?.signal }
      );
    },

    getFilterOptions(opts?: { signal?: AbortSignal }) {
      return httpJson<ExpertFilterOptionsDto>(
        buildUrl("/api/v1/experts/filters"),
        {
          method: "GET",
          signal: opts?.signal,
        }
      );
    },

    bookAppointment(
      expertId: number,
      body: CreateAppointmentDraftRequestDto,
      opts?: { signal?: AbortSignal }
    ) {
      return httpJson<CreateAppointmentResponseDto>(
        buildUrl(`/api/v1/experts/${expertId}/appointments`),
        {
          method: "POST",
          body: JSON.stringify(body),
          signal: opts?.signal,
          headers: withAuth({ "Content-Type": "application/json" }),
        }
      );
    },
  },

  checkout: {
    getOptions(opts?: { signal?: AbortSignal }) {
      return httpJson<CheckoutOptionsDto>(
        buildUrl("/api/v1/checkout/options"),
        {
          method: "GET",
          signal: opts?.signal,
        }
      );
    },

    getAppointmentCheckout(apptId: number, opts?: { signal?: AbortSignal }) {
      return httpJson<AppointmentCheckoutDto>(
        buildUrl(`/api/v1/checkout/appointments/${apptId}/checkout`),
        { method: "GET", signal: opts?.signal, headers: withAuth() }
      );
    },

    confirmation(apptId: number, opts?: { signal?: AbortSignal }) {
      return httpJson<AppointmentConfirmationDto>(
        buildUrl(`/api/v1/checkout/appointments/${apptId}/confirmation`),
        { method: "GET", signal: opts?.signal, headers: withAuth() }
      );
    },

    payAppointment(
      apptId: number,
      body: InitiateAppointmentPaymentRequestDto,
      opts?: { signal?: AbortSignal }
    ) {
      return httpJson<InitiateAppointmentPaymentResponseDto>(
        buildUrl(`/api/v1/checkout/appointments/${apptId}/payments`),
        {
          method: "POST",
          body: JSON.stringify(body),
          signal: opts?.signal,
          headers: withAuth({ "Content-Type": "application/json" }),
        }
      );
    },
  },

  appointments: {
    myAppointments(opts?: { signal?: AbortSignal }) {
      return httpJson<MyAppointmentItemDto[]>(
        buildUrl("/api/v1/appointments/my"),
        {
          method: "GET",
          signal: opts?.signal,
          headers: withAuth(),
        }
      );
    },
    myDraftAppointments(opts?: { signal?: AbortSignal }) {
      return httpJson<MyAppointmentItemDto[]>(
        buildUrl("/api/v1/appointments/my/drafts"),
        { method: "GET", signal: opts?.signal, headers: withAuth() }
      );
    },
  },

  payments: {
    mockRedirect(paymentId: number) {
      // Dev-only endpoint: opens redirect URL
      return buildUrl(`/api/v1/payments/${paymentId}/mock/redirect`);
    },
  },
};
