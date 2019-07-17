// pages/cet/cet.js
const APP = getApp();
const CET_MODULE = require("cetModule.js");
const types_z = ["", "CET4-D", "CET6-D", "CJT4-D", "CJT6-D", "PHS4-D", "PHS6-D", "CRT4-D", "CRT6-D", "TFU4-D"];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        errZkz: false,
        errName: false,
        errV: false,
        valueZkz: "",
        valueName: "",
        valueV: "",
        vUrl: "",
        loadingV: false,
        canRefreshV: true,
        refreshV: "刷新",
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
            zkz: "012345678901234",
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
        CET_MODULE.CleanCetCookie();
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
        var vUrl = "";
        var cookie = "";
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
        // 请求验证码
        _self.setData({
            loadingV: true,
            canRefreshV: false
        })
        CET_MODULE.GetCetVerifyImage({
                zkz: _self.data.valueZkz
            },
            // 请求成功
            function(res) {
                // 获取成功
                if (res.data.isOK) {
                    vUrl = res.data.callback.url;
                    cookie = res.data.callback.cookie;
                    CET_MODULE.SetCetCookieToStorage(
                        cookie,
                        function() {
                            _self.setData({
                                vUrl: vUrl
                            });
                        }
                    )
                }
                // 获取失败
                else {
                    wx.showModal({
                        title: "获取失败",
                        msg: res.data.msg
                    });
                }
            },
            // 请求失败
            null,
            // 请求完成
            function() {
                _self.setData({
                    loadingV: false
                });
                var timeout = 5;
                var i = setInterval(function() {
                    _self.setData({
                        refreshV: "刷新" + (timeout--) + "s"
                    })
                    if (timeout < 0) {
                        _self.setData({
                            refreshV: "刷新",
                            canRefreshV: true
                        })
                        clearInterval(i);
                    }
                }, 1100);
            });
        // 请求验证码end
    },

    bindtap_RefreshV: function() {
        this.bindtap_GetVUrl();
    },

    CheckCanSubmit: function() {
        var _self = this;
        var zkz = _self.data.valueZkz;
        var name = _self.data.valueName;
        var v = _self.data.valueV;
        var strSearch = _self.data.strSearch;
        if (zkz.length > 0 && name.length > 0 && v.length > 0 && strSearch == "查询") {
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
        var t = _self.CheckI();
        if (t == null) {
            wx.showModal({
                title: "准考证错误",
                content: "请检查准考证是否正确",
                showCancel: false
            })
            _self.bindtap_RefreshV();
            return;
        }
        // 开始查询
        _self.setData({
            searching: true,
            canSub: false
        });
        CET_MODULE.Query({
                t: t.tab,
                zkz: _self.data.valueZkz,
                name: _self.data.valueName,
                v: _self.data.valueV
            },
            // 请求成功
            function(res) {
                // 查询成功
                if (res.data.isOK) {
                    var callback = res.data.callback;
                    var result = {
                        name: callback.n,
                        zkz: callback.z,
                        school: callback.x,
                        read: callback.r,
                        write: callback.w,
                        listen: callback.l,
                        total: callback.s,
                    }
                    _self.setData({
                        result: result,
                        haveGetResult: true
                    })
                }
                // 查询失败
                else {
                    var f = APP.customModule.InitialOnFail(res.data.callback.error, "查询失败");
                    f();
                    if (_self.data.canRefreshV) {
                        _self.bindtap_RefreshV();
                    }
                }
            },
            // 请求失败
            null,
            // 请求完成
            function() {
                _self.setData({
                    valueName: "",
                    valueZkz: "",
                    valueV: "",
                    vUrl: "",
                    searching: false
                });
                var timeout = 5;
                var i = setInterval(() => {
                    _self.setData({
                        strSearch: "查询" + (timeout--) + "s"
                    });
                    if (timeout < 0) {
                        _self.setData({
                            strSearch: "查询"
                        })
                        _self.CheckCanSubmit();
                        clearInterval(i);
                    }
                }, 1100);
            });
        // 查询结束end
    },

    CheckI: function() {
        var index = -1;
        var z = this.data.valueZkz.toUpperCase();
        var t = z.charAt(0);

        if (t == "F") {
            index = 1;
        } else if (t == "S") {
            index = 2;
        } else {
            t = z.charAt(9);
            if (!isNaN(t))
                index = t;
        }

        if (index != -1) {
            var code = types_z[index];
            for (var i = 0; i < this.data.dd.rdsub.length; i++) {
                if (code == this.data.dd.rdsub[i].code) {
                    return this.data.dd.rdsub[i];
                }
            }
        }
        return null;
    },

    bindtap_Exit: function() {
        wx.navigateBack({
            delta: 1
        })
    },

    bindtap_BackSearch: function() {
        this.setData({
            haveGetResult: false,
            result: {
                name: "测试员",
                school: "东莞理工学院城市学院",
                zkz: "012345678901234",
                read: 0,
                write: 1,
                listen: 2,
                total: 3
            }
        })
    }
})