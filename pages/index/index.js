var edusystem = require("../../utils/Edusystem.js");

//index.js
//获取应用实例
const APP = getApp()

Page({
    data: {
        pageName: "index",
        showRedDot: {
            index: false,
            messages: false,
            profile: false
        },
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },

    onLoad: function(options) {
        console.log("options.redirect = " + (typeof(options.redirect) == "undefined" ? null : options.redirect));
        if (typeof(options.redirect) !== "undefined") {
            wx.navigateTo({
                url: options.redirect,
            })
        }
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