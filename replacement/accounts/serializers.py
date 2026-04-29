# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile

User = get_user_model()


class StudentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'student_number']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            student_number=validated_data.get('student_number'),
            role='student'
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                if not user.is_active:
                    raise serializers.ValidationError("Account is disabled.")
                attrs['user'] = user
                return attrs
            raise serializers.ValidationError("Invalid email or password.")
        raise serializers.ValidationError("Must include 'email' and 'password'.")


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    student_number = serializers.CharField(source='user.student_number', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['email', 'student_number', 'full_name', 'course', 
                 'year_of_study', 'phone_number']

    def update(self, instance, validated_data):
        # Update StudentProfile
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.course = validated_data.get('course', instance.course)
        instance.year_of_study = validated_data.get('year_of_study', instance.year_of_study)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()

        return instance