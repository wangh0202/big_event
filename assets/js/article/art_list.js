$(function(){
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //补零函数
    function padZero(n) {
        return n < 10 ? n : '0'+ n;
    }

    //美化时间过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);
        var y = dt.getFullYear();
        // console.log(date);
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());


        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss ;
    }


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q ={
        pagenum :1,         //默认请求第一页的数据
        pagesize : 2,     //每页显示几条数据
        cate_id : '',      //文章分类的Id
        state :''       //文章发布的动态
    }

    initTable();
    initCate();
     //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
                //调用渲染分页
                renderPage(res.total);
            }
        });
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败');
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                //通知layui重新渲染表单区域的ui结构
                form.render();
            }
        });
    }



    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件，重新渲染表格数据
        initTable();
    });


    //渲染分页
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()方法渲染分页结构
        laypage.render({
            elem : 'pageBox',   //分页容器的id
            count : total,       //总数据的条数
            limit : q.pagesize,     //每页显示几条数据
            curr :q.pagenum,         //设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits :[2,3,5,10],
            // 分页发生切换时，触发jump回调
            //触发jump回调的方式有两种：
            // 1.点击页码的时候
            //2.只要调用了layerpage.render()方法，就会触发
            jump :function(obj ,first){
                //可以通过first的值判断是哪种方式出发的，first为true是第二种触发的

                // console.log(obj.curr);
                // console.log(first);
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q 查询对象的 pagesize属性中
                q.pagesize = obj.limit;
                //根据最新的q获取对应数据列表，并渲染表格
                if (!first) {
                    initTable();
                }
            }
        });

    }


    //通过代理的方式，为删除按钮绑定处理函数
    $('tbody').on('click','.btn-delete', function () {
        //删除按钮的个数
        var len = $('.btn-delete').length;
        //获取文章的id
        var id = $(this).attr('data-id');
        //询问是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    //当数据删除后，判断是否还有剩余数据，如没有，则让页码值-1 后再调用方法
                    if (len === 1) {
                        //如果len=1  ,则删除完毕后，页面上就没有任何数据了
                        //页码值最小是1
                        q.pagenum = q.pagenum === 1 ?  1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            
            layer.close(index);
          });
    });

    //通过代理的方式，为编辑按钮绑定处理函数
    $('tbody').on('click','.btn-edit', function () {
        
    });
});