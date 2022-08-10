from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Report(models.Model):
    name = models.CharField(max_length=64)
    text = models.CharField()