# TravHealth

Tired of feeling insecure about your healthcare when travelling to other countries in the world? Tired of having to go over dozen web pages again and again to know what COVID-19 related files you need to travel? Here is TravHealth.

## Introduction

Medical information standards and practices are very variable all over the world. What is more, confidentiality rules make hardly possible to uniform those standards into one, so that every doctor in the world could access every person's medical history.


## What TravHealth is

TravHealth is a workaround! TravHealth is a web application where you can write your own `report` -your medical history- indicating whether you are allergic, or suffer from any important disease to take into account. This information can be read by any doctor in the world, by simply consulting TravHealth.

If you are visiting India, and you are from Spain, very high chances are that your medical history can not be read and borne in mind by indian doctors, in case of an emergency. Instead, doctors could access TravHealth, and read the `report` you have written about yourself.

In addition to the `report` functionality, TravHealth also has a `news` section. In the news section, all kind of medical-related news are shared by users and the World Health Organization (WHO). You can read news as the are shared, or can use the `map` to locate the news of region of the world you are interested in.

<p align="center">
  <img src="reports/static/reports/appleworld.jpeg" alt="TravHealth logo"/>
</p>

## Distinctiveness and Complexity

This project is different from any other previous project of CS50w course because it is a blog-like application. You can not post anything in the feed, and in fact can not like or follow other users. It is not a mailing application, neither an amazon-like bids platform.

The complexity of this project resides in the idea -which I spent very long time planning- and in the `map` functionality. I used a map html object from [simplemaps.com](https://simplemaps.com) and modified the code to make each region redirect to a different web page (the news of that region).

Also, TravHealth is an hybrid between a one-page-application and a Django project without javascript. In fact, some functions of the backend return a json response, while others use Django to render an html template. The other projects ([mail](https://cs50.harvard.edu/web/2020/projects/3/mail/) and [network](https://cs50.harvard.edu/web/2020/projects/4/network/)) were -or, at least, I programmed them as- one-page-applications, and I was curious to make an hybrid page, so I did that with TravHealth.

## What’s contained in each file

```
reports/
    static/
        reports/
            - appleworld.jpeg: the logo.
            - index.js: the report functionality.
            - layout.js: the one-page-application functionality.
            - mapdata.js: the map regions and urls.
            - region.js: the functionality to show news of each region.
            - worldmap.js: the structure of the map.
    templates/
        reports/
            - africa.html: the region of Africa and Middle East.
            - europe.html: the region of Europe.
            - index.html: the main page of the website.
            - layout.html: the navigation bar of the website.
            - login.html: the login page.
            - northamerica.html: the region of North America.
            - northasia.html: the region of North Asia.
            - region.html: the template for regions.
            - register.html: register page.
            - southamerica.html: the region of South America.
            - southasia.html: the region of South Asia.
    - admin.py: Django admin management of database rows.
    - models.py: I defined the model User and New.
    - urls.py: path to each region, to /region/news and /report.
    - views.py: the implementation of urls views.
```

## How to run the application

Just like any other Django project:

`python manage.py runserver`

## Conclusions

TravHealth is an idea I had a couple of years ago, and I wanted to take advantage of the final project of CS50w course to implement it. Right now the application is only a toy-project, a reduced version of what TravHealt could be (for example extending the region concept to each state of the world, not only the six major regions identified, or connecting WHO to a kind of `superuser` that can edit news all over the world). People that travel frequently could use TravHealth to consult information about latest pandemic rules, about regional diseases in exotic countries, about vaccines to be made before travelling. And doctors could use TravHealth to reasses the patien history before the care, to benefit from TravHealth having their backs.    
