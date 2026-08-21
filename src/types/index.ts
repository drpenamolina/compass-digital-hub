export type UserRole = "resident" | "reviewer" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  pgyYear: 1 | 2 | 3;
  role: UserRole;
}

export type TransitionType =
  | "Travel Documentation"
  | "Visa/J-1 Renewal"
  | "Licensure Step"
  | "Fellowship Eligibility"
  | "Waiver Planning"
  | "Post-Residency Employment";

export type DeadlineType = "fixed_date" | "relative_to_pgy_milestone" | "relative_to_program_end";

export type ContentStatus = "draft" | "published" | "expired";

export interface MatrixItem {
  id: string;
  transitionType: TransitionType;
  title: string;
  description: string;
  triggerCondition: string;
  deadlineType: DeadlineType;
  actionRequired: string;
  responsibleContactId: string | null;
  authoritativeSourceLink: string;
  lastReviewedDate: string;
  nextReviewDue: string;
  reviewerName: string;
  status: ContentStatus;
  pgyYears: Array<1 | 2 | 3>;
  residentSelfTrack: Record<string, boolean>;
}

export type ResourceCategory =
  | "TPL / International Office"
  | "GME resources"
  | "J-1 / IMG institutional resources"
  | "Mental health & EAP"
  | "Legal aid / referral resources"
  | "Emergency & after-hours contacts"
  | "Financial & practical resources";

export interface ResourceEntry {
  id: string;
  category: ResourceCategory;
  name: string;
  roleOrOffice: string;
  contactMethods: string;
  whatTheyHelpWith: string;
  hours: string;
  lastReviewedDate: string;
  nextReviewDue: string;
  reviewerName: string;
  status: ContentStatus;
}

export type NavigateCategory = "Monthly resource" | "Session material" | "Bridge to Intake";

export interface NavigateItem {
  id: string;
  category: NavigateCategory;
  title: string;
  description: string;
  linkUrl: string;
  lastReviewedDate: string;
  nextReviewDue: string;
  reviewerName: string;
  status: ContentStatus;
}

export interface CopeSession {
  id: string;
  sessionNumber: number;
  sessionDate: string;
  title: string;
  description: string;
  status: "draft" | "published";
}

export interface BelongEvent {
  id: string;
  title: string;
  country: string;
  eventDate: string;
  description: string;
  photoUrl: string;
  status: "draft" | "published";
}

export interface CopeInstrumentLinks {
  aaqUrl: string;
  resilienceScaleUrl: string;
  selfCompassionScaleUrl: string;
  perceivedStressScaleUrl: string;
}
