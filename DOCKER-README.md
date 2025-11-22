# 🐳 Docker & Easypanel - Guía Rápida

## ✅ Archivos Creados

- `Dockerfile` - Imagen optimizada multi-stage de Next.js
- `docker-compose.yml` - Orquestación completa (App + PostgreSQL + nginx)
- `nginx/nginx.conf` - Configuración principal de nginx
- `nginx/conf.d/app.conf` - Configuración del reverse proxy
- `.dockerignore` - Archivos excluidos del build
- `.env.production` - Variables de entorno para producción
- `next.config.js` - Configuración Next.js con output standalone
- `prisma/schema.production.prisma` - Schema para PostgreSQL
- `DEPLOYMENT.md` - Guía completa de despliegue

## 🚀 Inicio Rápido

### 1. Preparación Local

```bash
# Copiar variables de entorno
copy .env.production .env

# Editar .env y cambiar:
# - POSTGRES_PASSWORD (contraseña segura)
# - GEMINI_API_KEY (si lo usas)
```

### 2. Prueba Local con Docker

```bash
# Construir y levantar servicios
docker-compose up --build

# Acceder a: http://localhost
```

### 3. Despliegue en Easypanel

#### Opción A: Desde GitHub (Recomendado)

1. Sube estos archivos a tu repo
2. En Easypanel:
   - Create Service → App
   - Conecta GitHub repo
   - Build Type: Dockerfile
   - Port: 3000
3. Agrega PostgreSQL:
   - Create Service → Database → PostgreSQL
4. Configura variables de entorno:
   ```
   DB_URL=postgresql://user:pass@postgres:5432/db?schema=public
   NODE_ENV=production
   ```
5. Deploy!

#### Opción B: Docker Compose

1. Sube el proyecto completo
2. Ejecuta `docker-compose up -d`
3. Configura dominio y SSL en Easypanel

## 📋 Checklist Pre-Despliegue

- [ ] Actualizar `POSTGRES_PASSWORD` en `.env.production`
- [ ] Actualizar `GEMINI_API_KEY` si aplica
- [ ] Cambiar `schema.prisma` de SQLite a PostgreSQL
- [ ] Probar build local: `docker-compose build`
- [ ] Verificar que `next.config.js` tiene `output: 'standalone'`
- [ ] Configurar dominio en Easypanel
- [ ] Habilitar SSL/HTTPS

## 🔧 Comandos Útiles

```bash
# Ver logs
docker-compose logs -f app

# Reiniciar app
docker-compose restart app

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Backup DB
docker-compose exec postgres pg_dump -U imprenta_user imprenta_db > backup.sql

# Detener todo
docker-compose down
```

## 🌐 Configuración de Dominio

1. Apunta tu dominio a la IP de Easypanel
2. En `nginx/conf.d/app.conf`, actualiza `server_name`
3. Habilita SSL descomentando las líneas HTTPS
4. Easypanel generará certificados Let's Encrypt automáticamente

## ⚡ Optimizaciones Incluidas

- ✅ Build multi-stage para imagen pequeña
- ✅ Compresión gzip en nginx
- ✅ Cache de assets estáticos
- ✅ Health checks para todos los servicios
- ✅ Optimización de imágenes Next.js
- ✅ Headers de seguridad
- ✅ Standalone output de Next.js

## 🔒 Seguridad

- Cambiar todas las contraseñas por defecto
- Usar HTTPS en producción
- Variables de entorno para secretos
- Firewall: solo puertos 80 y 443 abiertos

## 📚 Documentación Completa

Ver `DEPLOYMENT.md` para guía detallada con:
- Troubleshooting
- Monitoreo
- Backups
- Escalabilidad
- Y más...

## 🎯 Arquitectura Final

```
Internet → Nginx (80/443) → Next.js App (3000) → PostgreSQL (5432)
```

¡Todo listo para producción! 🚀
