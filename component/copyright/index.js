// compontent/copyright/index.js
Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        year: 2019
    },

    /**
     * 组件的方法列表
     */
    methods: {

    },

    lifetimes: {
        attached: function() {
            var _self = this;
            var date = new Date();
            _self.setData({
                year: date.getFullYear()
            });
        }
    }
})