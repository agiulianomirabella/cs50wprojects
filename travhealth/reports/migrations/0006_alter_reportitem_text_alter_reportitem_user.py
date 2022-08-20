# Generated by Django 4.0.6 on 2022-08-12 09:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0005_reportitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reportitem',
            name='text',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AlterField(
            model_name='reportitem',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='report', to=settings.AUTH_USER_MODEL),
        ),
    ]