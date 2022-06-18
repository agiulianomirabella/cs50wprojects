from django import forms
from django.shortcuts import render, redirect

import random as rd
import markdown2

from . import util

class NewEntryForm(forms.Form):
    title = forms.CharField(required=True, label='Title')
    content = forms.CharField(required=True, widget=forms.Textarea)

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):

    entries_titles = util.list_entries()

    if title in entries_titles:
        content = util.get_entry(title)
        print(content)
        content = markdown2.markdown(content)
        print(content)
    else:
        content = 'Sorry, this entry does not exist.'

    return render(request, "encyclopedia/entry.html", {
        'title': title,
        'content': content
    })

def search(request):

    title = request.GET['q']

    entries_titles = util.list_entries()

    if title in entries_titles:
        return redirect('entry', title) # I found this method on the internet
    else:
        similar_entries = [e for e in entries_titles if title.lower() in e.lower()]

        return render(request, "encyclopedia/search.html", {
            "entries": similar_entries
        })

def new(request):
    if request.method == 'POST':
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            content = form.cleaned_data['content']

            entries = util.list_entries()
            if not title in entries:
                util.save_entry(title, f'# {title}\n{content}\n')
                return redirect('entry', title)
            else:
                return render(request, 'encyclopedia/new.html', {
                    'form': NewEntryForm(),
                    'already_exists': True,
                    'error': 'Error: this entry already exists.'
                })


    return render(request, 'encyclopedia/new.html', {
        'form': NewEntryForm(), 
        'already_exists': False
    })

def edit(request):
    if request.method == 'POST':
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            content = form.cleaned_data['content']

            util.save_entry(title, f'{content}')
            return redirect('entry', title)

    title = request.GET['title']
    content = util.get_entry(title)
    return render(request, 'encyclopedia/edit.html', {
        'form': NewEntryForm(initial={'title': title, 'content':content}), 
    })

def random(request):
    return redirect('entry', rd.choice(util.list_entries()))