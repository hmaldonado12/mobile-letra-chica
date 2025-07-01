# Letra Chica - Frontend Mobile App

Una aplicación móvil desarrollada con Ionic Angular y Capacitor para el análisis de documentos legales.

## 📱 Tecnologías

- **Framework**: Ionic 7 con Angular 17
- **Móvil**: Capacitor para Android/iOS
- **Autenticación**: Google Sign-In nativo
- **HTTP Client**: Angular HttpClient

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo en macOS)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd frontend

# Instalar dependencias
npm install

# Instalar Ionic CLI globalmente (si no lo tienes)
npm install -g @ionic/cli
```

## 🔧 Desarrollo Local

### Configuración del Backend

Para conectar la aplicación móvil con un backend que corre localmente, necesitas exponer tu servidor local para que sea accesible desde dispositivos móviles.

#### Opción 1: Usar ngrok (Recomendado)

1. **Instalar ngrok**:
   ```bash
   # Usando npm
   npm install -g ngrok
   
   # O descargar desde https://ngrok.com/
   ```

2. **Ejecutar el backend** (en otra terminal):
   ```bash
   cd ../backend
   ./gradlew bootRun
   ```

3. **Exponer el backend con ngrok**:
   ```bash
   ngrok http 8080
   ```

4. **Copiar la URL pública** que ngrok te proporciona (ej: `https://abc123.ngrok.io`)

5. **Actualizar la configuración del frontend**:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'https://TU-URL-DE-NGROK.ngrok.io'
   };
   ```

#### Opción 2: Usar tu IP local en la misma red

1. **Encontrar tu IP local**:
   ```bash
   # En Linux/Mac
   ip addr show | grep inet
   # o
   ifconfig | grep inet
   
   # En Windows
   ipconfig
   ```

2. **Configurar el backend** para aceptar conexiones externas:
   ```properties
   # backend/src/main/resources/application.properties
   server.address=0.0.0.0
   ```

3. **Actualizar la configuración del frontend**:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://TU-IP-LOCAL:8080'
   };
   ```

4. **Asegurarte que el dispositivo móvil esté en la misma red WiFi**

### Ejecutar la Aplicación

#### En el navegador (desarrollo web)
```bash
ionic serve
```

#### En dispositivo Android
```bash
# Construir para Android
ionic capacitor build android

# Abrir en Android Studio
ionic capacitor open android

# O ejecutar directamente (requiere dispositivo/emulador conectado)
ionic capacitor run android
```

#### En dispositivo iOS
```bash
# Construir para iOS
ionic capacitor build ios

# Abrir en Xcode
ionic capacitor open ios
```

## 🔑 Configuración de Google Sign-In

### Para Android

1. **Crear proyecto en Google Cloud Console**
2. **Habilitar Google Sign-In API**
3. **Crear credenciales OAuth 2.0** para aplicación Android
4. **Configurar el `CLIENT_ID`** en:
   ```typescript
   // src/app/services/auth.service.ts
   private readonly CLIENT_ID = 'TU-CLIENT-ID-AQUI';
   ```

### Para iOS

Similar proceso pero creando credenciales para aplicación iOS.

## 📝 Scripts Disponibles

```bash
# Desarrollo web
npm run start

# Construir para producción
npm run build

# Ejecutar tests
npm run test

# Linting
npm run lint

# Construir para Android
npm run build:android

# Construir para iOS  
npm run build:ios
```

## 🐛 Solución de Problemas

### La app no se conecta al backend

1. **Verificar que el backend esté corriendo** en el puerto correcto
2. **Verificar la URL** en `environment.ts`
3. **Verificar conexión de red** (mismo WiFi si usas IP local)
4. **Revisar logs** del navegador o del dispositivo

### Error de autenticación con Google

1. **Verificar CLIENT_ID** en el servicio de auth
2. **Verificar configuraciones** en Google Cloud Console
3. **Verificar certificados** para aplicaciones Android

### Problemas con Capacitor

```bash
# Sincronizar cambios
ionic capacitor sync

# Limpiar y reconstruir
ionic capacitor clean android
ionic capacitor build android
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios (auth, API, etc.)
│   └── models/            # Interfaces y modelos
├── assets/                # Recursos estáticos
├── environments/          # Configuraciones por entorno
└── theme/                # Estilos globales
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia [TU-LICENCIA].