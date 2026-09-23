# Combat Zip Up Bundle Promotion

## Build
- Add a full-width bundle section directly below the home video with the three existing Combat Zip Ups, the $449.97 crossed-out price, the $349.97 offer, and one size selector per color. Start all three on the same first available size while allowing each selection to change independently.
- Add one “Add All 3 to Cart” action that adds one of each selected jacket and opens the existing cart.
- Add cart progress based on total Combat Zip Up quantity. For one or two items, show how many more qualify and offer quick-add controls for missing colors. At three or more, show the unlocked message. Shopify remains the source of truth for the automatic $100 checkout discount.
- Add a compact linked bundle message below Add to Cart on each Combat Zip Up page.
- Add a subtle returning-visitor promotion after 10 seconds, or desktop exit intent, using the three existing jacket images. Closing it suppresses future displays in that browser; its action returns to the home bundle section.

## Technical details
- Reuse the live Shopify product records, variants, product images, cart context, and checkout path; create no Shopify products or discounts.
- Extend the cart API only as needed to add several selected variants in one action and track qualifying quantities/colors reliably.
- Keep styling aligned with Bombshell’s square, minimal editorial system and verify desktop and mobile interactions.
