\-- Working on parser 

Parsing from bank file \& Tally File 



BaseParser -> parse() -> load\_config()



↓



read\_excel()



↓



select\_sheet()



↓



map\_headers()



↓



validate\_headers()



↓



extract\_transactions()



\-- Working on Reconciliation Engine 



SO How do we know both entries from both files match 

for that we need to define confidence level 

depending on how many properties actually match



so for now I am going to define -> 



* Rule 1 (100%)



Reference matches AND Amount matches



↓



Matched.





* Rule 2 (95%)



Reference missing while Amount matches \& Date matches



↓



Likely matched.





* Rule 3 (90%)



Reference missing while Amount matches \& Description similar



↓



Likely matched.





* Rule 4 (80%)



Description similar \& Amount similar also Date within ±2 days



↓



Possible match.



## Reconciliation Engine V1



By the end of V1, the user should be able to:

* Upload Bank Statement
* Upload Tally Export
* Parse both successfully
* Compare transactions
* Receive a JSON report















