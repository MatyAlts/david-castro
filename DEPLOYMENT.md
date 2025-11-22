# 🚀 Guía de Despliegue - Imprenta Manager

Esta guía te ayudará a desplegar la aplicación en **Easypanel** usando Docker y nginx.

## 📋 Requisitos Previos

- Cuenta en Easypanel
- Docker instalado (para pruebas locales)
- Dominio configurado (opcional, para HTTPS)

## 🏗️ Arquitectura de Despliegue

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Nginx     │ (Puerto 80/443)
│  (Proxy)    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Next.js    │ (Puerto 3000)
│     App     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ PostgreSQL  │ (Puerto 5432)
│     DB      │
└─────────────┘
```

## 🔧 Configuración Inicial

### 1. Actualizar Next.js Config

Asegúrate de que tu `next.config.js` tenga la configuración standalone:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... otras configuraciones
}

module.exports = nextConfig
```

### 2. Actualizar Prisma Schema para PostgreSQL

Modifica `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de sqlite a postgresql
  url      = env("DB_URL")
}
```

### 3. Configurar Variables de Entorno

Copia `.env.production` y actualiza los valores:

```bash
# Database
DB_URL=postgresql://imprenta_user:TU_PASSWORD_SEGURA@postgres:5432/imprenta_db?schema=public
POSTGRES_PASSWORD=TU_PASSWORD_SEGURA

# API Keys
GEMINI_API_KEY=tu_api_key_si_la_usas
```

## 🐳 Despliegue en Easypanel

### Opción 1: Desde GitHub (Recomendado)

1. **Conecta tu repositorio a Easypanel**
   - Ve a tu proyecto en Easypanel
   - Selecciona "Create Service" → "App"
   - Conecta tu repositorio de GitHub

2. **Configurar el servicio**
   - **Build Type**: Dockerfile
   - **Dockerfile Path**: ./Dockerfile
   - **Port**: 3000

3. **Agregar PostgreSQL**
   - En tu proyecto, crea un nuevo servicio
   - Selecciona "Database" → "PostgreSQL"
   - Anota las credenciales generadas

4. **Configurar Variables de Entorno**
   En la configuración del servicio, agrega:
   ```
   DB_URL=postgresql://user:password@postgres:5432/imprenta_db?schema=public
   GEMINI_API_KEY=tu_api_key
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

5. **Configurar Nginx (opcional)**
   - Si Easypanel no incluye proxy automático, usa el servicio nginx incluido
   - Sube los archivos de configuración de nginx

6. **Deploy**
   - Haz click en "Deploy"
   - Easypanel construirá y desplegará automáticamente

### Opción 2: Con Docker Compose

Si Easypanel soporta docker-compose directamente:

```bash
# Subir archivos
- docker-compose.yml
- Dockerfile
- nginx/

# Configurar variables de entorno en Easypanel
# Desplegar
```

## 🧪 Prueba Local antes de Desplegar

```bash
# 1. Construir las imágenes
docker-compose build

# 2. Iniciar los servicios
docker-compose up -d

# 3. Ver logs
docker-compose logs -f app

# 4. Verificar que funciona
curl http://localhost

# 5. Detener servicios
docker-compose down
```

## 🔒 Configurar HTTPS (Certificado SSL)

### Con Let's Encrypt en Easypanel

Easypanel generalmente maneja SSL automáticamente. Solo necesitas:

1. Configurar tu dominio en Easypanel
2. Habilitar SSL en la configuración del servicio
3. Easypanel generará certificados Let's Encrypt automáticamente

### Manual (si lo necesitas)

Si necesitas configurar SSL manualmente, edita `nginx/conf.d/app.conf`:

1. Descomenta las líneas HTTPS
2. Agrega tus certificados en `nginx/ssl/`
3. Actualiza las rutas en la configuración

## 📊 Monitoreo

### Ver logs de los contenedores

```bash
# Logs de la app
docker-compose logs -f app

# Logs de nginx
docker-compose logs -f nginx

# Logs de postgres
docker-compose logs -f postgres
```

### Health Checks

La aplicación incluye health checks en:
- App: `http://tu-dominio.com/` (debe responder 200)
- Nginx: `http://tu-dominio.com/health`

## 🔄 Actualizaciones

### Desde GitHub (Easypanel)

1. Haz push a tu repositorio
2. Easypanel detectará cambios automáticamente
3. O usa "Redeploy" manualmente en el panel

### Manual con Docker Compose

```bash
# 1. Pull últimos cambios
git pull origin main

# 2. Reconstruir y reiniciar
docker-compose down
docker-compose build
docker-compose up -d

# 3. Ejecutar migraciones si hay cambios en DB
docker-compose exec app npx prisma migrate deploy
```

## 🛠️ Troubleshooting

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar la URL de conexión
docker-compose exec app env | grep DB_URL
```

### Error de Prisma

```bash
# Regenerar cliente de Prisma
docker-compose exec app npx prisma generate

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy
```

### Problemas con nginx

```bash
# Verificar configuración
docker-compose exec nginx nginx -t

# Recargar configuración
docker-compose exec nginx nginx -s reload
```

### La app no se conecta

1. Verifica que todos los servicios estén corriendo:
   ```bash
   docker-compose ps
   ```

2. Verifica los logs:
   ```bash
   docker-compose logs --tail=100
   ```

3. Verifica la red:
   ```bash
   docker network inspect imprenta-network
   ```

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] Cambiar contraseña de PostgreSQL
- [ ] Usar variables de entorno para secretos
- [ ] Habilitar HTTPS
- [ ] Configurar firewall (solo puertos 80 y 443)
- [ ] Actualizar dependencias regularmente
- [ ] Configurar backups de base de datos
- [ ] Limitar acceso a base de datos

### Backup de Base de Datos

```bash
# Crear backup
docker-compose exec postgres pg_dump -U imprenta_user imprenta_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U imprenta_user imprenta_db < backup.sql
```

## 📈 Optimizaciones

### Performance

1. **Caching con nginx**: Ya configurado en `nginx/conf.d/app.conf`
2. **Compresión gzip**: Ya habilitado en `nginx/nginx.conf`
3. **Next.js Image Optimization**: Configurado automáticamente

### Escalabilidad

Para escalar horizontalmente:

```yaml
# En docker-compose.yml
app:
  deploy:
    replicas: 3
```

Y configurar nginx como load balancer.

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs
2. Verifica la configuración
3. Consulta la documentación de Easypanel
4. Revisa los issues en GitHub

## 🎉 ¡Listo!

Tu aplicación debería estar corriendo en:
- HTTP: `http://tu-dominio.com`
- HTTPS: `https://tu-dominio.com` (si configuraste SSL)

¡Feliz despliegue! 🚀
