from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CustomTokenObtainPairView, UserProfileView, ChangePasswordView, ForgotPasswordView, ResetPasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register', CreateUserView.as_view(), name="register"),
    path('api/auth/login', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/auth/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('api-auth/', include('rest_framework.urls')),
]
