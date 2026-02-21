/**
 * 验证手机号格式
 * @param phone 手机号码字符串
 * @returns 是否为有效的手机号
 */
function validPhone(phone: string): boolean {
  // 中国大陆手机号正则表达式
  // 解释：
  // 1. 以1开头
  // 2. 第二位是3-9之间的数字
  // 3. 后面跟着9位数字
  const phoneRegex = /^1[3-9]\d{9}$/

  return phoneRegex.test(phone)
}

export { validPhone }
