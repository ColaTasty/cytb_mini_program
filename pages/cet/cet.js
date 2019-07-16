// pages/cet/cet.js
const CET_MODULE = require("cetModule.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarColor: "bg-black",
        errZkz: false,
        errName: false,
        errV: false,
        valueZkz: "",
        valueName: "",
        valueV: "",
        vUrl: "",
        canSub: false,
        searching: false,
        strSearch: "查询",
        alertMsg: false,
        topTips: "四六级查询",
        canUse: true,
        serviceMsg: "",
        haveGetResult: false,
        result: {
            name: "测试员",
            school: "东莞理工学院城市学院",
            read: 0,
            write: 1,
            listen: 2,
            total: 3
        },

        dd: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _self = this;
        // 检测标题栏颜色
        console.log("options.bgColor = " + (typeof(options.bgColor) !== "undefined" ? options.bgColor : null));
        if (typeof(options.bgColor) !== "undefined") {
            _self.setData({
                navBarColor: options.bgColor
            })
        }
        // 获取初始值
        wx.showLoading({
            title: "正在连接"
        });
        CET_MODULE.GetCetInit(
            function(res) {
                // 请求成功
                if (res.data.isOK) {
                    _self.setData({
                        dd: res.data.dd,
                        topTips: res.data.dd.subn
                    })
                }
                // 请求失败
                else {
                    _self.setData({
                        alertMsg: true,
                        topTips: res.data.msg
                    })
                }
                // 若是功能不可用
                if (!res.data.config.canUse) {
                    _self.setData({
                        canUse: false,
                        serviceMsg: res.data.config.msg
                    })
                }
            },
            null,
            function() {
                wx.hideLoading();
            }
        )
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

    },

    bindtap_GetVUrl: function() {
        var _self = this;
        if (_self.data.valueZkz.length !== 15) {
            wx.showModal({
                title: "准考证不正确",
                content: "请输入15位准考证号",
                showCancel: false,
                confirmText: "好"
            });
            _self.setData({
                errZkz: true
            })
            return;
        }
        var vUrl = "http://cet.neea.edu.cn/imgs/fe2e890687a04542b86ece1ad5270830.png";
        _self.setData({
            vUrl: vUrl
        })
    },

    bindtap_RefreshV: function() {
        this.bindtap_GetVUrl();
    },

    CheckCanSubmit: function() {
        var _self = this;
        var zkz = _self.data.valueZkz;
        var name = _self.data.valueName;
        var v = _self.data.valueV;
        if (zkz.length > 0 && name.length > 0 && v.length > 0) {
            _self.setData({
                canSub: true
            })
        } else {
            _self.setData({
                canSub: false
            })
        }
    },

    bindinput_Zkz: function(e) {
        var _self = this;
        var value = e.detail.value;
        _self.setData({
            valueZkz: value
        });
        if (_self.data.errZkz) {
            _self.setData({
                errZkz: false
            })
        }
        _self.CheckCanSubmit();
    },

    bindinput_Name: function(e) {
        var _self = this;
        var value = e.detail.value;
        _self.setData({
            valueName: value
        });
        if (_self.data.errName) {
            _self.setData({
                errName: false
            })
        }
        _self.CheckCanSubmit();
    },

    bindinput_V: function(e) {
        var _self = this;
        var value = e.detail.value;
        _self.setData({
            valueV: value
        });
        if (_self.data.errV) {
            _self.setData({
                errV: false
            })
        }
        _self.CheckCanSubmit();
    },

    RefreshV: function() {
        this.bindtap_GetVUrl();
    },

    bindtap_Search: function() {
        // 提交查询，不用验证完整性
        var _self = this;
        _self.setData({
            searching: true,
            canSub: false
        });


        setTimeout(() => {
            _self.setData({
                searching: false
            });
            _self.CheckCanSubmit();
        }, 5000);
    },

    bindtap_Exit: function() {
        wx.navigateBack({
            delta: 1
        })
    }
})