// pages/cet/result/result.js
const APP = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        result: {
            type: Object,
            value: {
                read: 110,
                write: 120,
                listen: 130,
                total: 360
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindtap_GetRank: function() {
            wx.getSetting({
                success(res) {
                    var auth = res.authSetting;
                    // if !auth["scope.userInfo"]
                    if (!auth["scope.userInfo"]) {
                        wx.showModal({
                            title: "请求授权",
                            content: "你还没有给小助手授权哦！",
                            showCancel: false,
                            confirmText: "前去授权",
                            success: function(e) {
                                if (e.confirm) {
                                    APP.customMdule.AuthUserInfo(
                                        function() {
                                            // 授权成功
                                        }
                                    );
                                }
                            }
                        })
                    }
                    // else auth["scope.userInfo"]
                    else {
                        APP.customMdule.GetUserInfoFromServer(function(res) {
                            // 信息获取成功
                        });
                    }
                    // end if
                }
            })
        }
    }
})