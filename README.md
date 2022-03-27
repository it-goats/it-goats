<h1 align="center">
IT-GOATS
</h1>

## Struktura

| Codebase              |          Opis             |
| :-------------------- | :-----------------------: |
| [bode](bode)          |       Flask API           |
| [cabra](cabra)        |     React Frontend        |

## Uruchomienie projektu

### Wymagania (zalecane):
- [Docker](https://docs.docker.com/get-docker/) + [docker-compose](https://docs.docker.com/compose/) dla Linux'a lub [Docker Desktop](https://docs.docker.com/get-docker/) dla OSX/Windows'a
- [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install) w przypadku Windows'a
- [asdf](https://github.com/asdf-vm/asdf)

### Wymagania (alternatywne i niezalecana):
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

Po tym wszystkim aplikacja będzie dostępna po adresem http://localhost:3000.

### Alternatywna i niezalecana instrukcja:

Można spróbować uruchomić projekt bez Docker'a i/lub asdf'a. Wtedy trzeba samemu zapewnić, że wszystkie wymagane narzędzia są zainstalowane i  serwer PostgreSQL jest uruchomiony. Następnie należy uruchamiać kolejne kroki z [setup.sh](setup.sh) pomijając ostatni oraz ręcznie ustawić w powłoce zmienne środowiskowe z pliku [.env.example](.env.example).

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