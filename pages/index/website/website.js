// pages/index/web-site/web-site.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sensitiveInfo: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 检测需要访问的模块
        console.log("options.module = " + (typeof(options.module) == "undefined" ? null : options.module));
        if (typeof(options.module) !== "undefined") {

        } else {
            wx.showModal({
                title: "页面出错啦",
                content: "你好像进入了一个页面的施工现场",
                showCancel: false,
                confirmText: "速速离开",
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})