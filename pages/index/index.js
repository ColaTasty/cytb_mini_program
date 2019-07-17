var edusystem = require("../../utils/Edusystem.js");

//index.js
//获取应用实例
const APP = getApp()

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
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    onLoad: function(options) {
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
            switch (direction) {
                default: break;
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
            }
        )
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
        if (_self.data.needBack) {
            switch (_self.data.pageName) {
                case "profile":
                    wx.showModal({
                        title: "请授权登录",
                        content: "请在此页登录小程序，授权登录后左上角返回^_^",
                        cancelText: "我不要",
                        confirmText: "好的",
                        success: function(e) {
                            if (e.cancel) {
                                wx.showModal({
                                    title: "请三思",
                                    content: "你的登录信息仅用于识别身份，不会挪为他用",
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
                    break;
            }
            return;
        }
        _self.setData({
            pageName: cur
        })
    }
})