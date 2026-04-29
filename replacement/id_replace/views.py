from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import IDReplacementRequest
from serializers import (
    IDReplacementCreateSerializer,
    IDReplacementListSerializer,
    AdminReplacementDetailSerializer,
    RejectionSerializer
)
from accounts.permissions import IsStudent, IsAdminUser


class StudentReplacementListCreate(generics.ListCreateAPIView):
    permission_classes = [IsStudent]
    serializer_class = IDReplacementListSerializer

    def get_queryset(self):
        return IDReplacementRequest.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class StudentReplacementDetail(generics.RetrieveAPIView):
    permission_classes = [IsStudent]
    serializer_class = IDReplacementListSerializer

    def get_queryset(self):
        return IDReplacementRequest.objects.filter(student=self.request.user)


class AdminReplacementList(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = IDReplacementListSerializer
    queryset = IDReplacementRequest.objects.all().order_by('-created_at')


class AdminReplacementDetail(generics.RetrieveAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminReplacementDetailSerializer
    queryset = IDReplacementRequest.objects.all()


class ApproveReplacementView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        replacement = get_object_or_404(IDReplacementRequest, pk=pk)
        
        if replacement.status != 'pending':
            return Response({"error": "Request is no longer pending"}, status=status.HTTP_400_BAD_REQUEST)

        replacement.status = 'approved'
        replacement.reviewed_by = request.user
        replacement.save()

        # TODO: Send notification to student (email + in-app)

        return Response({
            "message": "ID Replacement request approved successfully",
            "status": "approved"
        }, status=status.HTTP_200_OK)


class RejectReplacementView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        replacement = get_object_or_404(IDReplacementRequest, pk=pk)
        serializer = RejectionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if replacement.status != 'pending':
            return Response({"error": "Request is no longer pending"}, status=status.HTTP_400_BAD_REQUEST)

        replacement.status = 'rejected'
        replacement.rejection_reason = serializer.validated_data['rejection_reason']
        replacement.reviewed_by = request.user
        replacement.save()

        # TODO: Send rejection notification with reason

        return Response({
            "message": "Request rejected",
            "rejection_reason": replacement.rejection_reason
        }, status=status.HTTP_200_OK)