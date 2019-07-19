/**
 * 从主页跳转至
 * @param {String} direction 
 * @param {Object} _self 主页Page对象
 */
var RedirectTo = function(direction, _self) {
    switch (direction) {
        // 默认情况
        default: break;
        // 临时跳转到主页
        case "profile":
                case "home":
                case "messages":
                var showRedDot = _self.data.showRedDot;
            showRedDot = {
                profile: direction == "profile",
                home: direction == "home",
                messages: direction == "messages"
            }
            _self.setData({
                pageName: direction,
                needBack: true,
                showRedDot: showRedDot
            });
            break;
    }
}

module.exports = {
    RedirectTo: RedirectTo
}