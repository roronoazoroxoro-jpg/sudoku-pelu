## Cobros — Banco Macro (activación automática)

**No necesitás Mercado Pago para cobrar en Macro.**

En Argentina el sistema es interoperable: cualquier persona puede transferir desde su banco o billetera (Galicia, BBVA, Mercado Pago, Ualá, Naranja X, etc.) al alias **FLECO.CRUCE.CINTO** y el dinero llega **directo a tu cuenta Banco Macro**.

| Dato | Valor |
|------|-------|
| Banco | Banco Macro |
| Alias | FLECO.CRUCE.CINTO |

### Flujo del jugador

1. Elige un pack → **Pagar ahora**
2. Ve alias, monto exacto y código de referencia (ej. `PEL-3-ABC123`)
3. Transfiere desde **cualquier app** al alias Macro con el código en el motivo
4. El juego **espera automáticamente** — no hay botón «Ya transferí»
5. Al impactar el pago en Macro, el pack se activa solo

### Cómo funciona la automatización

1. `create-transfer-intent` guarda el pedido con código `PEL-...`
2. Tu banco notifica a `macro-incoming-webhook` cuando entra la transferencia
3. El juego hace polling cada 3 s a `check-payment-status?ref=PEL-...`
4. Cuando el webhook aprueba el ingreso, el pack se entrega al instante

### Configurar webhook de Macro (obligatorio para auto-activación)

Pedí en Macro **banca empresa / Event Hub** (o integrador como Bind/Comafi) que envíe un POST cuando ingrese dinero:

```
POST https://TU-SITIO.netlify.app/.netlify/functions/macro-incoming-webhook
Header: X-Webhook-Secret: TU_WEBHOOK_SECRET
Body (ejemplo):
{
  "amount": 5000,
  "ref": "PEL-3-ABC123",
  "description": "PEL-3-ABC123"
}
```

El webhook busca el código `PEL-...` en el motivo/descripción y valida que el monto coincida con el pack.

Variables Netlify:

| Variable | Uso |
|----------|-----|
| `WEBHOOK_SECRET` | Protege el webhook Macro |
| `PAYMENT_ALIAS` | Opcional, default FLECO.CRUCE.CINTO |
| `PAYMENT_BANK` | Opcional, default Banco Macro |
| `MP_ACCESS_TOKEN` | Solo si más adelante activás checkout MP |

### Sin webhook bancario

Si el webhook no está configurado, el polling no detectará transferencias directas. Para producción necesitás el aviso automático del banco o un integrador que lo reenvíe.

### Packs y precios (ARS)

| Pack | Precio |
|------|--------|
| Pack Inicio (3 vidas) | $5.000 |
| Pack Avanzado (10 vidas) | $10.000 |
| Pack Legendario (25 vidas) | $20.000 |
| Premium Infinito | $90.000 |
