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
        featuresList: [],
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    onLoad: function(options) {
        var _self = this;
        // 检查跳转
        console.log("options.redirect = " + (typeof(options.redirect) == "undefined" ? null : options.redirect));
        if (typeof(options.redirect) !== "undefined") {
            wx.navigateTo({
                url: options.redirect,
            })
        }
        // 获取主页功能列表
        APP.customModule.HomePageFeatures(
            // 请求成功
            function(res) {
                // 获取成功
                if (res.data.isOK) {
                    _self.setData({
                        featuresList: res.data.list
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
    },

    onShow: function() {

    },

    onShareAppMessage: function(options) {},

    TabChange: function(e) {
        var _self = this;
        var cur = e.currentTarget.dataset.cur;
        _self.setData({
            pageName: cur
        })
    }
})