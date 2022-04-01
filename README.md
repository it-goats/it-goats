<h1 align="center">
IT-GOATS
</h1>

## Struktura

| Codebase       |      Opis      |
| :------------- | :------------: |
| [bode](bode)   |   Flask API    |
| [cabra](cabra) | React Frontend |

## Uruchomienie projektu

### Wymagania (zalecane):

- [Docker](https://docs.docker.com/get-docker/) + [docker-compose](https://docs.docker.com/compose/) dla Linux'a lub [Docker Desktop](https://docs.docker.com/get-docker/) dla OSX/Windows'a
- [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install) w przypadku Windows'a
- [asdf](https://github.com/asdf-vm/asdf)

### Wymagania (alternatywne i niezalecane):

- [PostgreSQL](https://www.postgresql.org/) w rozsądnej wersji
- [Node.js + npm](https://nodejs.org/en/) najlepiej w wersji 16.14.12
- [Poetry](https://python-poetry.org/) najlepiej w wersji 1.1.13
- [Python](https://www.python.org/downloads/) najlepiej w wersji 3.10.4

### Zalecana instrukcja:

Do pracy nad projektem najlepiej wykorzystać UNIX'owe środowisko.
OSX, jakiś Linux lub WSL2 pod Windows'em sprawdzą się w sam raz. W takim środowisku potrzebujemy mieć Docker'a z Compose'em (patrz linki w wymaganiach) oraz [asdf'a](https://asdf-vm.com/guide/getting-started.html).

Mając gotowe te dwie rzeczy, sklonowane repo (w przypadku WSL'a repo klonujemy do niego zamiast do Windowsa) i trochę szczęścia projekt powinien wstać po odpaleniu [skryptu](setup.sh):

```
$ ./setup.sh
```

Skrypt po kolei:

- zainstaluje potrzebne narzędzia przez asdf'a
- doda do gita hooki sprawdzające kod przed każdym commit'em (gdy będziemy mieć wybór, które hooki zainstalować to wybieramy spacją tylko `pre-commit` i potwierdzamy)
- zainstaluje potrzebne zależności w bode i cabrze
- uruchomi kontenery z bazą danych, backend'em i frontend'em

Po tym wszystkim aplikacja będzie dostępna po adresem http://localhost:3000. API jest dostępne pod adresem http://localhost:4000/api/v1.

Setup wystarczy wykonać pomyślnie tylko raz, potem aplikację stawiamy:

- na Linuxie

```
docker-compose up
```

- na Macu/WSL:

```
docker compose up
```

### Alternatywna i niezalecana instrukcja:

Można spróbować uruchomić projekt bez Docker'a i/lub asdf'a. Wtedy trzeba samemu zapewnić, że wszystkie wymagane narzędzia są zainstalowane i serwer PostgreSQL jest uruchomiony. Następnie należy uruchamiać kolejne kroki z [setup.sh](setup.sh) pomijając ostatni oraz ręcznie ustawić w powłoce zmienne środowiskowe z pliku [.env.example](.env.example).

Po tym wszystkim uruchamiamy w jednym terminalu bode:

```
cd bode && poetry run flask run --port=$FLASK_PORT
```

A w drugim cabrę:

```
cd cabra && npm run dev
```

W tym przypadku aplikacja też będzie dostępna po adresem http://localhost:3000.

### Możliwe problemy

Jeśli w trakcie instalacji zależności przez poetry pojawi się błąd dotyczący `psycopg2` to konieczne może być doinstalowanie odpowiednich pakietów zgodnie ze [stackiem](https://stackoverflow.com/questions/11618898/pg-config-executable-not-found).

## Przygotowanie VS Code

Oczywiście można pisać dowolnym edytorze, ale jeżeli ktoś ma chęć to polecam korzystać z VS Code. Poniżej kilka porad dla łatwiejszej i przyjemniejszej pracy.

### Workspace

VS Code lepiej działa mając dodane foldery z poszczególnymi częściami aplikacji do workspace'a. Dlatego jeśli nie potrzebujemy robić nic w głównych katalogu projektu to wygodnie otworzyć sobie puste okno i wrzucić do niego foldery `bode` i `cabra`, zamiast otwierać cały projekt.

### Interpreter pythona

VS Code będzie chciał żeby podać mu ścieżkę do używanego przez nas interpretera pythona. Wtedy wskazujemy ten w katalogu `bode/.venv`.

### Lista fajnych i przydatnych dla naszego projektu dodatków:

- Frontend/React/Tailwind
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) **MUST HAVE**
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) **MUST HAVE**
  - [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports) - **MUST HAVE** automatycznie sortuje importy w TS
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) razem z [Tailwind Twin IntelliSense](https://marketplace.visualstudio.com/items?itemName=lightyen.tailwindcss-intellisense-twin) - dobra rzecz, nie trzeba dokładnie pamiętać nazw klas
  - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) - przydatne snippety
  - [glean](https://marketplace.visualstudio.com/items?itemName=wix.glean) - refactoring do React'a
- Python
  - [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) **MUST HAVE**
  - [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) **MUST HAVE**
- DevOps
  - [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
  - [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) **MUST HAVE** przy WSL
- Inne
  - [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) - ładnie pokazuje drzewo gita
  - [Git Lens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - można łatwo wyklikiwać rzeczy związane z gitem
  - [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow) - koloruje wcięcia

## Materiały dotyczące używanych technologii i bibliotek

### Dostęp do bazy danych

- ORM
  - [SQLAlchemy](https://docs.sqlalchemy.org/en/14/)
  - [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)
- Migracje
  - [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/)
  - [Alembic](https://alembic.sqlalchemy.org/en/latest/)

### REST API

- [flask-smorest](https://flask-smorest.readthedocs.io/en/latest/)
- [marshmallow](https://marshmallow.readthedocs.io/en/stable/)

### Frontend

- [React](https://beta.reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-query](https://react-query.tanstack.com/)
- [react-hook-form](https://react-hook-form.com/)
