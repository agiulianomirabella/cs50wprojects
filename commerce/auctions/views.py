from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import Bid, Listing, User, Comment, Category


def index(request):
    listings = Listing.objects.filter(active=True)
    return render(request, "auctions/index.html", {
        'title': 'Active listings',
        'listings': listings
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def create_listing(request):
    categories = Category.objects.all()
    if request.method == 'POST':

        title = request.POST['title']
        description = request.POST['description']
        starting_bid = request.POST['starting_bid']
        image = request.POST['image']
        category_id = request.POST['category']
        category = Category.objects.get(pk=category_id)

        listing = Listing(
            title = title,
            creator = request.user, 
            description = description,
            starting_bid = starting_bid,
            image = image,
            category = category)

        listing.save()

    return render(request, 'auctions/create_listing.html', {
        'categories': categories
    })


def listing(request, listing_id):
    listing_to_view = Listing.objects.get(pk=listing_id)
    comments = listing_to_view.comments.all()
    watched = listing_to_view in request.user.watchlist.all()
    return render(request, 'auctions/listing.html', {
        'listing': listing_to_view, 
        'watched': watched,
        'comments': comments,
        'creator': listing_to_view.creator == request.user,
        'winner': listing_to_view.winner == request.user
    })


def watchlist(request):
    watchlist_listings = request.user.watchlist.all()
    return render(request, 'auctions/index.html', {
        'title': 'Watchlist',
        'listings': watchlist_listings
    })


def watch(request, listing_id):
    if request.method == 'POST':
        listing_to_watch = Listing.objects.get(pk=listing_id)
        if listing_to_watch in request.user.watchlist.all():
            request.user.watchlist.remove(listing_to_watch)
        else:
            request.user.watchlist.add(listing_to_watch)
        return redirect(listing, listing_to_watch.id)


def comment(request, listing_id):
    if request.method == 'POST':
        text = request.POST['text']
        listing_to_comment = Listing.objects.get(pk=listing_id)
        user = request.user
        new_comment = Comment(text=text, user=user, listing=listing_to_comment)
        new_comment.save()
        return redirect(listing, listing_id)


def bid(request, listing_id):
    if request.method == 'POST':
        amount = float(request.POST['amount'])
        listing_to_bid = Listing.objects.get(pk=listing_id)
        comments = listing_to_bid.comments.all()
        watched = listing_to_bid in request.user.watchlist.all()

        if amount<= listing_to_bid.current_price:
            return render(request, 'auctions/listing.html', {
                'listing': listing_to_bid, 
                'watched': watched,
                'comments': comments,
                'message' : 'The bid must be greater than the current price!',
                'creator': listing_to_bid.creator == request.user,
                'winner': listing_to_bid.winner == request.user
            })

        new_bid = Bid(amount=amount, user=request.user, listing=listing_to_bid)
        new_bid.save()
        return render(request, 'auctions/listing.html', {
            'listing': listing_to_bid, 
            'watched': watched,
            'comments': comments,
            'message' : 'You just made a bid for this listing!',
            'creator': listing_to_bid.creator == request.user,
            'winner': listing_to_bid.winner == request.user
        })


def close(request, listing_id):
    if request.method == 'POST':
        listing_to_close = Listing.objects.get(pk=listing_id)
        bids = listing_to_close.bids.all()
        comments = listing_to_close.comments.all()
        watched = listing_to_close in request.user.watchlist.all()
        if not bids:
            return render(request, 'auctions/listing.html', {
                'listing': listing_to_close, 
                'watched': watched,
                'comments': comments,
                'message' : 'There are no bids for this listing, so you cannot close it.',
                'creator': listing_to_close.creator == request.user,
                'winner': listing_to_close.winner == request.user
            })
        listing_to_close.winner = listing_to_close.bids.get(amount = listing_to_close.current_price).user
        listing_to_close.active = False
        listing_to_close.save()
        return render(request, 'auctions/listing.html', {
            'listing': listing_to_close, 
            'watched': watched,
            'comments': comments,
            'creator': listing_to_close.creator == request.user,
            'winner': listing_to_close.winner == request.user
        })


def closed(request):
    listings = Listing.objects.filter(active=False)
    return render(request, "auctions/index.html", {
        'title': 'Closed listings',
        'listings': listings
    })

def categories(request):
    categories_to_show = Category.objects.all()
    return render(request, 'auctions/categories.html', {
        'categories': categories_to_show
    })

def category(request, category_id):
    category = Category.objects.get(pk=category_id)
    listings = Listing.objects.filter(category=category_id)
    return render(request, 'auctions/index.html', {
        'title': f'Listings of category: {category.value}', 
        'listings': listings
    })