$(function(){
   var form = layui.form;
   var layer = layui.layer;
   
   form.verify({
        pwd : [/^[\S]{6,12}$/,'密码6-12位'],
        samePwd : function(value){
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd : function(value){
            if (value !== $('[name=newPwd]').val()) {
                return  '两次密码不一致';
            } 
        }
   })

   $(".layui-form").on('submit',function(e){
       e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新密码成功');
                //重置表单
                $('.layui-form')[0].reset();
            }
        });
   })
});