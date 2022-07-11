from datetime import datetime
from logging.handlers import DEFAULT_UDP_LOGGING_PORT
from xml.dom import ValidationErr
from django.contrib.auth.models import AbstractUser
from django.db import models

from django import forms

class User(AbstractUser):
    following = models.ManyToManyField('self', related_name='followers', symmetrical=False)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'followers': [x.username for x in self.followers.all()],
            'following': [x.username for x in self.following.all()]
        }

class Post(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=64)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    likes = models.ManyToManyField(User, related_name='liked', blank=True)

    def __str__(self):
        return f'@{self.author} posted: "{self.text}"'

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.serialize(),
            'text': self.text,
            'timestamp': self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            'likes': [x.serialize() for x in self.likes.all()],
            'likes_number': len(self.likes.all()),
            'comments': [c.serialize() for c in self.comments]
        }

class Comment(models.Model):
    text = models.CharField(max_length=64)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return f'@{self.author}: "{self.text}"'

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.serialize(),
            'text': self.text,
            'post': self.post.serialize()
        }

class NewPostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['text']

class NewCommentForm(forms.Form):
    class Meta:
        model = Comment
        fields = ['text']

