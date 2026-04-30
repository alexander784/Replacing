from django.urls import path
from .views import (
    StudentRegisterView,
    LoginView,
    LogoutView,
    StudentProfileView,
)

urlpatterns = [
    path('register/', StudentRegisterView.as_view(), name='student-register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('profile/', StudentProfileView.as_view(), name='student-profile'),
]