from django.contrib.auth.models import AbstractUser
from django.db import models
import django.utils.timezone as timezone


class User(AbstractUser):
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
        }

class New(models.Model):

    class Region(models.TextChoices):
        NORTHAMERICA = 'North America'
        SOUTHAMERICA = 'South America'
        EUROPE = 'Europe'
        AFRICA = 'Africa'
        NORTHASIA = 'North Asia'
        SOUTHASIA = 'South Asia'
    
    region = models.CharField(
        max_length=64,
        choices=Region.choices,
    )

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="news", blank=True, null=True)
    text = models.CharField(max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.serialize(),
            'region': self.region,
            'text': self.text,
            'timestamp': self.timestamp,
        }


# class Comment(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
#     text = models.CharField(max_length=64)
#     new = models.ForeignKey(New, on_delete=models.CASCADE, related_name="comments")

#     # def __str__(self):
#     #     return f'@{self.author}: "{self.text}"'

#     def serialize(self):
#         return {
#             'id': self.id,
#             'author': self.author.serialize(),
#             'text': self.text,
#             'new': self.new.serialize(),
#         }

