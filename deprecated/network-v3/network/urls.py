
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.posts, name="posts"),
    # path("posts/<str:post_id>", views.post, name="post"),
    # path("users", views.users, name="users"),
    # path("users/<str:user_id>", views.profile, name="profile"),
]
