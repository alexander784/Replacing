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
    path('id_replace/', StudentReplacementListCreate.as_view(), name='id_replace'),
    path('id_replace/<int:pk>/', StudentReplacementDetail.as_view(), name='id_replace-detail'),

    path('admin/id_replace/', AdminReplacementList.as_view(), name='id_replace-list'),
    path('admin/id_replace/<int:pk>/', AdminReplacementDetail.as_view(), name='id_replace-detail'),
    path('admin/id_replace/<int:pk>/approve/', ApproveReplacementView.as_view(), name='approve-replacement'),
    path('admin/id_replace/<int:pk>/reject/', RejectReplacementView.as_view(), name='reject-replacement'),
]