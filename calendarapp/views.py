from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import DeleteView, ListView
from django.conf import settings
import json
from .models import Memo

#  メモ一覧（ログインユーザーのみ取得）
@method_decorator(login_required, name='dispatch')
class MemoListView(LoginRequiredMixin, ListView):
    model = Memo
    template_name = "memo_list.html"
    context_object_name = "memos"

    def get_queryset(self):
        return Memo.objects.filter(user=self.request.user).order_by("-date", "-id")

# ✅ メモを取得（ログインユーザーのみ）
@login_required
def get_memos(request):
    memos = {}
    user_memos = Memo.objects.filter(user=request.user)

    for memo in user_memos:
        if memo.date not in memos:
            memos[memo.date] = []
        memos[memo.date].append(memo.text)  

    return JsonResponse({"memos": memos})

#  メモを保存
@csrf_exempt
@login_required
def save_memo(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            date = data.get("date")
            text = data.get("text", "").strip()

            if not date or not text:
                return JsonResponse({"error": "日付またはメモが空です"}, status=400)

            Memo.objects.create(user=request.user, date=date, text=text)

            return JsonResponse({"message": "メモを保存しました", "date": date, "text": text}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "POSTリクエストのみ対応しています"}, status=400)

# ✅ メモを削除（ログインユーザーのみ）
@csrf_exempt
@login_required
def delete_memo(request):
    template_name = "memo_confirm_delete.html"
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            date = data.get("date")
            text = data.get("text", "").strip()

            if not date or not text:
                return JsonResponse({"error": "日付またはメモが空です"}, status=400)

            memo = Memo.objects.filter(user=request.user, date=date, text=text).first()
            if memo:
                memo.delete()
                return JsonResponse({"message": "メモを削除しました"}, status=200)
            else:
                return JsonResponse({"error": "該当のメモが見つかりません"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "POSTリクエストのみ対応しています"}, status=400)

# ✅ メモ削除のクラスベースビュー
class MemoDeleteView(LoginRequiredMixin, DeleteView):
    model = Memo
    template_name = "memo_confirm_delete.html"
    success_url = reverse_lazy("calendarapp:memo_list")  # 名前空間を含めて修正
    
    def get_queryset(self):
        return Memo.objects.filter(user=self.request.user)  # ユーザーのメモのみ削除可能
# 祝日の取得※なぜか動かないので未実装
# import jpholiday
# import datetime
# from django.http import JsonResponse

# def get_holidays(request, year):
#     holidays = {}
#     for month in range(1, 13):
#         for day in range(1, 32):
#             try:
#                 date = datetime.date(year, month, day)
#                 name = jpholiday.is_holiday_name(date)  # ✅ 正しいメソッド
#                 if name:
#                     holidays[date.strftime("%Y-%m-%d")] = name
#             except ValueError:
#                 continue
#     return JsonResponse(holidays)