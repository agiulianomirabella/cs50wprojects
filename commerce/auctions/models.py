from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator

class User(AbstractUser):
    pass

class Category(models.Model):
    value = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.value}'

class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=128)
    starting_bid = models.FloatField(validators=[MinValueValidator(0.01)])
    image = models.CharField(max_length=64)
    active = models.BooleanField(default=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_listings")
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, null=True, blank=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="won_listings", null=True, blank=True)
    watchedby = models.ManyToManyField(User, blank=True, null=True, related_name='watchlist')

    def __str__(self):
        return f'{self.title}: {self.description}. Starting at {self.starting_bid}$.'

    @property
    def current_price(self):
        bids = self.bids.all()
        if not bids:
            return self.starting_bid
        return max([b.amount for b in self.bids.all()])

class Bid(models.Model):
    amount = models.FloatField(validators=[MinValueValidator(0.01)])
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")

    def __str__(self):
        return f'Bid of {self.amount}$ made by {self.user.username} on {self.listing.title}'

class Comment(models.Model):
    text = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return f'{self.user.username}: "{self.text}" on {self.listing.title}'
