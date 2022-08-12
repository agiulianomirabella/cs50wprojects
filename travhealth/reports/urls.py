
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("news", views.news, name="news"),
    path("northamerica/news", views.northamerica_news, name="northamerica_news"),
    path("southamerica/news", views.southamerica_news, name="southamerica_news"),
    path("europe/news", views.europe_news, name="europe_news"),
    path("africa/news", views.africa_news, name="africa_news"),
    path("northasia/news", views.northasia_news, name="northasia_news"),
    path("southasia/news", views.southasia_news, name="southasia_news"),
    path("northamerica", views.northamerica, name="northamerica"),
    path("southamerica", views.southamerica, name="southamerica"),
    path("europe", views.europe, name="europe"),
    path("africa", views.africa, name="africa"),
    path("northasia", views.northasia, name="northasia"),
    path("southasia", views.southasia, name="southasia"),
    path("report", views.report, name="report"),
]
