
# Laravel + React Blog Docker Compose Környezet

Ez a projekt egy teljes stack blogalkalmazás, amely Laravel backendből és React frontendből áll, Docker Compose segítségével konténerizálva.

## Követelmények

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Telepítés

1. **Repository klónozása:**

   ```bash
   git clone https://github.com/baranyiimi/blog.git
   cd blog
   ```

2. **.env fájl beállítása:**

   Másold az `.env.example` fájlt `.env` néven:

   ```bash
   cp .env.example .env
   ```

   Szükség esetén módosítsd a környezeti változókat.

3. **Docker konténerek indítása:**

   ```bash
   docker-compose up --build
   ```

   Ez a parancs elindítja az összes szükséges szolgáltatást (Laravel backend, React frontend, adatbázis stb.).

4. **Composer függőségek telepítése:**

   A Laravel konténerben telepítsd a PHP csomagokat:

   ```bash
   docker-compose exec app composer install
   ```

5. **NPM függőségek telepítése és frontend build:**

   A frontend konténerben telepítsd a JavaScript csomagokat és buildeld a React alkalmazást:

   ```bash
   docker-compose exec frontend npm install
   docker-compose exec frontend npm run dev -- --host
   ```

6. **Adatbázis migrációk futtatása:**

   Futtasd a Laravel migrációkat az adatbázis inicializálásához:

   ```bash
   docker-compose exec app php artisan migrate
   ```

## Elérhetőségek

- **Laravel Backend:** [http://localhost:8000](http://localhost:8000)
- **React Frontend:** [http://localhost:5173](http://localhost:5173)

## Hasznos Parancsok

- **Konténerek leállítása:**

  ```bash
  docker-compose down
  ```

- **Konténerek újraindítása:**

  ```bash
  docker-compose restart
  ```

- **Logok megtekintése:**

  ```bash
  docker-compose logs -f
  ```

## Megjegyzések

- Győződj meg róla, hogy a `docker-compose.yml` fájlban a portok megfelelően vannak beállítva, és nem ütköznek más szolgáltatásokkal a gépeden.
- Ha bármilyen hiba lép fel a konténerek indítása során, ellenőrizd a Docker logokat a hibaüzenetek részleteiért.
