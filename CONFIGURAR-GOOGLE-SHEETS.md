# Rotación de WhatsApp con Google Sheets

El checkout usa una hoja de Google para asignar globalmente, y en orden alternado, los dos números de WhatsApp. La página solo redirige al chat después de recibir una asignación confirmada.

## Recursos desplegados

- Hoja privada: [Parfum Club - Rotación WhatsApp](https://docs.google.com/spreadsheets/d/1gvm2an7NxFBqnDxCo8oFOWQ83H25iwHt5cdnJlr67YU/edit)
- Endpoint público de asignación: [Aplicación web de Apps Script](https://script.google.com/macros/s/AKfycbzZYDiglPOPcA9LMCrKZsVusWHS8pH-h3IRql-jUtLhkTlt3Qv9eUNkRKIDX0OUEdI_/exec)
- Código del endpoint: [`Code.gs`](./Code.gs)

La hoja contiene la pestaña `Rotacion`: `ultimo_destino_usado` en `A1` y el último destino utilizado (`1` o `2`) en `A2`. Si todavía no existe, la primera solicitud la crea e inicializa en `2`, de modo que el primer pedido se asigne al destino `1` (`+5492234984494`). Las siguientes solicitudes alternan entre `2` (`+5492234486526`) y `1`. Un bloqueo de Apps Script serializa las solicitudes concurrentes para no asignar el mismo turno dos veces.

## Operación y cambios

El endpoint ejecuta como propietario de la hoja y es público para que los clientes puedan usarlo. Solo expone la asignación del siguiente destino; la hoja no se comparte públicamente. El callback JSONP se valida antes de emitir JavaScript y el estado no acepta valores distintos de `1` o `2`.

**Importante:** la URL `/exec` será pública para permitir que los clientes realicen pedidos. Cada checkout válido consume el siguiente turno. No coloques contraseñas ni claves privadas en `index.html`.
