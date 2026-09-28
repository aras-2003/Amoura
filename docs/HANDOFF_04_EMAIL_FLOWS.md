# Handoff 04 — zapisy e-mail i zgody

## Mapa faktycznych przepływów

| Strona / komponent | Formularz | Cel widoczny dla użytkowniczki | Mechanizm Shopify | Efekt, który można uczciwie deklarować |
| --- | --- | --- | --- | --- |
| `/pages/klub-amoura` | `AmouraClub-*` w `sections/amoura-club.liquid` | prośba o wiadomość przy otwarciu Klubu | `form 'contact'` | wysłanie zgłoszenia kontaktowego z adresem e-mail; **nie** newsletter i **nie** członkostwo |
| `/pages/contact` | `ContactForm-*` | kontakt z Amoura | `form 'contact'` | wysłanie wiadomości kontaktowej |
| blok `email-signup` | brak w aktualnej stopce i stronie Klubu | newsletter, jeśli zostanie kiedyś użyty | `form 'customer'` | profil/subskrypcja klienta zgodnie z natywnym mechanizmem Shopify |

## Stan po przeglądzie

- Na stronie głównej jest zaproszenie do Klubu, ale nie ma konkurującego formularza e-mail.
- Stopka nie zawiera formularza newslettera.
- Strona Klubu zawiera jeden formularz e-mail związany wyłącznie z powiadomieniem o otwarciu.
- Formularz kontaktowy pozostaje osobnym przepływem.
- Nie testowano faktycznego dostarczenia wiadomości i nie wysłano danych testowych.

## Zasada

Nie używamy copy sugerującego newsletter lub aktywne członkostwo, dopóki mechanizm Klubu działa jako zwykły formularz kontaktowy. Jeżeli później ma powstać newsletter, należy użyć osobnego przepływu `form 'customer'` i osobnej zgody/copy.
