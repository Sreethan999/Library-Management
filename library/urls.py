from django.urls import path
from . import views

urlpatterns = [

    # ==================================================
    # TEMPLATE VIEWS
    # ==================================================

    path("", views.home, name="home"),

    # Book Pages
    path("add/", views.add_book, name="add_book"),
    path("edit/<int:id>/", views.edit_book, name="edit_book"),
    path("delete/<int:id>/", views.delete_book, name="delete_book"),
    path("toggle/<int:id>/", views.toggle_status, name="toggle_status"),

    # User Pages
    path("users/", views.users, name="users"),
    path("users/add/", views.add_user, name="add_user"),
    path("users/edit/<int:id>/", views.edit_user, name="edit_user"),
    path("users/delete/<int:id>/", views.delete_user, name="delete_user"),

    # ==================================================
    # TEMPLATE BORROW / RETURN
    # ==================================================

    path(
        "borrow/<int:book_id>/",
        views.borrow_book_page,
        name="borrow_book",
    ),

    path(
        "return/<int:book_id>/",
        views.return_book_page,
        name="return_book",
    ),

    # ==================================================
    # BOOK REST APIs
    # ==================================================

    path("api/books/", views.api_books, name="api_books"),
    path("api/books/<int:id>/", views.api_update_book, name="api_update_book"),
    path(
        "api/books/<int:id>/delete/",
        views.api_delete_book,
        name="api_delete_book",
    ),

    # ==================================================
    # USER REST APIs
    # ==================================================

    path("api/users/", views.api_users, name="api_users"),
    path("api/users/<int:id>/", views.api_update_user, name="api_update_user"),
    path(
        "api/users/<int:id>/delete/",
        views.api_delete_user,
        name="api_delete_user",
    ),

    # ==================================================
    # REACT API BORROW / RETURN
    # ==================================================

    path(
        "api/books/<int:book_id>/borrow/",
        views.borrow_book,
        name="api_borrow_book",
    ),

    path(
        "api/books/<int:book_id>/return/",
        views.return_book,
        name="api_return_book",
    ),
]