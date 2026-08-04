//返回时间差（刚刚、几分钟前、几小时前、几天前、原日期）
export default function get_time_ago(date) {
    const now = Date.now();
    const target = new Date(date).getTime();
    const diff_sec = Math.floor((now - target) / 1000);

    if (diff_sec < 60) {
        return "刚刚";
    }
    else if (diff_sec < 3600) {
        return `${Math.floor(diff_sec / 60)}分钟前`;
    }
    else if (diff_sec < 86400) {
        return `${Math.floor(diff_sec / 3600)}小时前`;
    }
    else if (diff_sec < 604800) {
        return `${Math.floor(diff_sec / 86400)}天前`;
    }
    else return date;
}