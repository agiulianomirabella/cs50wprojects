# Generated by Django 4.0.6 on 2022-08-12 06:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0003_new_timestamp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='new',
            name='author',
        ),
        migrations.AddField(
            model_name='new',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='news', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
    ]