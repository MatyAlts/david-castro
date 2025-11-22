#!/bin/bash
# Script de ayuda para despliegue Docker de Imprenta Manager

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo "================================"
echo " Imprenta Manager - Docker Helper"
echo "================================"
echo ""

# Función para mostrar ayuda
show_help() {
    echo "Comandos disponibles:"
    echo ""
    echo "  build    - Construir las imágenes Docker"
    echo "  up       - Levantar todos los servicios"
    echo "  down     - Detener todos los servicios"
    echo "  logs     - Ver logs en tiempo real"
    echo "  restart  - Reiniciar la aplicación"
    echo "  migrate  - Ejecutar migraciones de Prisma"
    echo "  backup   - Crear backup de la base de datos"
    echo "  test     - Probar la aplicación localmente"
    echo "  clean    - Limpiar volúmenes y contenedores"
    echo ""
    echo "Uso: ./deploy.sh [comando]"
}

# Función para construir
build() {
    echo -e "${YELLOW}Construyendo imágenes Docker...${NC}"
    docker-compose build
    echo -e "${GREEN}✓ Construcción completada${NC}"
}

# Función para levantar servicios
up() {
    echo -e "${YELLOW}Levantando servicios...${NC}"
    docker-compose up -d
    echo ""
    echo -e "${GREEN}✓ Servicios iniciados!${NC}"
    echo -e "Accede a: ${YELLOW}http://localhost${NC}"
}

# Función para detener servicios
down() {
    echo -e "${YELLOW}Deteniendo servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Servicios detenidos${NC}"
}

# Función para ver logs
logs() {
    echo -e "${YELLOW}Mostrando logs (Ctrl+C para salir)...${NC}"
    docker-compose logs -f
}

# Función para reiniciar
restart() {
    echo -e "${YELLOW}Reiniciando aplicación...${NC}"
    docker-compose restart app
    echo -e "${GREEN}✓ Aplicación reiniciada${NC}"
}

# Función para migraciones
migrate() {
    echo -e "${YELLOW}Ejecutando migraciones de Prisma...${NC}"
    docker-compose exec app npx prisma migrate deploy
    echo -e "${GREEN}✓ Migraciones completadas${NC}"
}

# Función para backup
backup() {
    echo -e "${YELLOW}Creando backup de la base de datos...${NC}"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec -T postgres pg_dump -U imprenta_user imprenta_db > "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup creado: $BACKUP_FILE${NC}"
}

# Función para prueba completa
test() {
    echo -e "${YELLOW}Probando aplicación localmente...${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Construyendo...${NC}"
    docker-compose build
    
    echo ""
    echo -e "${YELLOW}2. Levantando servicios...${NC}"
    docker-compose up -d
    
    echo ""
    echo -e "${YELLOW}3. Esperando que los servicios estén listos...${NC}"
    sleep 10
    
    echo ""
    echo -e "${YELLOW}4. Verificando estado...${NC}"
    docker-compose ps
    
    echo ""
    echo -e "${YELLOW}5. Probando endpoint...${NC}"
    curl -s http://localhost/health || echo "Esperando..."
    
    echo ""
    echo ""
    echo -e "${GREEN}✓ Prueba completada!${NC}"
    echo -e "Accede a: ${YELLOW}http://localhost${NC}"
}

# Función para limpiar
clean() {
    echo -e "${RED}⚠ Esto eliminará todos los contenedores y volúmenes${NC}"
    read -p "¿Estás seguro? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Limpiando...${NC}"
        docker-compose down -v
        echo -e "${GREEN}✓ Limpieza completada${NC}"
    else
        echo "Operación cancelada"
    fi
}

# Main
case "$1" in
    build)
        build
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    logs)
        logs
        ;;
    restart)
        restart
        ;;
    migrate)
        migrate
        ;;
    backup)
        backup
        ;;
    test)
        test
        ;;
    clean)
        clean
        ;;
    *)
        show_help
        ;;
esac
