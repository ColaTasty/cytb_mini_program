/**
 * APP模型
 */
const APP = getApp();
const APP_MODULE = APP.customModule;

/**
 * 获取初始值
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var GetCetInit = function(OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail == null) {
        OnFail = APP_MODULE.InitialOnFail("请重新打开页面试一试", "初始化失败");
    }
    APP_MODULE.CallApi(
        "/cet/init",
        null,
        OnSuccess,
        OnFail,
        OnComplete
    );
}

/**
 * 请求验证码
 * @param {Object} data 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var GetCetVerifyImage = function(data, OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail == null) {
        OnFail = APP_MODULE.InitialOnFail("连接服务器失败,请重试", "连接失败");
    }
    APP_MODULE.CallApi(
        "/cet/verify",
        data,
        OnSuccess,
        OnFail,
        OnComplete
    );
}

/**
 * 将Cookie存入内存
 * @param {String} data 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var SetCetCookieToStorage = function(data, OnSuccess, OnFail = null) {
    if (OnFail == null) {
        OnFail = APP_MODULE.InitialOnFail("Cookie保存失败！请务必重试！");
    }
    wx.setStorage({
        key: "cetCookie",
        data: data,
        success: OnSuccess,
        fail: OnFail
    })
}

/**
 * 查询成绩
 * @param {Object} data 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var Query = function(data, OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail == null) {
        OnFail = APP_MODULE.InitialOnFail("服务器连接失败,请重试", "查询失败");
    }
    wx.getStorage({
        key: "cetCookie",
        success: function(res) {
            var cookie = res.data;
            data.cookie = cookie;
            APP_MODULE.CallApi(
                "/cet/query",
                data,
                OnSuccess,
                OnFail,
                OnComplete
            )
        },
        fail: function() {
            wx.showModal({
                title: "失败",
                content: "Cookie读取失败！请重新打开页面查询！",
                showCancel: false,
                confirmText: "好的",
                success: function(res) {
                    if (res.confirm) {
                        var pageStack = getCurrentPages();
                        if (pageStack.length > 1) {
                            wx.navigateBack({
                                delta: 1
                            });
                        } else {
                            wx.redirectTo({
                                url: "./../index/index"
                            })
                        }
                    }
                }
            })
        }
    });
}

/**
 * 清除Cookie
 */
var CleanCetCookie = function() {
    console.log("清除Cookie");
    wx.removeStorageSync("cetCookie");
}

module.exports = {
    GetCetInit: GetCetInit,
    GetCetVerifyImage: GetCetVerifyImage,
    SetCetCookieToStorage: SetCetCookieToStorage,
    Query: Query,
    CleanCetCookie: CleanCetCookie
}