from django.shortcuts import render, redirect
from django.db.models import Q

from .models import Book
from .forms import BookForm

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import BookSerializer


# =====================================
# DJANGO TEMPLATE VIEWS
# =====================================

def home(request):
    query = request.GET.get('q')

    if query:
        books = Book.objects.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(isbn__icontains=query) |
            Q(category__icontains=query)
        )
    else:
        books = Book.objects.all()

    return render(request, "library/home.html", {
        "books": books,
        "query": query
    })


def add_book(request):

    if request.method == "POST":

        form = BookForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("home")

    else:
        form = BookForm()

    return render(request, "library/add_book.html", {
        "form": form
    })


def edit_book(request, id):

    book = Book.objects.get(id=id)

    if request.method == "POST":

        form = BookForm(request.POST, instance=book)

        if form.is_valid():
            form.save()
            return redirect("home")

    else:

        form = BookForm(instance=book)

    return render(request, "library/edit_book.html", {
        "form": form
    })


def delete_book(request, id):

    book = Book.objects.get(id=id)
    book.delete()

    return redirect("home")


def toggle_status(request, id):

    book = Book.objects.get(id=id)

    book.available = not book.available

    book.save()

    return redirect("home")


# =====================================
# REACT API
# =====================================

@api_view(["GET", "POST"])
def api_books(request):

    # -------------------------
    # GET BOOKS
    # -------------------------

    if request.method == "GET":

        search = request.GET.get("search", "")

        books = Book.objects.filter(

            Q(title__icontains=search) |
            Q(author__icontains=search) |
            Q(isbn__icontains=search) |
            Q(category__icontains=search)

        )

        serializer = BookSerializer(books, many=True)

        return Response(serializer.data)

    # -------------------------
    # ADD BOOK
    # -------------------------

    elif request.method == "POST":

        title = request.data.get("title")
        author = request.data.get("author")
        isbn = request.data.get("isbn")

        # Duplicate ISBN

        if Book.objects.filter(isbn=isbn).exists():

            return Response(
                {"error": "ISBN already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Duplicate Book

        if Book.objects.filter(
            title__iexact=title,
            author__iexact=author
        ).exists():

            return Response(
                {"error": "Book already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =====================================
# DELETE BOOK
# =====================================

@api_view(["DELETE"])
def api_delete_book(request, id):

    try:

        book = Book.objects.get(id=id)

    except Book.DoesNotExist:

        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    book.delete()

    return Response(
        {"message": "Book deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )


# =====================================
# UPDATE BOOK
# =====================================

@api_view(["PUT"])
def api_update_book(request, id):

    try:

        book = Book.objects.get(id=id)

    except Book.DoesNotExist:

        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    title = request.data.get("title")
    author = request.data.get("author")
    isbn = request.data.get("isbn")

    # Duplicate ISBN

    if Book.objects.filter(isbn=isbn).exclude(id=id).exists():

        return Response(
            {"error": "ISBN already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Duplicate Book

    if Book.objects.filter(
        title__iexact=title,
        author__iexact=author
    ).exclude(id=id).exists():

        return Response(
            {"error": "Book already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = BookSerializer(book, data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )