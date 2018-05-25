# [Fizykochemia WWW](https://kamilluc.github.io/fizykochemia/)
# Widok
Po załadowaniu strony, wybraniu pliku z danymi i wypełnieniu przemian możecie odpalić 2 metody:
`getInputData()` - zwraca string z pliku z danymi
`getInputSettings()` - zwraca dane z przemian fazowych

# Obliczenia
Na wejściu dostajecie 2 obiekty przez `getInputData` i `getSettings`, kolejno string z zawartością pliku `Specific_Heat.txt` i wszystkie parametru procesu które wybrał użytkownik w UI, przykład w `input.json`
Zwracacie JSON z 2 tablicami, temp i entalpia
Możecie też zwrócić funkcje z rozkładem ciepła podczas przemiany (do dogadania)

# Wyniki
JSON output to tylko 2 tablice = temp / entalpia
Wynik wklej do tabeli tbody (wygeneruj w DOM tr/td)
Wykres wklej do elementu o id="wykres"
Można też wygenerować i zwrócić plik z wynikami