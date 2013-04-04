// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var AppRouter, EditView, HeaderView, ItemView, ListView, Memo, MemoList, app, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

    app = app || {};
    Memo = (function(_super) {
      __extends(Memo, _super);

      function Memo() {
        _ref = Memo.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Memo.prototype.idAttribute = "_id";

      Memo.prototype.defaults = {
        title: "",
        content: ""
      };

      Memo.prototype.validate = function(attributes) {
        if (attributes.title === "" || attributes.content === "") {
          return "title and content must be not empty.";
        }
      };

      return Memo;

    })(Backbone.Model);
    MemoList = (function(_super) {
      __extends(MemoList, _super);

      function MemoList() {
        _ref1 = MemoList.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      MemoList.prototype.model = Memo;

      MemoList.prototype.url = "/memo";

      return MemoList;

    })(Backbone.Collection);
    EditView = (function(_super) {
      __extends(EditView, _super);

      function EditView() {
        this.hideView = __bind(this.hideView, this);
        this.onSave = __bind(this.onSave, this);        _ref2 = EditView.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      EditView.prototype.events = {
        "click #saveBtn": "onSave",
        "click #cancelBtn": "hideView"
      };

      EditView.prototype.initialize = function() {
        this.$title = $("#editForm [name='title']");
        return this.$content = $("#editForm [name='content']");
      };

      EditView.prototype.render = function() {
        this.$title.val(this.model.get("title"));
        this.$content.val(this.model.get("content"));
        return this.$el.show();
      };

      EditView.prototype.onSave = function() {
        var _this = this;

        this.model.save({
          title: this.$title.val(),
          content: this.$content.val()
        }).done(function() {
          return _this.collection.add(_this.model, {
            merge: true
          });
        });
        return this.hideView();
      };

      EditView.prototype.hideView = function() {
        this.$el.hide();
        return app.router.navigate("", {
          trigger: true
        });
      };

      return EditView;

    })(Backbone.View);
    ItemView = (function(_super) {
      __extends(ItemView, _super);

      function ItemView() {
        this.onDestroy = __bind(this.onDestroy, this);
        this.onDelete = __bind(this.onDelete, this);
        this.onEdit = __bind(this.onEdit, this);        _ref3 = ItemView.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ItemView.prototype.tmpl = _.template($("#tmpl-itemview").html());

      ItemView.prototype.events = {
        "click .edit": "onEdit",
        "click .delete": "onDelete"
      };

      ItemView.prototype.initialize = function() {
        this.listenTo(this.model, "change", this.render);
        return this.listenTo(this.model, "destroy", this.onDestroy);
      };

      ItemView.prototype.render = function() {
        this.$el.html(this.tmpl(this.model.toJSON()));
        return this;
      };

      ItemView.prototype.onEdit = function() {
        return app.router.navigate(this.model.get("_id") + "/edit", {
          trigger: true
        });
      };

      ItemView.prototype.onDelete = function() {
        return this.model.destroy();
      };

      ItemView.prototype.onDestroy = function() {
        return this.remove();
      };

      return ItemView;

    })(Backbone.View);
    ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        _ref4 = ListView.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      ListView.prototype.initialize = function() {
        var _this = this;

        this.listenTo(this.collection, "add", this.addItemView);
        return this.collection.fetch({
          reset: true
        }).done(function() {
          return _this.render();
        });
      };

      ListView.prototype.render = function() {
        var _this = this;

        return this.collection.each(function(item) {
          return _this.addItemView(item);
        });
      };

      ListView.prototype.addItemView = function(item) {
        return this.$el.append(new ItemView({
          model: item
        }).render().el);
      };

      return ListView;

    })(Backbone.View);
    HeaderView = (function(_super) {
      __extends(HeaderView, _super);

      function HeaderView() {
        this.onCreate = __bind(this.onCreate, this);        _ref5 = HeaderView.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      HeaderView.prototype.events = {
        "click .create": "onCreate"
      };

      HeaderView.prototype.onCreate = function() {
        return app.router.navigate("create", {
          trigger: true
        });
      };

      return HeaderView;

    })(Backbone.View);
    AppRouter = (function(_super) {
      __extends(AppRouter, _super);

      function AppRouter() {
        this.edit = __bind(this.edit, this);
        this.add = __bind(this.add, this);
        this.home = __bind(this.home, this);        _ref6 = AppRouter.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      AppRouter.prototype.routes = {
        "": "home",
        "create": "add",
        ":id/edit": "edit"
      };

      AppRouter.prototype.initialize = function() {
        this.collection = new MemoList;
        this.headerView = new HeaderView({
          el: $(".navbar")
        });
        this.editView = new EditView({
          el: $("#editForm"),
          collection: this.collection
        });
        return this.listView = new ListView({
          el: $("#memoList"),
          collection: this.collection
        });
      };

      AppRouter.prototype.home = function() {
        return this.editView.hideView();
      };

      AppRouter.prototype.add = function() {
        this.editView.model = new Memo(null, {
          collection: this.collection
        });
        return this.editView.render();
      };

      AppRouter.prototype.edit = function(id) {
        this.editView.model = this.collection.get(id);
        if (this.editView.model) {
          return this.editView.render();
        }
      };

      return AppRouter;

    })(Backbone.Router);
    app.router = new AppRouter;
    Backbone.history.start();
  })();

}).call(this);

/*
//@ sourceMappingURL=app.map
*/
