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
 * 获取默认课表
 */
var GetDefaultScheduleList = function() {
    var item = {
        start: 0,
        end: 0,
        class: {
            name: "",
                teacher: "",
                room: ""
        }
    };

    var callBack = [];

    var weekDays = GetWeekDays();

    for (var dayIdx = 0; dayIdx < weekDays.length; dayIdx++) {
        var day = {
            day: weekDays[dayIdx]
        };
        var timeList = [];
        for (var itemIdx = 0; itemIdx < 10; itemIdx++) {
            timeList[itemIdx] = item;
        }
        day.timeList = timeList;
        callBack.push(day);
    }

    return callBack;
};

module.exports = {
    GetDefaultScheduleList: GetDefaultScheduleList
}