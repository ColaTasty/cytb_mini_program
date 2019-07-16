/**
 * APP模型
 */
const APP = getApp();
const APP_MODULE = APP.customModule;

/**
 * 获取初始值
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 * @param {Function} OnComplete 
 */
var GetCetInit = function(OnSuccess, OnFail = null, OnComplete = null) {
    if (OnFail == null) {
        OnFail = APP_MODULE.InitialOnFail("请重新打开页面试一试", "初始化失败");
    }
    APP_MODULE.CallApi(
        "/cet/init",
        null,
        OnSuccess,
        OnFail,
        OnComplete
    );
}

module.exports = {
    GetCetInit: GetCetInit
}