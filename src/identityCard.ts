/**  身份证校验工具 */
/**
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：地区码
 * yymmdd: 出生年月日
 * xx: 顺序类编码，无法确定
 * p: 性别，奇数为男，偶数为女
 * <p />
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：地区码
 * yyyymmdd: 出生年月日
 * xxx:顺序类编码，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 * <p />
 * 18位号码加权因子为(从右到左) wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,1 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 校验位计算公式：Y_P = mod( ∑(Ai×wi),11 )
 * i为身份证号码从右往左数的 2...18 位; Y_P为校验码所在校验码数组位置
 *
 */
// 加权因子
const wi: number[] = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
// 身份证验证位值.10代表X
const valideCodeArr: number[] = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]
// 区域ID
const areaMap: {
    [key: number]: string
} = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
}
// 错误信息
// const status = new Array("true", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!")

/**
 * 校验身份证是否合法
 * @param {*} idCard  身份证号码
 */
export function checkIdCard(idCard: string): boolean {
    // 去掉首尾空格
    idCard = trim(idCard.replace(/ /g, ''))
    if (idCard.length === 15 || idCard.length === 18) {
        if (!checkArea(idCard)) {
            return false
        } else if (!checkBrith(idCard)) {
            return false
        } else if (idCard.length === 18 && !check18Code(idCard)) {
            return false
        } else {
            return true
        }
    } else {
        // 不是15或者18，位数不对
        return false
    }
}

/**
 * 从身份证中解析出区域信息
 * @param {*} idCard
 */
export function getArea(idCard: string): string | undefined {
    return areaMap[parseInt(idCard.slice(0, 2))]
}

/**
 * 从身份证中解析出性别信息
 * @param {*} idCard
 */
export function getSex(idCard: string): number {
    if (idCard.length === 15) {
        return parseInt(idCard.substring(14, 15)) % 2 === 0 ? 2 : 1;
    } else {
        return parseInt(idCard.substring(14, 17)) % 2 === 0 ? 2 : 1;
    }
}

/**
 * 从身份证中解析出生日
 * @param {*} idCard "yyyy-mm-dd"
 */
export function getBirthday(idCard: string): string {
    let birthdayStr: string = ''
    if (idCard.length === 15) {
        birthdayStr = idCard.substring(6, 8);
        if (parseInt(birthdayStr) < 10) {
            birthdayStr = '20' + birthdayStr
        } else {
            birthdayStr = '19' + birthdayStr
        }
        birthdayStr = `${birthdayStr}-${idCard.substring(8, 10)}-${idCard.substring(10, 12)}`;
    } else if (idCard.length === 18) {
        birthdayStr = `${idCard.substring(6, 10)}-${idCard.substring(10, 12)}-${idCard.substring(12, 14)}`;
    }
    return birthdayStr
}

// 去掉字符串头尾空格
function trim(str: string): string {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 验证身份证的地区码
 * @param {Object} idCard 身份证字符串
 */
function checkArea(idCard: string): boolean {
    return areaMap[parseInt(idCard.slice(0, 2))] != null;
}

/**
 * 验证身份证号码中的生日是否是有效生日
 * @param idCard 身份证字符串
 * @return
 */
function checkBrith(idCard: string): boolean {
    var result = true
    if (idCard.length === 15) {
        const year = parseInt(idCard.substring(6, 8));
        const month = parseInt(idCard.substring(8, 10));
        const day = parseInt(idCard.substring(10, 12));
        const tempDate = new Date(year, month - 1, day);
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getFullYear()方法
        if (tempDate.getFullYear() !== year || tempDate.getMonth() !== month - 1 || tempDate.getDate() !== day) {
            result = false;
        }
    } else if (idCard.length === 18) {
        const year = parseInt(idCard.substring(6, 10));
        const month = parseInt(idCard.substring(10, 12));
        const day = parseInt(idCard.substring(12, 14));
        const tempDate = new Date(year, month - 1, day);
        if (tempDate.getFullYear() !== year || tempDate.getMonth() !== month - 1 || tempDate.getDate() !== day) {
            result = false;
        }
    } else {
        result = false
    }
    return result
}

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param idCardArr 身份证号码数组
 * @return
 */
function check18Code(idCardStr: string): boolean {
    const idCardArr = idCardStr.split('').map(Number);
    var sum = 0 // 声明加权求和变量
    if (String(idCardArr[17]).toLowerCase() === 'x') {
        idCardArr[17] = 10;
    }
    for (var i = 0; i < 17; i++) {
        sum += wi[i] * idCardArr[i]// 加权求和
    }
    var valCodePosition = sum % 11// 得到验证码所位置
    return Number(idCardArr[17]) === valideCodeArr[valCodePosition];
}
