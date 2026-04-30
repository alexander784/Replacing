from django.db import models
from django.conf import settings


class IDReplacementRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    # Relationship
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='id_replacement_requests'
    )
    
    full_name = models.CharField(max_length=150)
    student_number = models.CharField(max_length=50)
    course = models.CharField(max_length=100)
    year_of_study = models.CharField(max_length=20)
    
    # Uploaded Document
    id_photo = models.ImageField(
        upload_to='id_replace/photos/%Y/%m/%d/',
        help_text="Upload a clear passport photo"
    )
    
    reason = models.TextField(
        blank=True, 
        help_text="Why do you need a replacement ID? (Lost, Damaged, Stolen, etc.)"
    )
    
    # Status
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    
    rejection_reason = models.TextField(
        blank=True, 
        null=True,
        help_text="Reason why the request was rejected (visible to student)"
    )
    
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_replacements'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "ID Replacement Request"
        verbose_name_plural = "ID Replacement Requests"

    def __str__(self):
        return f"{self.student_number} - {self.get_status_display()}"

    @property
    def is_pending(self):
        return self.status == 'pending'