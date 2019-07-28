/**
 * 获取星期
 */
var GetWeekDays = function() {
    return [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五"
    ]
};

/**
 * 获取时间节点
 */
var GetTimeNode = function() {
    return {
        start: 0,
        end: 0,
        atWeeks: [],
        class: {
            name: "",
                teacher: "",
                room: ""
        }
    };
}

/**
 * 获取默认课表
 */
var GetDefaultScheduleList = function() {

    var callBack = [];

    var weekDays = GetWeekDays();

    for (var dayIdx = 0; dayIdx < weekDays.length; dayIdx++) {
        var day = {
            day: weekDays[dayIdx]
        };
        var timeList = [];
        day.timeList = timeList;
        callBack.push(day);
    }

    return callBack;
};

module.exports = {
    GetDefaultScheduleList: GetDefaultScheduleList,
    GetTimeNode: GetTimeNode
}