/**
 * 服务器资源地址
 */
const host = "https://makia.dgcytb.com";

/**
 * @param  {string} url
 * @param  {Object} data = null
 * @param  {Function} OnSuccess
 * @param  {Function} OnFail = null
 * @param  {Function} OnComplete = null
 */
var CallApi = function(url, data = null, OnSuccess, OnFail = null, OnComplete = null, header = null) {
    header["content-type"] = "application/x-www-form-urlencoded";
    if (OnFail === null)
        OnFail = function(res) {
            console.log(res);
            wx.showModal({
                title: "网络连接失败",
                content: "网络连接失败，请检查网络后，稍后再试",
                showCancel: false
            })
        }
    wx.request({
        url: host + url,
        data: data,
        header: header,
        method: "POST",
        success: OnSuccess,
        fail: OnFail,
        complete: OnComplete
    })
}

module.exports = {
    CallApi: CallApi
}