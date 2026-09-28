# Handoff 01 — diagnoza błędu renderowania nagłówka

## Status

Nie wprowadzono spekulacyjnego patcha. Aktualny TEST Shopify jest niedostępny dla wdrożenia/weryfikacji: ostatnia próba opisana w PR #3 zakończyła się HTTP 402 `Unavailable Shop` (run 36415909191). Zadanie w `docs/MODEL_HANDOFFS.md` wymaga reprodukcji na realnym TEST przed zmianą; dlatego przy braku możliwości odtworzenia zachowujemy kod i dokumentujemy sprawdzone miejsca ryzyka.

## Co zostało sprawdzone

### 1. Źródło komunikatu `No empty section markup found`

Komunikat pochodzi z `assets/predictive-search.js`, z resetu wyszukiwarki:

- pobierana jest sekcja `predictive-search-empty` przez `sectionRenderer.getSectionHTML(...)`;
- odpowiedź jest parsowana i wyszukiwany jest `.predictive-search-empty-section`;
- brak tego elementu kończy się wyjątkiem `No empty section markup found`.

W tym samym kodzie tworzony jest lokalny `AbortController`, ale jego `signal` nie jest przekazywany do `getSectionHTML`. To oznacza, że poprzedni request nie jest faktycznie anulowany na poziomie fetch; kontroler służy tylko do odrzucenia wyniku po jego zakończeniu. Jest to potencjalna przyczyna wyścigu przy szybkich kolejnych resetach/wyszukiwaniach, ale bez reprodukcji na TEST nie należy jeszcze zmieniać kontraktu.

### 2. Ponowne renderowanie nagłówka

`sections/header.liquid` uruchamia hydrację po stronie klienta:

```js
import { hydrate } from '@theme/section-hydration';
const url = new URL(window.location.href);
url.searchParams.delete('page');
hydrate('{{ section.id }}', url);
```

`assets/section-hydration.js` przekazuje identyfikator do `sectionRenderer.renderSection(...)`.

`assets/section-renderer.js`:
- buduje URL przez `section_id=<normalized id>`;
- wykonuje `fetch(...).then(response => response.text())`;
- nie sprawdza `response.ok`, Content-Type ani obecności oczekiwanej sekcji przed zapisaniem odpowiedzi do cache;
- dopiero `morphSection` sprawdza, czy odpowiedź zawiera element `#shopify-section-<sectionId>`.

Jeżeli Section Rendering API zwróci stronę błędu, stronę blokady, 429/4xx/5xx albo inną odpowiedź HTML niezawierającą sekcji, obecny kod potraktuje ją jak poprawny HTML. To wyjaśnia klasę błędów „section missing”, ale nie dowodzi jeszcze, że właśnie taki response wystąpił w raportowanym przypadku.

### 3. Dowód na charakter przejściowy / ograniczenie środowiska

PR #3 dokumentuje:
- wcześniejszy deployed audit obejmował 30 tras i ujawnił istniejące, przerywane błędy renderowania nagłówka;
- późniejsza próba deploymentu 28.09 zakończyła się przed uploadem błędem Shopify HTTP 402 `Unavailable Shop`;
- nowsze zmiany nie mają pełnej walidacji na realnym TEST.

Dodatkowo `tests/ux/site-audit.spec.ts` ma retry dla głównej nawigacji HTTP 429, ale requesty Section Rendering API wykonywane w przeglądarce nie mają analogicznego raportowania statusu. W obecnym raporcie trudno więc rozróżnić: błędny section id, brak sekcji w poprawnej odpowiedzi, 429/4xx/5xx lub odpowiedź zwróconą w złej kolejności.

## Najbardziej prawdopodobne hipotezy do rozstrzygnięcia

1. **Niepoprawna odpowiedź HTTP z Section Rendering API** trafia do parsera jako poprawny HTML, ponieważ `getSectionHTML` nie waliduje statusu odpowiedzi.
2. **Wyścig predictive search**: lokalny AbortController nie anuluje fetch w `getSectionHTML`, więc stary request może zakończyć się po nowszym.
3. **Identyfikator nagłówka** może być poprawny, ale odpowiedź dla konkretnej trasy może nie zawierać wrappera oczekiwanego przez `morphSection`. Trzeba zapisać URL, status i fragment odpowiedzi z realnej reprodukcji, zamiast zgadywać.

## Następny przebieg po przywróceniu TEST

Na desktopie oraz 390/768/1440 px wykonać dla:
- `/collections/menopause-comfort-pleasure`
- `/products/soft-ritual-massager`
- `/products/perennial-touch-kit`

Scenariusze:
1. zimne wejście,
2. przejście wewnętrzne,
3. back/forward,
4. otwarcie wyszukiwania i szybkie wpisanie/reset,
5. koszyk.

Dla każdego requestu z `section_id` zapisać:
- URL,
- section id,
- status HTTP,
- Content-Type,
- długość odpowiedzi,
- czy odpowiedź zawiera oczekiwany wrapper,
- kolejność start/finish requestów.

Dopiero po tym:
- jeśli status jest błędny — poprawić obsługę kontraktu HTTP i nie cache'ować odpowiedzi błędnych;
- jeśli identyfikator jest nieaktualny — poprawić źródło identyfikatora;
- jeśli potwierdzi się wyścig — spiąć AbortSignal z fetch i dodać test szybkiej nawigacji/resetu.

## Pliki przejrzane

- `AGENTS.md`
- `README.md`
- `docs/MODEL_HANDOFFS.md`
- `assets/section-renderer.js`
- `assets/section-hydration.js`
- `assets/predictive-search.js`
- `assets/header.js`
- `assets/header-menu.js`
- `assets/header-drawer.js`
- `assets/header-actions.js`
- `sections/header.liquid`
- `sections/header-group.json`
- `tests/ux/site-audit.spec.ts`
- `tests/global.setup.ts`
- PR #3 i jego opis walidacji/deploymentu
