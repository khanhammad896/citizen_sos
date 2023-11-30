export type User = {
  token: string;
  id: number;
  first_name: string;
  last_name: string;
  cnic: string | null;
  email: string;
  is_active: string;
  super_admin: string;
  username: string | null;
  contact_number: string;
};

export type CaseStatus =
  | "accepted"
  | "dispatching"
  | "dispatched"
  | "feedback"
  | "closed"
  | "invalid"
  | null
  | "";

export type CaseSchema = {
  accepted: 0 | 1;
  accepted_time: string;
  app_read_at_device: string;
  arrival_feedback: 0 | 1;
  attachment_detail: any[];
  call_channel: string;
  caller_name: string;
  case_number: string;
  case_status: CaseStatus;
  cro_comments: string | null;
  dispatch_by: string;
  dispatched_time: string;
  dispatching_time: string;
  district: string;
  feedback_data: any[];
  feedback_time: string;
  final_feedback: 0 | 1;
  first_arrival_time: string;
  first_dispatch_time: string;
  lead_id: number;
  level1_case_nature: string | null;
  level2_case_nature: string | null;
  level3_case_nature: string | null;
  near_by_location: string;
  phone_number: string;
  police_circle: string | null;
  police_station: string | null;
  queue: string;
  read: 0 | 1;
  received: 0 | 1;
  source: string;
  time_id: string;
};
