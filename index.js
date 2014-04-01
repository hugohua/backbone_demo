
$(function(){

    var Article = Backbone.Model.extend({
        defaults : function(){
            return {
                'title':'标题',
                'content':'内容',
                'time':Date.now()
            }
        }
    });

    var ArticleList = Backbone.Collection.extend({
        url: 'todos/',
        model:Article
    });

    var Articles = new ArticleList;


    var ArticleView = Backbone.View.extend({

        tagName:'article',

        template: _.template( $('#J_article').html() ),

        initialize: function(){
            //新增 修改
            this.listenTo(this.model, 'change', this.render);
            //删除
            this.listenTo(this.model,'destroy',this.remove)
        },

        events:{
            'click .destroy':'clear'
        },

        //事件  调用model的方法 通过该方法 触发 destroy 事件 ，然后destroy事件调用remove方法
        clear:function(){
            this.model.destroy();
            return false;
        },

        remove:function(){
            this.$el.remove();
            console.info('remove')
        },

        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            router.navigate("article/" + this.model.cid);
            return this;
        }

    });

    var AppView = Backbone.View.extend({

        el:'body',

        initialize:function(){
            this.listenTo(Articles, 'add', this.addOne);
            this.listenTo(Articles, 'reset', this.addAll);
            this.listenTo(Articles, 'all', this.render);
            //从服务器拉取数据
//            Articles.fetch();
        },

        addOne:function(article){
            var view = new ArticleView({model: article});
            $('#J_app').append(view.render().el);
        },

        render:function(){

        },

        addAll: function() {
            Articles.each(this.addOne(),this)
        },

        events:{
            'click #J_post': 'insertArticle'
        },

        insertArticle: function(){
//            console.info(this,this.model,'===')
            Articles.create({
                'title':$('#J_tit').val(),
                'content':$('#J_cnt').val()
            },{
                success:function(){
                   console.info('create success!')
                }
            });
            return false;
        }

    });

    /**
     * 进行ajax的CRUD后 会调用此函数
     * @param method
     * @param model
     * @param options
     */
    Backbone.sync = function(method, model, options) {
        console.info('sync',method,model,options)
    };

    var AppRouter = Backbone.Router.extend({
        routes:{
            '':'init',
            'article/:id':'artTest'
        },
        artTest:function(){
            console.info('aa')
            new AppView;
        },
        init:function(){
            console.info('init')
            new AppView;

        }
    });

    var router = new AppRouter;

    Backbone.history.start();



});