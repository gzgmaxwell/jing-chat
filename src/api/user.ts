import request from '@/utils/request'

export interface LoginData {
  phoneNum: string // 手机号
  code?: string // 验证码
  vsCode?: string // 图形验证码
  password?: string // 密码
  // phoneAreaPrefix?: string
  deviceModel:string
  invitationCode?:string
}

export interface LoginRes {
  token: string
}

export interface UpdateUserInfo {
  header?: string
  nickName?: string
  emailAddress?: string
}

export interface LogoutRes {
  code: string
  msg: string
  data: any
}

/* 废弃 */
export interface UserState {
  onlyCode?: string
  tencentSig?: string
  token?: string
}

export interface CodeData {
  phoneNum: string
  vsCode: string
}
export interface CodeEmailData {
  emailAddress: string

}
export interface CodeEmailBind {
  emailCode: string
  emailAddress: string

}
export interface ChangePwdData {
  phoneNum: string
  authCode: string
  newPassword: string
}

export interface ChangeZfPwdData {
  phone: string
  code: string
  oldPayPassword: string
  payPassword: string
}
export interface Res {
  code: string
  msg: string
  data: any
}

export interface RegisterData {
  phone: string
  code: string
  zfmm: string
  userPassword: string
  deviceModel:string
  invitationCode?:string
}
/* otc项目 */
// 登录
export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/auth/user/login', data)
}

// 获取当前用户信息
export function getCurUserInfo(): Promise<Res> {
  return request('/sellCoins/statisticalAnalysis')
}

// 修改用户信息
export function updateUserInfo(data: UpdateUserInfo): Promise<any> {
  return request.post('/user/updateUserInfo', data)
}

// 退出登录
export function otclogout(): Promise<LogoutRes> {
  return request.get('/auth/logout')
}

// 图形验证码
export function getCaptcha(): Promise<any> {
  return request.get('code/getVerificationCode', {
    responseType: 'blob', // 重要：指定响应类型为 blob
  })
}

// 注册
export function register(data: RegisterData): Promise<any> {
  return request.post('/user/zczh', data)
}

// 手机验证码
export function getPhoneCode(data: CodeData): Promise<any> {
  const { phoneNum, vsCode } = data
  return request.get(`/code/phoneSms?phoneNum=${phoneNum}&vsCode=${vsCode}`)
}
// 邮箱验证码
export function getEmailCodeReq(data: CodeEmailData): Promise<any> {
  const { emailAddress } = data
  return request.get(`/code/sendMailVscode?emailAddress=${emailAddress}`)
}
// 绑定邮箱
export function getEmailBind(data: CodeEmailBind): Promise<Res> {
  return request.post('/user/bindEmail', data)
}
// 修改密码
export function changePwd(data: ChangePwdData): Promise<Res> {
  return request.post('/user/forgetPwd', data)
}
// 设备编号
export function getDevice(): Promise<any> {
  return request.get('/loginDevice/all')
}
/* 废弃 */
export function logout() {
  return request.post('/user/logout')
}

/* export function getUserInfo() {
  return request<UserState>('/user/me')
}
 */
export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function resetPassword(): Promise<any> {
  return request.post('/user/reset-password')
}
// 修改z支付密码
export function changeZfPwd(data: ChangeZfPwdData): Promise<Res> {
  return request.post('/userPayModify/updateZfmm', data)
}