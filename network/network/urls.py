
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.posts, name="posts"),
    path("users", views.users, name="users"),
    path("posts/<str:post_id>", views.post, name="post"),
    path("posts/<str:post_id>/like", views.like, name="post"),
    path("posts/<str:post_id>/edit", views.edit, name="edit"),
    path("posts/<str:post_id>/comments", views.comments, name="comments"),
    path("users/<str:user_id>", views.profile, name="user"),
    path("users/<str:user_id>/follow", views.follow, name="user"),
    path("following", views.following, name="following"),
]
