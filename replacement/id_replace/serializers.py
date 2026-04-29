from rest_framework import serializers
from .models import IDReplacementRequest
from accounts.models import User, StudentProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['full_name', 'course', 'year_of_study', 'phone_number']


class IDReplacementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDReplacementRequest
        fields = ['full_name', 'student_number', 'course', 'year_of_study', 
                 'id_photo', 'reason']
        read_only_fields = ['student', 'status']

    def validate(self, attrs):
        # Auto-fill student info if not provided
        request = self.context['request']
        if not attrs.get('full_name'):
            attrs['full_name'] = request.user.student_profile.full_name
        if not attrs.get('student_number'):
            attrs['student_number'] = request.user.student_number
        return attrs


class IDReplacementListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = IDReplacementRequest
        fields = ['id', 'full_name', 'student_number', 'status', 
                 'status_display', 'created_at', 'updated_at']


class AdminReplacementDetailSerializer(serializers.ModelSerializer):
    reviewed_by = serializers.EmailField(source='reviewed_by.email', read_only=True)

    class Meta:
        model = IDReplacementRequest
        fields = '__all__'


class RejectionSerializer(serializers.Serializer):
    rejection_reason = serializers.CharField(required=True, min_length=10)