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


    //获取form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        //自定义pwd校验规则
        pwd : [/^[\S]{6,12}$/,'密码必须6-12位，且不能出现空格'],
        repwd : function(value){
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username :$('#form_reg [name=username]').val(),
            password :$('#form_reg [name=password]').val() 
        }
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                console.log(data);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //模拟点击去登陆
                $('#link_login').click();
            }
        });
        // $.post("http://ajax.frontend.itheima.net/api/reguser", data,
        //     function (res) {
        //         console.log(data);
        //         if (res.status !== 0) {
        //             return alert(res.message);
        //         }
        //         alert("注册成功");
        //     }
        // );
    });


    //登陆表单
    $('#form_login').submit(function (e) { 
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            //获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //将登陆成功的token字符串保存到本地
                localStorage.setItem('token',res.token);
                //跳转主页
                location.href = './index.html';
            }
        });
    });
});