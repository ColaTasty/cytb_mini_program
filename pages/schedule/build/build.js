// pages/schedule/build/build.js
const APP = getApp();
const APP_MODULE = APP.customModule;
const MODULE = require("./../scheduleModule.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        steps: [{
            name: "起表名",
            passed: false
        }, {
            name: "排课程",
            passed: false
        }, {
            name: "预览",
            passed: false
        }, {
            name: "完成",
            passed: false
        }],
        stepIdx: 0,
        schedule: {},
        dayIdx: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _self = this;
        // 设置默认课表
        var list = MODULE.GetDefaultScheduleList();
        _self.setData({
            schedule: { list: list, name: "" }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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

    bindtap_NextStep: function(e) {
        var _self = this;
        var stepIdx = e.currentTarget.dataset.stepIdx;
        var steps = _self.data.steps;
        steps[stepIdx - 1].passed = true;
        stepIdx = parseInt(stepIdx);
        _self.setData({
            stepIdx: stepIdx,
            steps: steps
        })
    },

    bindtap_LastStep: function(e) {
        var _self = this;
        var stepIdx = e.currentTarget.dataset.stepIdx;
        var steps = _self.data.steps;
        steps[stepIdx].passed = false;
        stepIdx = parseInt(stepIdx);
        _self.setData({
            stepIdx: stepIdx,
            steps: steps
        })
    },

    bindinput_ScheduleName: function(e) {
        var _self = this;
        var value = e.detail.value;
        var schedule = _self.data.schedule;
        schedule.name = value;
        _self.setData({
            schedule: schedule
        });
    },

    bindtap_TabSelect: function(e) {
        var dayIdx = e.currentTarget.dataset.dayIdx;
        var _self = this;
        _self.setData({
            dayIdx: dayIdx
        })
    }
})