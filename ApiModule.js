/**
 * 开发者服务器地址
 */
const host = "https://makia.dgcytb.com/wxapp";
/**
 * 默认失败方法
 * @param {String} msg 
 * @param {String} title 
 */
const InitialOnFail = function(msg = "操作失败", title = "失败") {
    return function(res) {
        console.error({ title: title, msg: msg });
        wx.showModal({
            title: title,
            content: msg,
            showCancel: false
        })
    };
}

/**
 * 向服务器发送请求
 * @param  {string} url
 * @param  {Object} data = null
 * @param  {Function} OnSuccess
 * @param  {Function} OnFail = null
 * @param  {Function} OnComplete = null
 */
var CallApi = function(url, data = null, OnSuccess, OnFail = null, OnComplete = null) {
    var header = {
        "content-type": "application/x-www-form-urlencoded"
    };
    if (OnFail === null)
        OnFail = InitialOnFail("网络连接失败", "请检查网络连接后重试");
    console.log("Call API : " + host + url);
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
 * 获取测试用的主页列表
 */
var GetTestHomeFeatures = function() {
    return [{
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
}

/**
 * 获取小程序主页功能
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var HomePageFeatures = function(OnSuccess, OnFail = null) {
    // 调用api获取功能
    // do something
    if (OnFail == null) {
        OnFail = InitialOnFail("主页功能获取失败,请重启小程序重试");
    }
    CallApi(
        "/home-page-features",
        null,
        OnSuccess,
        OnFail
    );
}

/**
 * 更新小程序
 */
var UpdateProgram = function() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log("是否有更新 : " + res.hasUpdate);
    })

    updateManager.onUpdateReady(function() {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: res => {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                }
            }
        });
    })

    updateManager.onUpdateFailed(function() {
        // 新版本下载失败
    })
}

/**
 * 检查用户是否用过小程序,
 * true : 检查用户登录状态,
 * false : 用户登录
 */
var CheckUserHaveUsed = function() {
    var openid = wx.getStorageSync("openid");
    return typeof(openid) !== "undefined" || openid.length > 0;
}

/**
 * 检查用户登录状态
 * @param {Function} AfterLogin 
 */
var CheckUserLoginStatus = function(AfterLogin = null) {
    wx.showLoading({
        title: "正在检查登录",
        mask: true,
        // 正在检查登录
        success: function() {
            wx.checkSession({
                success: function() {
                    console.log("用户已登录");
                },
                fail: function() {
                    console.log("用户登录态失效，将重新登录");
                    // 进行用户登录
                    UserLogin(AfterLogin);
                },
                complete: function() {
                    wx.hideLoading();
                }
            })
        }
    });
}

/**
 * 用户登录小程序
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} AfterLogin
 */
var UserLogin = function(AfterLogin = null) {
    wx.showLoading({
        title: "正在登录",
        mask: true,
        // 正在登录
        success: function() {
            wx.login({
                success: function(res) {
                    // if res.code
                    if (res.code) {
                        // 发送请求
                        CallApi(
                            "/login/" + res.code,
                            null,
                            // 发送请求成功
                            function(res) {
                                if (!res.data.isOK) {
                                    console.error("用户登录失败[res : " + res.data + "]");
                                    return;
                                } else {
                                    console.log("用户登录成功[openid : " + res.data.openId + "]");
                                    wx.setStorage({
                                        key: "openId",
                                        data: res.data.openId,
                                        success: AfterLogin
                                    });
                                }
                            },
                            // 发送请求失败
                            InitialOnFail("网络连接出错，请手动重启小程序", "用户登录失败"),
                        );
                    } else {
                        console.error("登录码获取失败");
                        wx.showModal({
                            title: "用户登录失败",
                            content: "为了不影响你的使用，请手动重启小程序",
                            showCancel: false,
                            confirmText: "好的"
                        })
                    }
                },
                complete: function() {
                    wx.hideLoading();
                }
            })
        }
    })
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
    // 登录
    UserLogin: UserLogin,
    CheckUserHaveUsed: CheckUserHaveUsed,
    CheckUserLoginStatus: CheckUserLoginStatus,
    // 更新
    UpdateProgram: UpdateProgram,
    // 用户信息
    AuthUserInfo: AuthUserInfo,
    GetUserInfoFromServer: GetUserInfoFromServer
}