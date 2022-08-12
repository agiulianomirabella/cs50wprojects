
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("news", views.news, name="news"),
    path("northamerica", views.northamerica, name="northamerica"),
    path("southamerica", views.southamerica, name="southamerica"),
    path("europe", views.europe, name="europe"),
    path("africa", views.africa, name="africa"),
    path("northasia", views.northasia, name="northasia"),
    path("southasia", views.southasia, name="southasia"),
]
