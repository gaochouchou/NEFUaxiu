// 数据库可视化日期用
// 格式化日期时间yyyy/mm/dd hh:mm:ss
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 统计用(统计图横坐标轴-显示近五天)：
// 返回值1：用户很坐标轴显示（中文）
// 返回值2：用于查询统计用
function formatPastWeekDate(date){
    var oneDay = 1000*60*60*24
    
    var datepast1 = new Date(date-oneDay)
    var datepast2 = new Date(date-oneDay*2)
    var datepast3 = new Date(date-oneDay*3)
    var datepast4 = new Date(date-oneDay*4)
    
    var PastlistZh = [
        datepast4.getMonth()+1+'月'+datepast4.getDate()+'日',
        datepast3.getDate()+'日',
        datepast2.getDate()+'日',
        datepast1.getDate()+'日',
        date.getDate()+'日'
    ]
    var Pastlist=[
        ([datepast4.getMonth()+1]).map(formatNumber).join('')+'/'+([datepast4.getDate()]).map(formatNumber).join(''),
        ([datepast3.getMonth()+1]).map(formatNumber).join('')+'/'+([datepast3.getDate()]).map(formatNumber).join(''),
        ([datepast2.getMonth()+1]).map(formatNumber).join('')+'/'+([datepast2.getDate()]).map(formatNumber).join(''),
        ([datepast1.getMonth()+1]).map(formatNumber).join('')+'/'+([datepast1.getDate()]).map(formatNumber).join(''),
        ([date.getMonth()+1]).map(formatNumber).join('')+'/'+([date.getDate()]).map(formatNumber).join(''),
    ]
    
    return {PastlistZh,Pastlist}
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime: formatTime,
    formatPastWeekDate: formatPastWeekDate
}