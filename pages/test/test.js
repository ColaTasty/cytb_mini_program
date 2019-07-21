// pages/test/test.js
const APP = getApp();
const APP_MODULE = APP.customModule;
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.getUserInfo({
            success: function(res) {
                var iv = res.iv;
                var encryptedData = res.encryptedData;
                APP_MODULE.GetOpenId(
                    function(res) {
                        APP_MODULE.CallApi(
                            "/decrypt", {
                                openId: res.data,
                                iv: iv,
                                encryptedData: encryptedData
                            },
                            function(res) {
                                var callback = JSON.parse(res.data.callback);
                                console.log(callback);
                            }
                        )
                    }
                )
            }
        })
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