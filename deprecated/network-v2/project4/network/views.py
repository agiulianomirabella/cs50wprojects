from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import User, Post, Comment


def index(request):
    posts = Post.objects.all().order_by("-timestamp")
    return render(request, "network/index.html", {
        'posts': posts
    })

def posts(request):
    if request.method == 'POST':
        text = request.POST["text"]
        author = request.user
        post = Post(text=text, author=author)
        post.save()
    posts = Post.objects.all().order_by("-timestamp")
    return render(request, "network/index.html", {
        'posts': posts
    })

def post(request, post_id):
    post = Post.objects.get(pk=post_id)
    return render(request, "network/post.html", {
        'post': post
    })

def comments(request, post_id):
    if request.method == 'POST':
        post = Post.objects.get(pk=post_id)
        author = request.user
        text = request.POST['text']
        comment = Comment(text = text, post=post, author=author)
        comment.save()
    return render(request, "network/post.html", {
        'post': post
    })

def profile(request, usr_id):
    author = User.objects.get(pk=usr_id)
    posts = Post.objects.filter(author=author)
    return render(request, "network/profile.html", {
        'author': author,
        'posts': posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
