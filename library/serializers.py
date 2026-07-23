from rest_framework import serializers
from .models import Book, User


class BookSerializer(serializers.ModelSerializer):

    borrowed_by_name = serializers.CharField(
        source="borrowed_by.name",
        read_only=True
    )

    class Meta:
        model = Book
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"