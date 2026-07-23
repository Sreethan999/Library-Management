from django.urls import path
from . import views

urlpatterns = [
    # Existing Django template routes
    path('', views.home, name='home'),
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:id>/', views.edit_book, name='edit_book'),
    path('delete/<int:id>/', views.delete_book, name='delete_book'),
    path('status/<int:id>/', views.toggle_status, name='toggle_status'),

    # React API
    path('api/books/', views.api_books, name='api_books'),
    path('api/books/<int:id>/', views.api_delete_book, name='api_delete_book'),
    path('api/books/update/<int:id>/', views.api_update_book),
]