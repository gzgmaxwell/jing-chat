/*
  常量
*/

// 登录类型 0 账密登录 1 验证码 2 支付宝登录
enum LoginType {
  USENAME_PASSWORD = 0,
  CODE = 1,
  ALIPAY = 2,
}

// 相应code码
enum ResCode {
  SUCCESS = '200',
}

// 路由url
enum PageUrl {
  INDEX_URL = '/',
  LOGIN_URL = '/login',
  REGISTER_URL = '/register',
  CODELOGIN_URL = '/codeLogin',
  RESETPWD = '/resetpwd',
}

export { LoginType, ResCode, PageUrl }
