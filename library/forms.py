from django import forms
from .models import Book, User


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'isbn']


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'email', 'phone']