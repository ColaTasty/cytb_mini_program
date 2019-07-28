// compontent/pages/profile/profile.js
const APP = getApp();
const APP_MODULE = APP.customModule;
Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        userInfo: {
            type: Object,
            value: undefined
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
        bindgetuserinfo: function(res) {
            var _self = this;
            // 验证信息完整性
            APP_MODULE.VerifyUserInfo(
                res.detail,
                function(res) {
                    var data = res.data;
                    // 信息完整
                    if (data.isOK) {
                        console.log("信息完整，信息获取成功");
                        _self.setData({
                            userInfo: data.userInfo
                        });
                    }
                    // 信息不完整
                    else {
                        console.log("信息不完整，信息获取失败");
                        wx.showModal({
                            title: "(⊙ˍ⊙)",
                            content: "好像登录失败了，再点一次试试",
                            confirmText: "好",
                            showCancel: false
                        })
                    }

                }
            );
        }
    }
})