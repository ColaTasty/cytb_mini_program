/**
 * 开发者服务器地址
 */
const host = "https://makia.dgcytb.com";
/**
 * 默认失败方法
 * @param {String} msg 
 * @param {String} title 
 */
const InitialOnFail = function(msg = "操作失败", title = "失败") {
    return function(res) {
        console.log(res);
        wx.showModal({
            title: title,
            content: msg,
            showCancel: false
        })
    };
}

/**
 * @param  {string} url
 * @param  {Object} data = null
 * @param  {Function} OnSuccess
 * @param  {Function} OnFail = null
 * @param  {Function} OnComplete = null
 */
var CallApi = function(url, data = null, OnSuccess, OnFail = null, OnComplete = null, header = null) {
    header["content-type"] = "application/x-www-form-urlencoded";
    if (OnFail === null)
        OnFail = InitialOnFail("网络连接失败", "请检查网络连接后重试");
    wx.request({
        url: host + url,
        data: data,
        header: header,
        method: "POST",
        success: OnSuccess,
        fail: OnFail,
        complete: OnComplete
    })
}

/**
 * 获取小程序主页功能
 */
var HomePageFeatures = function() {
    // 调用api获取功能
    // do something
    var featruesList = [{
        "title": "四六级查询",
        "name": "CET4/6",
        "url": "./../cet/cet",
        "bgColor": "bg-gradual-blue",
        "icon": "search"
    }, {
        "title": "我的课表",
        "name": "schedule",
        "url": "./../index/index",
        "bgColor": "bg-gradual-red",
        "icon": "calendar"
    }, {
        "title": "吃什么",
        "name": "lunch/dinner",
        "url": "./../index/index",
        "bgColor": "bg-gradual-green",
        "icon": "shopfill"
    }, {
        "title": "畅谈广场",
        "name": "Let's talk",
        "url": "./../index/index",
        "bgColor": "bg-gradual-pink",
        "icon": "communityfill"
    }, {
        "title": "投票器",
        "name": "Vote",
        "url": "./../index/index",
        "bgColor": "bg-gradual-purple",
        "icon": "post"
    }];
    return featruesList;
}

/**
 * 获取用户信息授权
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var AuthUserInfo = function(OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail === null)
        OnFail = InitialOnFail("获取用户信息失败！");
    wx.authorize({
        scope: 'scope.userInfo',
        success: OnSuccess,
        fail: OnFail,
        complete: OnComplete
    })
}

/**
 * 从服务器获取用户信息
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var GetUserInfoFromServer = function(OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail === null) {
        OnFail = InitialOnFail("连接服务器失败，请稍后重试", "网络出错");
    }
}
module.exports = {
    CallApi: CallApi,
    HomePageFeatures: HomePageFeatures,
    AuthUserInfo: AuthUserInfo
}