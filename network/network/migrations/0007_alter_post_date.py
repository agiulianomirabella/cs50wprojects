# Generated by Django 3.2.5 on 2022-07-05 08:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_alter_post_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 7, 5, 8, 10, 11, 815922)),
        ),
    ]
