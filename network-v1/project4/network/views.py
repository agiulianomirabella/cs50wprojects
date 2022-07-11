from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import NewCommentForm, NewPostForm, Post, User, Comment


def index(request):
    if request.user.is_authenticated:
        return render(request, 'network/index.html')
    return redirect(login_view)


def posts(request):
    if request.method == 'POST':
        text = request.POST["new-comment-text"]
        author = request.user
        post = Post(text=text, author=author)
        post.save()
    posts = Post.objects.all().order_by("-timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)


def users(request):
    users = User.objects.all()
    return JsonResponse([user.serialize() for user in users], safe=False)


def post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({
            "error": f"Post with id {post_id} does not exist."
        }, status=400)
    return JsonResponse(post.serialize(), safe=False)


def profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({
            "error": f"User with id {user_id} does not exist."
        }, status=400)
    return JsonResponse(user.serialize(), safe=False)


def like(request, post_id):
    post = Post.objects.get(pk=post_id)
    liked = request.user in post.likes.all()

    if not liked:
        post.likes.add(request.user)
    else:
        post.likes.remove(request.user)

    return JsonResponse(post.serialize(), safe=False)


def follow(request, user_id):
    profile = User.objects.get(pk=user_id)
    followed = request.user in profile.followers.all()

    if not followed:
        profile.followers.add(request.user)
    else:
        profile.followers.remove(request.user)

    return JsonResponse(profile.serialize(), safe=False)


def comments(request):
    if request.method == 'POST':
        text = request.POST["new-comment-text"]
        author = request.user
        post = form.cleaned_data["post"]
        comment = Comment(text=text, author=author, post=post)
        comment.save()
    comments = Comment.objects.all()
    return JsonResponse([comment.serialize() for comment in comments], safe=False)


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
