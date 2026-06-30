# Sudoku Pelu — Producto listo para publicar

Sudoku web premium con **100 niveles**, sistema de vidas, tienda Mercado Pago, PWA instalable y diseño arcade.

## Publicar en 5 minutos (Netlify — gratis)

1. Creá cuenta en [netlify.com](https://netlify.com)
2. Arrastrá la carpeta `SUDOKU` a **Deploy manually**
3. Editá `config.js` y poné tu URL real en `siteUrl`
4. Editá `sitemap.xml` y reemplazá `TU-DOMINIO.com` por tu dominio
5. Listo — tu juego está online con HTTPS (necesario para PWA y pagos)

### Alternativa: GitHub Pages

```powershell
git init
git add .
git commit -m "Sudoku Pelu v1.0"
git branch -M main
git remote add origin TU_REPO
git push -u origin main
```

En GitHub → Settings → Pages → Source: `main` / root.

## Configuración comercial (`config.js`)

Los packs se definen en `shopPacks`. Editá precios, vidas y el intervalo del corazón gratis:

```javascript
freeHeartIntervalHours: 12,
shopPacks: [
  { id: 'pack-3', name: 'Pack Inicio', lives: 3, price: 10, ... },
  { id: 'pack-premium', name: 'Premium Infinito', infinite: true, price: 199, ... },
],
```

## Cobros — Banco Macro (transferencia directa)

**Mercado Pago NO es obligatorio.** El jugador puede transferir desde cualquier banco o billetera al alias **FLECO.CRUCE.CINTO** y el dinero llega directo a **Banco Macro**.

Ver guía completa en [PAGOS.md](PAGOS.md).

| Dato | Valor |
|------|-------|
| Banco | Banco Macro |
| Alias | FLECO.CRUCE.CINTO |

Mercado Pago es **opcional** (`enableMercadoPago` en config.js) solo para quien quiera pagar online con activación automática.

## Modelo de ingresos

| Producto | Precio | Entrega |
|----------|--------|---------|
| Juego base | Gratis | 600 niveles |
| Pack Inicio | $ 5.000 ARS | 3 vidas |
| Pack Avanzado | $ 10.000 ARS | 10 vidas |
| Pack Legendario | $ 20.000 ARS | 25 vidas |
| Premium Infinito | $ 90.000 ARS | Vidas ilimitadas |
| Corazón gratis | Gratis | 1 vida cada 12 horas |

**Flujo:** Jugador → Comprar pack → Mercado Pago → Vuelve al juego → Verificación automática → Vidas activadas.

## Archivos del producto

| Archivo | Función |
|---------|---------|
| `index.html` | App principal + splash + tienda |
| `script.js` | Lógica del juego |
| `styles.css` | Diseño premium |
| `config.js` | Config comercial editable |
| `manifest.webmanifest` | PWA / instalable |
| `sw.js` | Offline / caché |
| `privacidad.html` | Política de privacidad |
| `terminos.html` | Términos y condiciones |
| `netlify.toml` | Deploy + headers seguridad |

## Probar localmente

```powershell
python -m http.server 8080
```

Abrí: http://localhost:8080

## Checklist antes de publicar

- [ ] Cuenta Mercado Pago vinculada a Macro · alias `FLECO.CRUCE.CINTO`
- [ ] `MP_ACCESS_TOKEN` en Netlify (misma cuenta MP)
- [ ] Email de soporte actualizado
- [ ] URL del sitio en `config.js` y `sitemap.xml`
- [ ] Probado en celular (tocar tablero, tienda, comprar vidas)
- [ ] Probado instalar como app (Chrome → Instalar)
- [ ] Compartir link funciona

## Características producto

- 100 niveles progresivos
- Pantalla de inicio profesional
- PWA instalable (celular y PC)
- Funciona offline tras primera visita
- Tienda de vidas accesible siempre
- Compartir juego (Web Share API)
- SEO + Open Graph para redes
- Páginas legales incluidas
- Progreso guardado localmente
- Confetti, sonidos, animaciones
- Responsive mobile-first

## Soporte

Consultas: configurá `supportEmail` en `config.js`.

---

Sudoku Pelu © 2026 — Hecho para publicar y monetizar.
