from django.shortcuts import render
from django.http import JsonResponse
from .parsers.bankParser import BankParser 
from .parsers.tallyParser import TallyParser
from .services.reconciliationService import ReconciliationEngine
def index(request):
    return render(request, "parser/index.html")


def upload_files(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False
        })

    bankFile = request.FILES.get("bank_file")

    tallyFile = request.FILES.get("tally_file")

  
    bankResult =  BankParser().parse(bankFile)
    tallyResult = TallyParser().parse(tallyFile)

    print(bankResult["transactions"],
    tallyResult["transactions"])
    return JsonResponse( ReconciliationEngine.reconcile(
    bankResult["transactions"],
    tallyResult["transactions"]
) )
