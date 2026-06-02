# Guía de Despliegue en IIS con Variables de Entorno

## Configuración de Variables de Entorno

### 1. Desarrollo Local

El archivo `.env.local` contiene las variables de entorno para desarrollo:

```
VITE_API_KEY=tu_api_key_aqui
```

**Nota:** Este archivo NO está versionado en Git (está en `.gitignore`), así que es seguro guardar valores reales aquí.

### 2. Build para Producción

Las variables de entorno se incrustran durante el build con:

```bash
npm run build
```

El archivo de configuración Vite (`vite.config.js`) está configurado para acceder a las variables de entorno prefijadas con `VITE_`.

### 3. Despliegue en IIS

Para que funcione correctamente en IIS, sigue estos pasos:

#### Opción A: Variables de Entorno en el Sistema (Recomendado)

1. **En Windows Server (donde está IIS):**
   - Abre `Variables de Entorno del Sistema`
   - Crea la variable: `VITE_API_KEY=tu_api_key_aqui`
   - Reinicia el Application Pool en IIS

2. **Rebuild la aplicación en tu máquina con la variable:**
   ```powershell
   # En PowerShell, antes de hacer build
   $env:VITE_API_KEY="tu_api_key_aqui"
   npm run build
   ```

3. **Sube la carpeta `dist/` a IIS**

#### Opción B: Archivo `.env` en Producción

1. Copia el archivo `.env.example` y renómbralo a `.env.production.local`

2. Completa los valores reales:
   ```
   VITE_API_KEY=tu_api_key_aqui
   ```

3. Build localmente con:
   ```bash
   npm run build
   ```

4. Sube la carpeta `dist/` a IIS

#### Opción C: Script de Despliegue Automatizado (Más Seguro)

Crea un archivo `deploy.ps1` en PowerShell:

```powershell
# deploy.ps1
param(
    [string]$ApiKey = $(throw "Se requiere -ApiKey")
)

# Establecer la variable de entorno
$env:VITE_API_KEY = $ApiKey

# Limpiar build anterior
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# Build
npm run build

# Copiar a IIS (ajusta según tu ruta de IIS)
$iisPath = "C:\inetpub\wwwroot\SalesOrder"
Copy-Item -Path "dist\*" -Destination $iisPath -Recurse -Force

Write-Host "✅ Despliegue completado en $iisPath"
```

Uso:
```powershell
.\deploy.ps1 -ApiKey "MQirm93k5Nvi1L1JOn2FvH0Pmo8JYeAkJDDJmKXYAUkeb"
```

### 4. Verificación Post-Despliegue

En el navegador, abre las DevTools (F12) en la consola:
- Las llamadas API deben incluir el header `X-API-Key` con el valor correcto
- Si ves `undefined` en la consola, significa que la variable no se leyó correctamente

## Seguridad

⚠️ **IMPORTANTE:**

- ✅ Nunca commitees `.env.local` (ya está ignorado)
- ✅ Usa variables de entorno del sistema en Producción
- ✅ Limita el acceso al servidor donde se guarden las claves
- ✅ Rota la API Key regularmente
- ✅ Usa HTTPS siempre en Producción

## Troubleshooting

### "X-API-Key es undefined"
- Verifica que la variable `VITE_API_KEY` esté definida en el momento del build
- Usa `import.meta.env.VITE_API_KEY` en los archivos JSX (ya está configurado)

### "La API devuelve 401 Unauthorized"
- Verifica que la API Key sea correcta
- Chequea que las credenciales Basic Auth también sean correctas

### Build local funciona pero no en IIS
- Verifica que el archivo `dist/` contenga el valor correcto en el build
- Busca la cadena API en los archivos JS compilados: `grep -r "MQirm93k" dist/`
