from django.contrib import admin

from auctions.models import Bid, Category, Listing, Comment

# Register your models here.

admin.site.register(Listing)
admin.site.register(Bid)
admin.site.register(Category)
admin.site.register(Comment)
