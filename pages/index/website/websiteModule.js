const APP = getApp();
const APP_MODULE = APP.customModule;

/**
 * 请求跳转至url
 * @param {String} userInfo
 * @param {Function} OnSuccess 
 * @param {Function} OnFail 
 */
var NavigateToWebsite = function(userInfo, OnSuccess, OnFail = null) {
    APP_MODULE.CallApi(
        "/website",

    )
}