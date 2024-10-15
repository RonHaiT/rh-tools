/**
 * 
 * @param date 任意形式的日期和时间格式化为指定的格式
 * @param format 
 * @returns 
 */
// 定义枚举类型
enum DateSeparator {
    Dot = '.',
    Dash = '-',
    Slash = '/',
}
function padStart(value: string, targetLength: number, padChar: string = '0'): string {
    while (value.length < targetLength) {
        value = padChar + value;
    }
    return value;
}
// 格式化日期函数
export function formatDate(
    input: Date | string | number,
    separator: DateSeparator = DateSeparator.Dot
): string {
    let date: Date;

    // 判断输入的类型并转换为 Date 对象
    if (typeof input === 'string' || typeof input === 'number') {
        date = new Date(input);
    } else {
        date = input;
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        date = new Date(0); // 设置为计算机元年，即 1970-01-01 00:00:00
        console.log('无效的日期格式');
    }

    // 替换日期部分
    const year = date.getFullYear();
    const month = padStart((date.getMonth() + 1).toString(), 2);
    const day = padStart(date.getDate().toString(), 2);
    // 如果时间是 00:00:00，则不包含时间部分
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // 使用指定的分隔符替换
    const formattedDate = `${year}${separator}${month}${separator}${day}`;

    // 如果时间不是 00:00:00，才返回时间部分
    if (hours !== 0 || minutes !== 0 || seconds !== 0) {
        const formattedTime = `${padStart(hours.toString(), 2)}:${padStart(minutes.toString(), 2)}:${padStart(seconds.toString(), 2)}`;
        return `${formattedDate} ${formattedTime}`;
    }

    // 仅返回日期部分
    return formattedDate;
}

