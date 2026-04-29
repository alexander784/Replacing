from django.urls import path
from .views import (
    StudentReplacementListCreate,
    StudentReplacementDetail,
    AdminReplacementList,
    AdminReplacementDetail,
    ApproveReplacementView,
    RejectReplacementView,
)

urlpatterns = [
    # Student URLs
    path('replacements/', StudentReplacementListCreate.as_view(), name='student-replacements'),
    path('replacements/<int:pk>/', StudentReplacementDetail.as_view(), name='student-replacement-detail'),

    # Admin URLs
    path('admin/replacements/', AdminReplacementList.as_view(), name='admin-replacements-list'),
    path('admin/replacements/<int:pk>/', AdminReplacementDetail.as_view(), name='admin-replacement-detail'),
    path('admin/replacements/<int:pk>/approve/', ApproveReplacementView.as_view(), name='approve-replacement'),
    path('admin/replacements/<int:pk>/reject/', RejectReplacementView.as_view(), name='reject-replacement'),
]