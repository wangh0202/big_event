$(function(){
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
            }
        });
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type : 1,
            area : ['500px','250px'],
            title : '添加文章分类',
            content : $('#dialog-add').html()
        })
    });
    //分类的添加 ,通过代理为form-add表单绑定submit事件
    $('body').on('submit' ,'#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                //根据索引关闭对应的弹出层
                // console.log(indexAdd);
                layer.close(indexAdd);
            }
        });
    });

    //通过代理，为btn-edit按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click','.btn-edit', function () {
        console.log(111);
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type : 1,
            area : ['500px','250px'],
            title : '修改文章分类',
            content : $('#dialog-edit').html()
        })
        
        var id = $(this).attr('data-id');
        //发起请求获取对应分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res);
                form.val('form-edit',res.data);
            }
        });
    });

    //通过代理，为修改分类的表单绑定submit事件
    $('body').on('submit','#form-edit', function () {
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败');
                }
                layer.msg('更新分类成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    //通过代理，为删除按钮绑定click事件
    $('tbody').on('click','.btn-delete', function () {
        var id = $(this).attr('data-id');
        //提示是否删除
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    //回调函数的形参，代表当前弹出框
                    layer.close(index);
                    initArtCateList();
                }
            });
            
            layer.close(index);
          });
    });
});