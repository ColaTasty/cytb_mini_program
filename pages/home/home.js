// pages/home/home.js
var APP = getApp();
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        featuresList: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        featuresList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {

    },

    lifetimes: {
        attached: function() {

        }
    }
})