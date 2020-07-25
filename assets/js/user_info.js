$(function(){
    var form = layui.form;
    var layer = layui.layer;
    //自定义验证规则
    form.verify( {
        nickname : function(value){
            if (value.length > 6) {
               return '昵称长度需要1-6位！'; 
            }
        }
    })
    initUserInfo();

    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                //调用form.val()赋值
                form.val('formUserInfo',res.data);
            }
        });
    }   

    //重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //发起Ajax数据请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //调用父页面中的方法，重新渲染用户的头像和信息
                window.parent.getUserInfo();
            }
        });
    });
});