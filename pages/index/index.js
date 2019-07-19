var edusystem = require("../../utils/Edusystem.js");

//index.js
//获取应用实例
const APP = getApp();
const APP_MODULE = APP.customModule;
const INDEX_MODULE = require("indexModule.js");

Page({
    data: {
        pageName: "home",
        showRedDot: {
            home: false,
            messages: false,
            profile: false
        },
        needBack: false,
        featuresList: [],
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: undefined
    },

    onLoad: function(options) {
        // wx.hideLoading 在生命周期函数 : onReady内
        wx.showLoading({
            title: "正在加载页面",
            mask: true
        })
        var _self = this;
        // 检查跳转
        console.log("options.redirect = " + (typeof(options.redirect) == "undefined" ? null : options.redirect));
        if (typeof(options.redirect) !== "undefined") {
            var direction = options.redirect;
            var navigateTo = function(url) {
                wx.navigateTo({
                    url: url,
                });
            };
            // 检查操作
            console.log("options.statment = " + (typeof(options.statment) == "undefined" ? null : options.statment));
            // 有操作传入
            if (typeof(options.statment) !== "undefined") {
                var statmentConfig = options;
                // 将操作配置全局，存入缓存
                APP_MODULE.SetStatmentsToStorage(
                    statmentConfig,
                    function() {
                        INDEX_MODULE.RedirectTo(direction, _self);
                    }
                );
            }
            // 无操作传入
            else {
                INDEX_MODULE.RedirectTo(direction, _self);
            }
            return;
        }
        // 获取主页功能列表
        APP.customModule.CheckHomePageFeaturesCache(
            // 在缓存中获取列表
            function(res) {
                _self.setData({
                    featuresList: res.list
                })
            },
            // 当缓存中列表不存在或者过期
            function() {
                // 向服务器获取列表
                APP.customModule.GetHomePageFeatures(
                    // 请求成功
                    function(res) {
                        // 获取成功
                        if (res.data.isOK) {
                            _self.setData({
                                featuresList: res.data.list
                            })
                            APP.customModule.SetHomePageFeaturesCache({
                                list: res.data.list,
                                expire: res.data.expire
                            })
                        }
                        // 获取失败
                        else {
                            wx.showModal({
                                title: "获取失败",
                                content: "服务被管理员关了T^T"
                            })
                        }
                    }
                );
                // 向服务器获取列表end
            }
        );
        // 获取主页功能列表end
        // 获取用户信息
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo;
                _self.setData({
                    userInfo: userInfo
                })
            }
        })
    },

    onShow: function() {

    },

    onReady: function() {
        wx.hideLoading();
    },

    onShareAppMessage: function(options) {},

    TabChange: function(e) {
        var _self = this;
        var cur = e.currentTarget.dataset.cur;
        // 若是临时跳转主页
        if (_self.data.needBack) {
            switch (_self.data.pageName) {
                case "profile":
                    // 个人信息页
                    wx.showModal({
                        title: "请授权登录",
                        content: "请在此页登录小程序，授权登录后左上角返回^_^",
                        cancelText: "我不要",
                        confirmText: "好的",
                        success: function(e) {
                            if (e.cancel) {
                                wx.showModal({
                                    title: "请三思",
                                    content: "授权登录之后能享受更多服务！",
                                    confirmText: "好吧",
                                    confirmColor: "red",
                                    cancelText: "再考虑",
                                    cancelColor: "#bbb"
                                })
                            }
                        }
                    });
                    break;
                default:
                    // 默认情况
                    break;
            }
            return;
        }
        // 临时跳转主页end
        _self.setData({
            pageName: cur
        })
    }
})