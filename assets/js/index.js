$(function(){
    getUserInfo();

    var layer = layui.layer;
    
    $('#btnLoginOut').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('是否确定退出?', {icon: 3, title:'提示'}, function(index){
            //清除本地的token
            localStorage.removeItem('token');
            location.href = './login.html';
            
            layer.close(index);
        });
    });
});

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 请求头配置对象
        // headers :{
        //      Authorization : localStorage.getItem('token') || ''
        // },
        data: "data",
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.msg);
            }
            //渲染头像
            renderAvatar(res.data);
        },
        
    });
}

//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var fir = name[0].toUpperCase();
        $('.text-avatar').html(fir).show();
    }

}