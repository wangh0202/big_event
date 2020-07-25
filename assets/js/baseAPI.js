$.ajaxPrefilter(function(options){
    //在发起Ajax请求前，同意拼接根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options);
    //统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization : localStorage.getItem('token') || ''
        }
        options.complete = function(res){
            // console.log(res.responseJSON.status);
            if (res.responseJSON.status === 1  && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token');
                // 2. 强制跳转到登录页面
                location.href = './login.html';
            }
        }
    }
})