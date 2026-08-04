from flask import request, redirect, url_for, render_template, flash
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user


import os

class AdminAuthIndexView(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        # 带上跳转原地址，登录后自动跳回刚才想去的页面
        return redirect(url_for('admin_login', next=request.url))


class SecureModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login', next=request.url))


class SimpleUser(UserMixin):
    def __init__(self, uid: str):
        self.id = uid


def init_admin(app, db):
    """Initialize Flask-Admin with protected ModelViews and simple login.

    This registers minimal /admin/login and /admin/logout routes and protects
    the admin UI using Flask-Login. Credentials are read from app.config:
      ADMIN_USER (default: 'admin')
      ADMIN_PASSWORD (default: 'password')

    This is a lightweight, non-persistent auth suitable for quick setups.
    For production, replace with a proper user model and secure password storage.
    """
    # 1、先去操作系统环境变量里读取
    # 有环境变量 → 拿到你设置的账号密码
    # 没有环境变量 → 取用兜底默认 admin/password
    val_user = os.getenv("ADMIN_USER", "admin")
    # 2、把拿到的结果存入 Flask 的 app.config 全局配置容器
    app.config["ADMIN_USER"] = val_user
    app.config["ADMIN_PASSWORD"] = os.getenv("ADMIN_PASSWORD", "password")

    try:
        # Delay import of models to avoid circular imports at module import time
        from src.db_modle import NewList, VideoList
    except Exception:
        return None

    # ==========第一步：优先配置SECRET_KEY，必须在LoginManager初始化之前==========
    if not app.config.get("SECRET_KEY"):
        app.config["SECRET_KEY"] = "dev-secret-yycity-admin-20260804"
    # 同步赋值实例属性，彻底杜绝空密钥
    app.secret_key = app.config["SECRET_KEY"]

    # Initialize LoginManager
    login_manager = LoginManager()
    login_manager.init_app(app)
    # 关键配置：未登录自动跳转到登录路由
    login_manager.login_view = "admin_login"
    login_manager.login_message = "请先登录管理员后台账号"

    @login_manager.user_loader
    def load_user(user_id):
        admin_user = app.config.get('ADMIN_USER', 'admin')
        if user_id == admin_user:
            return SimpleUser(user_id)
        return None

    # 全局前置拦截：所有 /admin 开头地址强制校验登录，终极兜底
    @app.before_request
    def intercept_admin_all():
        path = request.path
        # 放行登录、登出接口，其余admin路由必须登录
        allow_path = ("/admin/login", "/admin/logout")
        if path.startswith("/admin") and path not in allow_path:
            if not current_user.is_authenticated:
                return redirect(url_for("admin_login", next=path))

    # Login route
    @app.route('/admin/login', methods=['GET', 'POST'])
    def admin_login():
        if request.method == 'POST':
            username = request.form.get('username', '').strip()
            password = request.form.get('password', '').strip()
            cfg_user = app.config.get('ADMIN_USER', 'admin')
            cfg_pass = app.config.get('ADMIN_PASSWORD', 'password')
            next_url = request.args.get('next') or url_for('admin.index')
            if username == cfg_user and password == cfg_pass:
                user = SimpleUser(cfg_user)
                login_user(user)
                return redirect(next_url)
            flash('用户名或密码错误', 'error')
        return render_template('admin_login.html')

    @app.route('/admin/logout')
    def admin_logout():
        logout_user()
        return redirect(url_for('admin_login'))

    # Create admin with secure index view and register model views
    admin = Admin(app, name="夜雨市后台", index_view=AdminAuthIndexView(name='首页'), url='/admin')
    admin.add_view(SecureModelView(NewList, db.session, category="数据表"))
    admin.add_view(SecureModelView(VideoList, db.session, category="数据表"))

    return admin