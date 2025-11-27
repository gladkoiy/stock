export enum StaticFileType {
  promotion_image = "promotion_image",
  partner_image = "partner_image",
  document = "document",
  promotion_logo = "promotion_logo",
  promotion_logo_mobile = "promotion_logo_mobile"
}

export interface StaticFileRead {
  file_type: StaticFileType | null;
  is_active: boolean;
  caption: string | null;
  promotion_id: string | null;
  order: number | null;
  file_path: string;
  filename: string | null;
}

export interface PromotionChildRead {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionRead {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  parentId: string | null;
  rules: string | null;
  couponsPlaceholder: string | null;
  promotionImages: StaticFileRead[];
  partnerImages: StaticFileRead[];
  documents: StaticFileRead[];
  children: PromotionChildRead[];
  promotionLogo: StaticFileRead | null;
  promotionLogoMobile: StaticFileRead | null;
  isParent: boolean;
  isChild: boolean;
}

export interface PromotionCreate {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isParent?: boolean;
  parentId?: string | null;
  rules?: string | null;
  couponsPlaceholder?: string | null;
}

export interface PromotionUpdate extends PromotionCreate {
  id: string;
}

export interface BearerResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type: "password";
}

export interface FileUploadRequest {
  file: File;
  promotion_id: string;
  file_type: StaticFileType;
  caption?: string;
  order?: number;
}

export interface FileUpdateRequest {
  file_id: string;
  file?: File;
  promotion_id: string;
  file_type: StaticFileType;
  caption?: string;
  order?: number;
}

export interface User {
  id: string;
  username: string;
}