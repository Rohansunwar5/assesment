from django.utils import timezone
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile
from .serializers import ChangePasswordSerializer, CustomTokenObtainPairSerializer, UserProfileSerializer, UserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if check_password(serializer.data['old_password'], user.password):
                user.set_password(serializer.data['new_password'])
                profile, created = UserProfile.objects.get_or_create(user=user)
                profile.last_password_change = timezone.now()
                profile.save()
                user.save()
                return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password reset instructions sent to your email"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('password')

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return Response(
                    {"error": "Invalid or expired token."},
                    status=status.HTTP_400_BAD_REQUEST
                )


            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password has been reset successfully"},
                status=status.HTTP_200_OK
            )
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Invalid link or user does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )