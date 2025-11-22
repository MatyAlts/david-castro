@echo off
REM Script de ayuda para despliegue Docker de Imprenta Manager

echo ================================
echo  Imprenta Manager - Docker Helper
echo ================================
echo.

if "%1"=="" goto menu
if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="down" goto down
if "%1"=="logs" goto logs
if "%1"=="restart" goto restart
if "%1"=="migrate" goto migrate
if "%1"=="backup" goto backup
if "%1"=="test" goto test
goto menu

:menu
echo Comandos disponibles:
echo.
echo   build    - Construir las imagenes Docker
echo   up       - Levantar todos los servicios
echo   down     - Detener todos los servicios
echo   logs     - Ver logs en tiempo real
echo   restart  - Reiniciar la aplicacion
echo   migrate  - Ejecutar migraciones de Prisma
echo   backup   - Crear backup de la base de datos
echo   test     - Probar la aplicacion localmente
echo.
echo Uso: deploy.bat [comando]
goto end

:build
echo Construyendo imagenes Docker...
docker-compose build
goto end

:up
echo Levantando servicios...
docker-compose up -d
echo.
echo Servicios iniciados!
echo Accede a: http://localhost
goto end

:down
echo Deteniendo servicios...
docker-compose down
goto end

:logs
echo Mostrando logs (Ctrl+C para salir)...
docker-compose logs -f
goto end

:restart
echo Reiniciando aplicacion...
docker-compose restart app
goto end

:migrate
echo Ejecutando migraciones de Prisma...
docker-compose exec app npx prisma migrate deploy
goto end

:backup
echo Creando backup de la base de datos...
set BACKUP_FILE=backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
docker-compose exec -T postgres pg_dump -U imprenta_user imprenta_db > %BACKUP_FILE%
echo Backup creado: %BACKUP_FILE%
goto end

:test
echo Probando aplicacion localmente...
echo.
echo 1. Construyendo...
docker-compose build
echo.
echo 2. Levantando servicios...
docker-compose up -d
echo.
echo 3. Esperando que los servicios esten listos...
timeout /t 10 /nobreak > nul
echo.
echo 4. Verificando estado...
docker-compose ps
echo.
echo 5. Probando endpoint...
curl http://localhost/health
echo.
echo.
echo Prueba completada!
echo Accede a: http://localhost
goto end

:end
