export type loginPayloadType = {
  email: string;
  password: string;
};

export type loginResponseType = {
  accessToken: string;
  refreshToken: string;
};
export type registerPayloadType = {
  email: string;
  password: string;
  confirmPassword: string;
  otp?: string; // Nếu yêu cầu OTP
};

export type registerResponseType = {
  message: string;
  accessToken?: string; // Nếu API trả về token sau đăng ký
};
export type sendOtpPayloadType = {
  email: string;
  otp: string;
};

export type sendOtpResponseType = {
  message: string;
};