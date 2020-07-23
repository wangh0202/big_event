$(function(){
    // 点击注册账号链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    //点击登录链接
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    });
});