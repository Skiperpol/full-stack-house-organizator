Cel:
Głównym celem aplikacji jest ułatwienie funkcjonowania domu pod względem organizacji codziennego życia.

Dla kogo:
Aplikacja jest przeznaczona dla osób, które potrzebują systemu do zarządzania swoim życiem domowym i nie tylko.

Główne funkcjonalności:
- lista todo wpsółdzielona
- lista zakupów do zrobienia w danym sklepie (kategorie)
- kalendarz z urodzinami/imieninami/wydarzeniami
- auta i pojazdy (termin przeglądów, dziennik serwisu, opłacenie OC/AC)
- lista rzeczy w lodówce
- paczki do odebrania

Przyszłościowe funkcje:
- tworzenie rodzin
- trzymanie kodów/haseł
- mcp cloude code

Modele danych:
user:
- uuid
- firstname
- lastname
  
task:
- uuid
- title
- description
- status_id
- priority_id
- due_date
- position
- link
- createdat
- updatedat

images:
- uuid
- name
- url
- task_uuid

status:
- uuid
- name
- color
  
priority:
- uuid
- name
- color

----------------------------------------------
fridge:
- uuid
- name

shopping_item:
- uuid
- name
- quantity
- category (food/nonfood)
- shopping_list_uuid

-fridge_item:
- uuid
- name
- fill_level
- dueto
- fridge_uuid
  
shopping_list:
- uuid
- name
- shop_uuid

shop:
- uuid
- name

Endpointy:
- CRUD /api/v1/tasks
- CRUD /api/v1/shopping-lists
- CRUD /api/v1/shopping-item
- CRUD /api/v1/shop
- CRUD /api/v1/events
- CRUD /api/v1/vehicles
- CRUD /api/v1/familys
- CRUD /api/v1/fridge
- CRUD /api/v1/fridge-items
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/me
- POST /api/v1/auth/logout