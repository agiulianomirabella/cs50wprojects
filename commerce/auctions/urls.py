from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("closed", views.closed, name="closed"),
    path("categories", views.categories, name="categories"),
    path("categories/<str:category_id>", views.category, name="category"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("listings/<str:listing_id>", views.listing, name="listings"),
    path("listings/<str:listing_id>/watch", views.watch, name="watch"),
    path("create_listing", views.create_listing, name="create_listing"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("listings/<str:listing_id>/comment", views.comment, name="comment"),
    path("listings/<str:listing_id>/bid", views.bid, name="bid"),
    path("listings/<str:listing_id>/close", views.close, name="close"),
]
