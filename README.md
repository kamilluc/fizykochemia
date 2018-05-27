# [Fizykochemia WWW](https://kamilluc.github.io/fizykochemia/) 

## 🙀Powinien was interesować tylko plik `/static/scripts/input.js` 
`/index.html` to główny plik, `/docs/index.html` to zmodyfikowana kopia do GitHub Pages

## ✔️Widok
Po załadowaniu strony, wybraniu pliku z danymi i wypełnieniu przemian możecie odpalić 2 metody:
`getInputData()` - zwraca string z pliku z danymi
`getInputSettings()` - zwraca dane z przemian fazowych

## ❌Obliczenia
Na wejściu dostajecie 2 obiekty przez `getInputData` i `getInputSettings`, kolejno string z zawartością pliku `Specific_Heat.txt` i wszystkie parametru procesu które wybrał użytkownik w UI, przykład w `input.json`

Zwracacie JSON z 2 tablicami, temp i entalpia

Możecie też zwrócić funkcje z rozkładem ciepła podczas przemiany (do dogadania)

## ❌Wyniki
JSON output to tylko 2 tablice = temp / entalpia

Wynik wprowadzić do tabeli tbody (wygeneruj w DOM tr/td)

Wykres wstawić do elementu o id="wykres" (zamiast tymczasowego żelazo-węgiel).

Trzeba by też wygenerować i zwrócić plik z wynikami (File API jak przy wczytywaniu pliku, i do tego jakis button, można skopiować taki jak "Oblicz")