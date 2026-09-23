# SMS discount popup

## Build
- Add a minimalist Bombshell popup that appears once per visitor after a short delay.
- Offer 15% off in exchange for a phone number, without displaying a discount code.
- Submit through the existing SMS signup connection so contacts enter the Text Messaging List and receive the configured text automation.
- Show clear loading, validation, failure, and success states; close cleanly and remember dismissal.
- Include the required SMS consent copy with working Privacy Policy and SMS Terms links.
- Display it site-wide except on the two legal pages.

## Technical details
- Reuse the existing phone normalization and `klaviyo-subscribe` function.
- Keep the current homepage SMS form unchanged.
- Use the established fonts, semantic colors, square corners, and mobile-safe sizing.
- Verify successful submission behavior with the network request intercepted so no test contact is added.
