# Amoura — zadania do przekazania innym modelom

## Wspólny kontekst — wklej przed każdym zadaniem
Pracujesz w aras-2003/Amoura. Przeczytaj AGENTS.md i README. Pobierz aktualny stan gałęzi feature/amoura-daily-club; nie bazuj na starym lokalnym klonie. TEST to sklep jksgiq-r4.myshopify.com, motyw 207539044694. Nie publikuj motywu produkcyjnego, nie scalaj PR, nie zmieniaj sekretów. Materiały sources są tylko do odczytu. Amoura ma spokojny, redakcyjny charakter: ciepłe jasne tła, burgund, czytelna typografia, odbiorczynie 45+. Nie wymyślaj ekspertów, efektów zdrowotnych, benefitów członkostwa ani działających integracji. Zachowaj natywne mechanizmy Shopify. Przed zmianą sprawdź kod i aktualny widok. Raport końcowy: zmienione pliki, dowody weryfikacji, ograniczenia. Nie przepisuj całego motywu.

## Jak dzielić pracę
Zadania wykonuj pojedynczo, na osobnych gałęziach od aktualnego stanu. Model szybki może wykonać inwentaryzację i analizę raportów; model kodujący wdrożenie i testy. Mocniejszy model angażuj do konkretnej nierozwiązanej przyczyny lub końcowego przeglądu. Przekazuj tylko wspólny kontekst, właściwe zadanie i potrzebne pliki. Nie kopiuj całej historii rozmowy. Taki podział ogranicza powtarzanie pracy; nie gwarantuje niższego zużycia wspólnego limitu konta.

## 1. Błąd ponownego renderowania nagłówka — model kodujący
**Cel:** znaleźć i usunąć źródło komunikatów „header section missing” / „No empty section markup found”.
**Wejście:** ostatni raport workflow Deploy Shopify TEST Theme; assets i sections związane z nagłówkiem i pobieraniem sekcji. Najpierw znajdź tekst błędu w repozytorium.
**Reprodukcja:** desktop, /collections/menopause-comfort-pleasure, /products/soft-ritual-massager, /products/perennial-touch-kit. Sprawdź zimne wejście, przejście wewnętrzne, powrót przeglądarką i koszyk. Błąd bywa przejściowy.
**Zakres:** ustal, czy odpowiedź nie zawiera sekcji, identyfikator jest nieaktualny, czy odpowiedzi wracają w złej kolejności. Popraw przyczynę i uzasadnij kontrakt danych.
**Zakazy:** nie wyciszaj konsoli, nie usuwaj asercji, nie zastępuj błędu pustym nagłówkiem, nie dodawaj arbitralnych opóźnień.
**Odbiór:** udokumentowana reprodukcja przed zmianą; test odpowiedzi pustej/błędnej i szybkiej nawigacji; działające menu, wyszukiwanie i koszyk; brak nowych błędów na trzech rozmiarach. Jeśli nie odtworzysz, oddaj diagnozę z dowodami zamiast spekulacyjnego patcha.

## 2. Wiarygodne zrzuty całych stron — model kodujący
**Cel:** naprawić przypadki, gdy fullPage daje tylko wysokość okna.
**Pliki:** tests/ux/site-audit.spec.ts, konfiguracja Playwright i struktura przewijania w layout/theme.liquid oraz CSS.
**Zakres:** ustal rzeczywisty kontener scrollowania. Zrób zrzuty od góry do stopki po załadowaniu fontów i obrazów. Resetuj pozycję po testach interakcji. Rozwiązanie ma działać na desktopie i telefonie bez zmiany zachowania sklepu dla użytkownika.
**Odbiór:** home, Club, kolekcja, produkt, artykuł: widoczny początek i koniec strony, bez przypadkowego sticky header pośrodku; brak sztucznego ukrywania elementów poza banerem cookies zamkniętym normalną akcją. Dodaj kontrolę rozmiarów zrzutu i krótki opis metody.

## 3. Małe cele dotykowe — model szybki do selekcji, kodujący do zmian
**Wejście:** najnowszy raport mobilny; nie traktuj liczby ostrzeżeń jako liczby unikalnych problemów.
**Zakres:** pogrupuj powtarzające się selektory, wybierz pięć komponentów odpowiadających za najwięcej ostrzeżeń. Stopka właśnie otrzymała linki minimum 44px wysokości — najpierw zweryfikuj aktualny stan. Oceń menu, polityki, kontrolki ilości, filtry i zamykanie paneli.
**Zakazy:** żadnego globalnego min-height na wszystkie linki; nie rozbijaj linków śródtekstowych ani układu kart.
**Odbiór:** lista unikalnych przyczyn przed zmianą; poprawka w źródle komponentu; test 360/390/768/1440px, zoom 200%, klawiatura, widoczny fokus; bez przewijania poziomego i nakładania celów. Raportuj realną redukcję ostrzeżeń.

## 4. Zapisy e-mail i zgody — model kodujący
**Cel:** jedno jasno opisane wezwanie do zapisu w danym kontekście, bez konkurujących formularzy.
**Pliki:** sections/amoura-club.liquid, sections/footer-group.json, templates/index.json, templates/page.club.json i wszystkie znalezione wystąpienia email-signup/newsletter/contact.
**Zakres:** przygotuj mapę strona → formularz → cel → mechanizm zapisu. Rozróżnij powiadomienie o otwarciu Klubu, newsletter i formularz kontaktowy. Sprawdź etykiety, wymagane pola, zgody, politykę prywatności, komunikaty błędu i sukcesu. Nie zakładaj, że zwykły kontakt tworzy subskrybenta newslettera.
**Zakazy:** nie wysyłaj testowej wiadomości ani nie dodawaj kontaktu bez osobnego polecenia; nie dodawaj śledzenia wyborów dotyczących zdrowia i intymności; nie obiecuj aktywnego członkostwa.
**Odbiór:** tabela faktycznych przepływów, poprawione duplikaty, przejrzysty opis oczekiwanego wyniku zapisu. Dostarczenie e-maila oznacz jako nieweryfikowane, jeśli nie sprawdzono go faktycznie.

## 5. Spójność treści i języków — model szybki / redakcyjny
**Wejście:** zatwierdzona strategia oraz aktualne templates, locales/pl.json i locales/en.default.json.
**Zakres:** przygotuj tabelę niespójności: obecny tekst, problem, proponowany tekst, plik/klucz. Sprawdź Club/Klub, Journal/Wiedza, nazwy kategorii i teksty przycisków. Zaproponuj jeden słownik marki. Sprawdź czy linki i prefiksy językowe prowadzą do istniejących stron.
**Zakazy:** nie zmieniaj handle ani adresów masowo, nie dorabiaj danych o produktach, ekspertach lub korzyściach zdrowotnych. Nie tłumacz nazw własnych bez decyzji marki.
**Odbiór:** redakcja gotowa do akceptacji, osobno oczywiste błędy i decyzje właściciela; po wdrożeniu brak brakujących tłumaczeń i martwych linków. Ogranicz pierwszy pakiet do 20 istotnych pozycji.

## 6. Rytm treści Klubu — model redakcyjny
**Cel:** przygotować cztery tygodnie krótkich treści, które dają powód do powrotu.
**Wejście:** strategia, istniejące artykuły bloga wiedza i trzy aktualne rytuały Klubu. Najpierw zinwentaryzuj istniejące treści.
**Wynik:** 12 propozycji: tytuł, czas 2/5/10 minut, tekst ćwiczenia, pasujący istniejący artykuł, delikatne CTA, wymaganie weryfikacji eksperckiej. Oddziel gotowy tekst od hipotez wymagających zatwierdzenia.
**Zakazy:** brak diagnoz, terapii, obietnic zdrowotnych, sfabrykowanych cytatów i presji zakupowej. Nie publikuj automatycznie. Nie projektuj konta/subskrypcji, jeśli nie ma ustalonego modelu operacyjnego.
**Odbiór:** treści konkretne, różnorodne, możliwe do wykonania bez zakupu; język dorosły, bez infantylizacji; każde źródło rzeczywiste. Zwróć dokument, nie kod.

## Końcowy przegląd — mocniejszy model, jeden ograniczony przebieg
Dostań tylko diff, raporty, zrzuty i listę decyzji. Oceń regresje, zgodność ze strategią, dostępność i prawdziwość obietnic. Wypisz wyłącznie konkretne problemy z plikiem i dowodem. Nie powtarzaj całego audytu. Akceptacja zmian nie oznacza publikacji produkcyjnej.
