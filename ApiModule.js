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
 * 检查主页功能是否进入缓存
 * @param {*} OnStill 
 * @param {*} HaveClear 
 */
var CheckHomePageFeaturesCache = function(OnStill, HaveClear) {
    var featuresList = wx.getStorageSync("homePageFeaturesList");
    if (typeof(featuresList) === "object") {
        var timestamps = (new Date()).getTime();
        if (timestamps < featuresList.expire) {
            console.log("从缓存中获取主页列表")
            OnStill({ list: featuresList.list });
        } else {
            console.log("缓存中主页列表过期，将从服务器获取列表");
            HaveClear();
        }
    } else {
        console.log("不存在主页列表缓存，将从服务器获取列表");
        HaveClear();
    }
}

/**
 * 主页功能进入缓存
 * @param {Array} list 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var SetHomePageFeaturesCache = function(data, OnSuccess, OnFail = null) {
    if (OnFail == null) {
        OnFail = function() {
            console.log("主页列表缓存失败");
            var f = InitialOnFail("主页列表缓存失败,不影响使用");
            f();
        };
    }
    wx.setStorage({
        key: "homePageFeaturesList",
        data: data,
        success: OnSuccess,
        fail: OnFail
    });
}

/**
 * 获取小程序主页功能
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var GetHomePageFeatures = function(OnSuccess, OnFail = null) {
    // 调用api获取功能
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

    wx.showLoading({
        title: "正在检查更新"
    });

    updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log("是否有更新 : " + res.hasUpdate);
        wx.hideLoading();
        if (res.hasUpdate) {

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
                    if (AfterLogin != null)
                        AfterLogin();
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
                    // 登录成功
                    if (res.code) {
                        // 发送请求
                        CallApi(
                            "/login/" + res.code,
                            null,
                            // 请求成功
                            function(res) {
                                if (!res.data.isOK) {
                                    console.error("用户登录失败[res : ");
                                    console.error(res.data);
                                    console.error("]");
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
                            // 请求失败
                            InitialOnFail("网络连接出错，请手动重启小程序", "用户登录失败"),
                        );
                    }
                    // 登录失败
                    else {
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
 * 请求用户信息授权
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var AuthUserInfo = function(OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail === null) {
        OnFail = function() {
            // 跳转至主页的个人信息页授权
            wx.showModal({
                title: "请求授权",
                content: "这个功能需要你登录小程序^_^",
                showCancel: false,
                confirmText: "好",
                success: function(e) {
                    if (e.confirm) {
                        var index_path = GetIndexPagePath();
                        console.log("跳转 : " + index_path + "?redirect=profile");
                        wx.navigateTo({
                            url: index_path + "?redirect=profile"
                        });
                    }
                }
            })
        };
    }
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

/**
 * 获取主页的路径
 */
var GetIndexPagePath = function() {
    var pageStack = getCurrentPages();

    var currentPage = pageStack.pop();

    var currentPath = currentPage.route.toString();

    var pathStack = currentPath.split("/");

    var pathLength = pathStack.length;

    var indexPath = "pages/index/index";

    var idx = 0;

    while (idx < (pathLength - 1)) {
        indexPath = "../" + indexPath;
        idx++;
        if (idx >= (pathLength - 1)) {
            console.log("return : " + indexPath);
            return indexPath;
        }
    }
}

/**
 * 进入小程序的操作进行全局配置
 * @param {Object} data 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var SetStatmentsToStorage = function(data, OnSuccess = null, OnFail = null) {

    if (OnFail == null) {
        OnFail = InitialOnFail("记录操作失败！功能受限，请退出小程序重试");
    }

    wx.setStorage({
        key: "statmentsConfig",
        data: data,
        success: function() {
            console.log("记录操作成功！");
            OnSuccess();
        },
        fail: OnFail
    })
}

/**
 * 读取进入小程序的操作
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var GetStatmentsFromStorage = function(OnSuccess, OnFail = null) {

    if (OnFail == null) {
        OnFail = InitialOnFail("读取操作失败！功能受限");
    }

    wx.getStorage({
        key: "statmentsConfig",
        success: function(res) {
            console.log("读取操作成功！");
            OnSuccess(res);
        },
        fail: OnFail
    });
}

/**
 * 清除登入操作
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var ClearStatments = function(OnSuccess = null, OnFail = null) {

    if (OnFail == null) {
        OnFail = InitialOnFail("清除登入操作失败,不影响使用^_^");
    }

    wx.removeStorage({
        key: "statmentsConfig",
        success: function() {
            console.log("清除登入操作");
            if (typeof(OnSuccess) == "function") {
                OnSuccess();
            }
        },
        fail: OnFail
    })
}

/**
 * 获取openId
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var GetOpenId = function(OnSuccess, OnFail = null) {
    wx.getStorage({
        key: "openId",
        success: OnSuccess,
        fail: function() {
            if (OnFail == null) {
                var f = InitialOnFail("openId从缓存获取失败，功能受限，请重启小程序");
                f();
            }
        }
    })
}

/**
 * 解析用户信息
 * @param {Object} user_info 
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var VerifyUserInfo = function(user_info, OnSuccess, OnFail = null, OnComplete = null) {
    var rawData = "";
    var signature = "";
    var openId = "";
    var err_function = InitialOnFail("传入参数有误，用户信息解析失败");
    if (typeof(user_info.rawData) == "undefined") {
        err_function();
        console.log("传入参数 : ");
        console.log(user_info);
        return;
    }
    if (typeof(user_info.signature) == "undefined") {
        err_function();
        console.log("传入参数 : ");
        console.log(user_info);
        return;
    }
    if (OnFail == null) {
        OnFail = InitialOnFail("用户信息解析请求失败,请等待服务器修复");
    }
    rawData = user_info.rawData;
    signature = user_info.signature;
    // 获取openId
    GetOpenId(
        function(res) {
            openId = res.data;
            // 刷新用户登录态
            UserLogin(
                // 发送解析用户信息请求
                function() {
                    CallApi(
                        "/verify-user-info", {
                            rawData: rawData,
                            signature: signature,
                            openId: openId
                        },
                        OnSuccess,
                        OnFail,
                        OnComplete
                    );
                }
            );
        }
    )
}

module.exports = {
    CallApi: CallApi,
    CheckHomePageFeaturesCache: CheckHomePageFeaturesCache,
    SetHomePageFeaturesCache: SetHomePageFeaturesCache,
    GetHomePageFeatures: GetHomePageFeatures,
    InitialOnFail: InitialOnFail,
    GetIndexPagePath: GetIndexPagePath,
    SetStatmentsToStorage: SetStatmentsToStorage,
    GetStatmentsFromStorage: GetStatmentsFromStorage,
    ClearStatments: ClearStatments,
    GetOpenId: GetOpenId,
    // 登录
    UserLogin: UserLogin,
    CheckUserHaveUsed: CheckUserHaveUsed,
    CheckUserLoginStatus: CheckUserLoginStatus,
    // 更新
    UpdateProgram: UpdateProgram,
    // 用户信息
    AuthUserInfo: AuthUserInfo,
    VerifyUserInfo: VerifyUserInfo
}