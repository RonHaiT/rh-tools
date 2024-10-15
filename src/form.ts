/**
 * 
 * @param email 
 * 验证邮箱地址
 * @returns 返回true flase
 */
export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * @param  phone
 * 验证手机号码
 * @returns 返回true flase 
 */
export function validatePhoneNumber(phone: string): boolean {
    const regex = /^1[3-9]\d{9}$/; // 验证 1开头的11位手机号
    return regex.test(phone);
}