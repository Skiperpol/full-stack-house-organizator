Oxlint jest nowszy i szybszy od ESLinta, natomiast mniej rozbudowany.

React Compiler sam optymalizuje kod przez co nie trzeba używać useMemo czy useCallback.

Vite do paneli za logowaniem.

NextJS do szybkich i przyjaznych dla SEO stron.

TanStack Router jest bardziej bezpieczny od React Router V7 ze względu na typowanie. A więc jak ma się dużo pracy z URL, warto użyć TanStacka.

Warto znać Rules of React aby pisać dobry kod.

Przedrostki przy komentarzach:
- feat: (feature) – Nowa funkcjonalność dla użytkownika.
- fix: (bug fix) – Naprawa błędu w działaniu aplikacji.
- chore: (maintenance) – Prace konfiguracyjne, narzędziowe i techniczne. Zmiany te nie wpływają bezpośrednio na kod produkcyjny ani widoczną funkcjonalność.
- docs: (documentation) – Zmiany dotyczące wyłącznie dokumentacji.
- refactor: (refactoring) – Zmiana w strukturze lub organizacji kodu, która nie zmienia działania aplikacji ani nie naprawia błędu.
- style: (styling/formatting) – Zmiany dotyczące formatowania kodu lub wyglądu (bez zmiany logiki).
- test: (testing) – Dodanie lub poprawa testów automatycznych.
- perf: (performance) – Zmiana kodu mająca na celu poprawę wydajności aplikacji.
- ci: (continuous integration) – Zmiany w plikach konfiguracyjnych potoków CI/CD.

vite.config.ts - Konfiguracja serwera deweloperskiego i budowania aplikacji Vite 
tsconfig.json - Główny spis treści łączący pozostałe pliki TypeScriptu
tsconfig.app.json - Konfiguracja typów dla Reacta i przeglądarki (folder src/)
tsconfig.node.json - Konfiguracja typów dla narzędzi budujących (np. vite.config.ts)

Jako że tworzę aplikację w strukturze monorepo to będę używał OpenAPI + Orval aby nie musieć kopiować typów między projektami