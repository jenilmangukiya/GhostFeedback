export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
  messages?: any;
  isAcceptingMessages?: boolean;
}
