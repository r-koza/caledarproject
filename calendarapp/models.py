from django.db import models
from django.conf import settings  # 設定からカスタムユーザーを取得

class Memo(models.Model):
    date = models.CharField(max_length=10) 
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # メモの作成日時
    updated_at = models.DateTimeField(auto_now=True)  # メモの更新日時（自動更新）
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ 修正: カスタムユーザー対応

    def __str__(self):
        return f"{self.date} ({self.user.username}): {self.text[:20]}"  # 先頭20文字を表示