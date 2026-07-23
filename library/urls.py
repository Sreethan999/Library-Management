from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),

    path("add/", views.add_book, name="add_book"),
    path("edit/<int:id>/", views.edit_book, name="edit_book"),
    path("delete/<int:id>/", views.delete_book, name="delete_book"),
    path("toggle/<int:id>/", views.toggle_status, name="toggle_status"),

    # Users
    path("users/", views.users, name="users"),
    path("users/add/", views.add_user, name="add_user"),
    path("users/edit/<int:id>/", views.edit_user, name="edit_user"),
    path("users/delete/<int:id>/", views.delete_user, name="delete_user"),
    path("books/<int:book_id>/borrow/", views.borrow_book, name="borrow_book"),
    path("books/<int:book_id>/return/", views.return_book, name="return_book"),

    # APIs...
]