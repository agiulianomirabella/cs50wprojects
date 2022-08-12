from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

import json
from .models import New, User


def index(request):
    return render(request, "reports/index.html", {
        'region_description' : False
    })

@csrf_exempt
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
            return render(request, "reports/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "reports/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@csrf_exempt
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "reports/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "reports/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "reports/register.html")

@csrf_exempt
def news(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        text = data['new-new-text']
        region = data['new-new-region']

        author = request.user
        new = New(text=text, author=author, region=region)
        new.save()
        
    news = New.objects.all().order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def northamerica(request):
    return render(request, "reports/northamerica.html")

def southamerica(request):
    return render(request, "reports/southamerica.html")

def europe(request):
    return render(request, "reports/europe.html")

def africa(request):
    return render(request, "reports/africa.html")

def northasia(request):
    return render(request, "reports/northasia.html")

def southasia(request):
    return render(request, "reports/southasia.html")


def northamerica_news(request):
    news = New.objects.filter(region='North America').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def southamerica_news(request):
    news = New.objects.filter(region='South America').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def europe_news(request):
    news = New.objects.filter(region='Europe').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def africa_news(request):
    news = New.objects.filter(region='Africa').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def northasia_news(request):
    news = New.objects.filter(region='North Asia').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

def southasia_news(request):
    news = New.objects.filter(region='South Asia').order_by("-timestamp")
    return JsonResponse([new.serialize() for new in news], safe=False)

@csrf_exempt
def report(request):
    user = request.user

    if request.method == 'PUT':
        data = json.loads(request.body)
        new_report = data['edit-report-text']
        user.report = new_report
        user.save()

    report = user.report
    return JsonResponse({'report': report})

