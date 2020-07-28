$(function(){

    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    
    //加载文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                // 调用模板引擎，渲染下拉菜单
                var htmlStr = template('tpl-cates',res);
                $('[name=cate_id]').html(htmlStr);
                //调用form.render(),重新渲染
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options);

    //为选择封面的按钮添加事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    $('#coverFile').on('change', function (e) {
        // 获取文件列表的数组
        var files = e.target.files;
        //判断是否选择文件
        if (files.length === 0) {
            return;
        }
        // 创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    //文章发布状态
    var art_state = '已发布';

    //存为草稿
    $('#btnSave2').on('clck', function () {
        art_state = '草稿';
    });


    //1.为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //2.基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);

        //3.将发布状态添加到fd中
        fd.append('state',art_state);
        // fd.forEach(function (v,k) {
        //     console.log(v,k);
        // })
        //4.将封面裁剪过后的图片输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            //5.将文件添加到fd中
            fd.append('cover_img',blob);
            // 6.发起Ajax请求,发表文章
            publishArticle(fd);
        })
    });


    //发布文章的方法
    function publishArticle(fd){
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            //注意：如果想服务器提交的事FormData格式的数据，必须添加以下两个配置项
            contentType : false,
            processData : false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败');
                }
                layer.msg('发布成功');
                //发布成功，跳转到列表页面
                location.href('/article/art_list.html');
            }
        });
    }
});