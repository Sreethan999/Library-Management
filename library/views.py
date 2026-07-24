from django.db.models import Q

from .models import Book, User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import BookSerializer, UserSerializer


# ==================================================
# BOOK REST APIs
# ==================================================

@api_view(["GET", "POST"])
def api_books(request):

    # -----------------------------
    # GET ALL BOOKS
    # -----------------------------
    if request.method == "GET":

        search = request.GET.get("search", "")

        books = Book.objects.filter(
            Q(title__icontains=search) |
            Q(author__icontains=search) |
            Q(isbn__icontains=search) |
            Q(category__icontains=search)
        )

        serializer = BookSerializer(
            books,
            many=True
        )

        return Response(serializer.data)

    # -----------------------------
    # ADD BOOK
    # -----------------------------
    elif request.method == "POST":

        title = request.data.get("title")
        author = request.data.get("author")
        isbn = request.data.get("isbn")

        # Prevent duplicate ISBN
        if Book.objects.filter(isbn=isbn).exists():
            return Response(
                {"error": "ISBN already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate title + author
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

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


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

    # Prevent duplicate ISBN
    if Book.objects.filter(isbn=isbn).exclude(id=id).exists():
        return Response(
            {"error": "ISBN already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prevent duplicate title + author
    if Book.objects.filter(
        title__iexact=title,
        author__iexact=author
    ).exclude(id=id).exists():
        return Response(
            {"error": "Book already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = BookSerializer(
        book,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


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
        status=status.HTTP_200_OK
    )

# ==================================================
# USER REST APIs
# ==================================================

@api_view(["GET", "POST"])
def api_users(request):

    # -----------------------------
    # GET ALL USERS
    # -----------------------------
    if request.method == "GET":

        users = User.objects.all()

        serializer = UserSerializer(
            users,
            many=True
        )

        return Response(serializer.data)

    # -----------------------------
    # ADD USER
    # -----------------------------
    elif request.method == "POST":

        email = request.data.get("email")

        # Prevent duplicate email
        if User.objects.filter(email=email).exists():

            return Response(
                {"error": "Email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
def api_update_user(request, id):

    try:
        user = User.objects.get(id=id)

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    email = request.data.get("email")

    # Prevent duplicate email
    if User.objects.filter(email=email).exclude(id=id).exists():

        return Response(
            {"error": "Email already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = UserSerializer(
        user,
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
def api_delete_user(request, id):

    try:
        user = User.objects.get(id=id)

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    user.delete()

    return Response(
        {"message": "User deleted successfully"},
        status=status.HTTP_200_OK
    )

# ==================================================
# BORROW & RETURN BOOK APIs
# ==================================================

@api_view(["POST"])
def borrow_book(request, book_id):

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    user_id = request.data.get("user_id")

    if not user_id:
        return Response(
            {"error": "User is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if not book.available:
        return Response(
            {"error": "Book is already borrowed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    book.available = False
    book.borrowed_by = user
    book.save()

    return Response(
        {
            "message": "Book borrowed successfully"
        },
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
def return_book(request, book_id):

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if book.available:
        return Response(
            {"error": "Book is already available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    book.available = True
    book.borrowed_by = None
    book.save()

    return Response(
        {
            "message": "Book returned successfully"
        },
        status=status.HTTP_200_OK
    )