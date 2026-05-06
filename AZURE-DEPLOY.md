# Despliegue en Azure App Service

Guía completa para desplegar el ACIM Cloud Success Portal en Azure App Service con Azure Database for PostgreSQL.

---

## Arquitectura en Azure

```
GitHub → GitHub Actions → Azure Container Registry → Azure App Service
                                                           │
                                              Azure Database for PostgreSQL
```

- **Azure App Service** — corre el contenedor Docker (Express API + React frontend)
- **Azure Container Registry (ACR)** — almacena las imágenes Docker
- **Azure Database for PostgreSQL Flexible Server** — base de datos en producción

---

## Paso 1 — Subir el código a GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `acim-portal` (o el que prefieras)
3. Privado o público según tu preferencia
4. **No** inicialices con README ni .gitignore
5. Clic en **"Create repository"**

### 1.2 Subir el código desde Replit

Abre la terminal de Replit y ejecuta:

```bash
git init
git add .
git commit -m "feat: initial ACIM portal setup"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/acim-portal.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu username de GitHub.

---

## Paso 2 — Crear recursos en Azure

### 2.1 Resource Group

```bash
az group create \
  --name rg-acim-portal \
  --location eastus
```

### 2.2 Azure Container Registry

```bash
az acr create \
  --resource-group rg-acim-portal \
  --name acimportalacr \
  --sku Basic \
  --admin-enabled true
```

Obtén las credenciales del ACR:

```bash
az acr credential show --name acimportalacr
```

Guarda el `username` y `password` — los necesitarás como secrets de GitHub.

### 2.3 Azure Database for PostgreSQL Flexible Server

```bash
az postgres flexible-server create \
  --resource-group rg-acim-portal \
  --name acim-portal-db \
  --location eastus \
  --admin-user acimadmin \
  --admin-password "TuPasswordSeguro123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --yes
```

Crea la base de datos:

```bash
az postgres flexible-server db create \
  --resource-group rg-acim-portal \
  --server-name acim-portal-db \
  --database-name acim_portal
```

Permite acceso desde Azure services:

```bash
az postgres flexible-server firewall-rule create \
  --resource-group rg-acim-portal \
  --name acim-portal-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

La `DATABASE_URL` tendrá este formato:

```
postgresql://acimadmin:TuPasswordSeguro123!@acim-portal-db.postgres.database.azure.com:5432/acim_portal?sslmode=require
```

### 2.4 Ejecutar migraciones de base de datos

Desde Replit, ejecuta las migraciones apuntando a la DB de Azure:

```bash
DATABASE_URL="postgresql://acimadmin:TuPasswordSeguro123!@acim-portal-db.postgres.database.azure.com:5432/acim_portal?sslmode=require" \
  pnpm --filter @workspace/db run push
```

### 2.5 Azure App Service Plan

```bash
az appservice plan create \
  --resource-group rg-acim-portal \
  --name acim-portal-plan \
  --is-linux \
  --sku B1
```

### 2.6 Azure App Service (Web App)

```bash
az webapp create \
  --resource-group rg-acim-portal \
  --plan acim-portal-plan \
  --name acim-portal-app \
  --deployment-container-image-name acimportalacr.azurecr.io/acim-portal:latest
```

Conecta el ACR al App Service:

```bash
az webapp config container set \
  --resource-group rg-acim-portal \
  --name acim-portal-app \
  --container-registry-url https://acimportalacr.azurecr.io \
  --container-registry-user acimportalacr \
  --container-registry-password "PASSWORD_DEL_ACR"
```

Configura las variables de entorno:

```bash
az webapp config appsettings set \
  --resource-group rg-acim-portal \
  --name acim-portal-app \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DATABASE_URL="postgresql://acimadmin:TuPasswordSeguro123!@acim-portal-db.postgres.database.azure.com:5432/acim_portal?sslmode=require"
```

---

## Paso 3 — Configurar GitHub Actions

### 3.1 Crear Service Principal para GitHub Actions

```bash
az ad sp create-for-rbac \
  --name "acim-portal-github" \
  --role contributor \
  --scopes /subscriptions/TU_SUBSCRIPTION_ID/resourceGroups/rg-acim-portal \
  --json-auth
```

Copia el JSON completo que devuelve — lo necesitas como secret.

### 3.2 Agregar Secrets en GitHub

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega estos secrets:

| Secret | Valor |
|--------|-------|
| `AZURE_CREDENTIALS` | JSON completo del Service Principal (paso 3.1) |
| `AZURE_REGISTRY_URL` | `acimportalacr.azurecr.io` |
| `AZURE_REGISTRY_USERNAME` | username del ACR |
| `AZURE_REGISTRY_PASSWORD` | password del ACR |
| `AZURE_WEBAPP_NAME` | `acim-portal-app` |
| `AZURE_RESOURCE_GROUP` | `rg-acim-portal` |
| `DATABASE_URL` | connection string de PostgreSQL |

### 3.3 Primer deploy

Haz un push a `main` para disparar el pipeline:

```bash
git add .
git commit -m "chore: configure Azure deployment"
git push origin main
```

Ve a **GitHub → Actions** para ver el progreso. Tarda ~5-8 minutos la primera vez.

---

## Paso 4 — Verificar el despliegue

```bash
# Ver la URL de la app
az webapp show \
  --resource-group rg-acim-portal \
  --name acim-portal-app \
  --query defaultHostName \
  --output tsv
```

La URL será: `https://acim-portal-app.azurewebsites.net`

---

## Dominio personalizado (opcional)

```bash
az webapp config hostname add \
  --resource-group rg-acim-portal \
  --webapp-name acim-portal-app \
  --hostname tu.dominio.com
```

---

## Costos estimados (tier básico)

| Recurso | SKU | Costo/mes aprox. |
|---------|-----|-----------------|
| App Service Plan B1 | Linux B1 | ~$13 USD |
| Container Registry Basic | Basic | ~$5 USD |
| PostgreSQL Flexible Server | Burstable B1ms | ~$12 USD |
| **Total** | | **~$30 USD/mes** |

---

## Credenciales admin del portal

- **URL:** `https://acim-portal-app.azurewebsites.net/admin`
- **Username:** `admin`
- **Password:** `acim2024`
