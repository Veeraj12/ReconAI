from django.shortcuts import render
from django.http import JsonResponse

from .services.reconciliationService import ReconciliationService


def index(request):
    return render(request, "parser/index.html")


def upload_files(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False
        })

    bank_file = request.FILES.get("bank_file")
    tally_file = request.FILES.get("tally_file")

    if not bank_file or not tally_file:
        return JsonResponse({
            "success": False,
            "error": "Both bank_file and tally_file are required."
        }, status=400)

    try:
        result = ReconciliationService().reconcile(bank_file, tally_file)
    except ValueError as error:
        # Expected, user-fixable problems: missing columns, unsupported
        # file type, etc. — surface the message as-is.
        return JsonResponse({
            "success": False,
            "error": str(error)
        }, status=400)
    except Exception as error:
        # Anything unexpected still comes back as JSON (never a raw
        # 500 HTML page) so the frontend can show something sane.
        return JsonResponse({
            "success": False,
            "error": f"Reconciliation failed: {error}"
        }, status=500)

    return JsonResponse(result)