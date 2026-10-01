# cake — Кексомагия / Cake Magic

A cartoon loaf-cake (кекс, ~20×10×13 cm) baking game. You can't make a bad cake: every choice turns out great.

Live at **https://cake.vibecode.cat**

## How it plays

1. **Filling**: apple, citrus (orange + lemon), chocolate or plum.
2. **Batter**: throw any ingredients into the bowl, in any amount, then stir by holding the button or swirling over the bowl. If anything is missing, the bowl adds it itself.
3. **Oven**: take the cake out whenever you like. If it's too early, oven fairies finish it, and it can't burn.
4. **Decorate**: glaze, sprinkles, toppings, a face, and magic extras (wings, crown, halo, rainbow, candles, shades). Every option is chosen to look good with every other one. "Surprise!" picks a matching set for you.
5. **Ta-da**: the cake gets a generated name and a score above 10/10. You can cut it to see the filling inside and save it as a PNG. Past cakes stay on your shelf (in localStorage).

The interface is in Russian and English, and you can switch between them.

## Deploy

```sh
docker compose up -d --build
```

This serves the game on `127.0.0.1:1338`. The host's main nginx proxies `cake.vibecode.cat` to it; see `deploy/cake.vibecode.cat.conf` for the server block, and add TLS with `certbot --nginx -d cake.vibecode.cat`.

If the proxy can't reach the host loopback (for example, nginx running in its own container), use `CAKE_BIND=0.0.0.0 docker compose up -d --build`.
