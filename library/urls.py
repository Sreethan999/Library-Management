from django.urls import path
from . import views

urlpatterns = [

    # ==========================================
    # BOOK REST APIs
    # ==========================================

    path("api/books/", views.api_books, name="api_books"),
    path("api/books/<int:id>/", views.api_update_book, name="api_update_book"),
    path(
        "api/books/<int:id>/delete/",
        views.api_delete_book,
        name="api_delete_book",
    ),

    # ==========================================
    # USER REST APIs
    # ==========================================

    path("api/users/", views.api_users, name="api_users"),
    path("api/users/<int:id>/", views.api_update_user, name="api_update_user"),
    path(
        "api/users/<int:id>/delete/",
        views.api_delete_user,
        name="api_delete_user",
    ),

    # ==========================================
    # BORROW / RETURN APIs
    # ==========================================

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