import { Link } from "react-router-dom";
import LegalPageLayout from "@/components/LegalPageLayout";

const Privacy = () => (
  <LegalPageLayout title="Privacy Policy" effectiveDate="Effective date: September 22, 2026">
    <p>
      This Privacy Policy explains how BOMBSHELL.VIP (&quot;we,&quot; &quot;us&quot;) collects, uses, and protects your information when you visit{" "}
      <a className="underline underline-offset-4 hover:text-foreground" href="https://bombshell.vip">https://bombshell.vip</a> or buy from us.
    </p>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">1. Information we collect</h2>
      <ul className="space-y-2">
        <li>- Information you give us: name, email, phone number, shipping and billing address, and order details when you buy, sign up for emails or texts, or contact us.</li>
        <li>- Payment information: processed securely by Shopify and its payment partners. We never see or store your full card number.</li>
        <li>- Information collected automatically: device and browser type, IP address, pages viewed, and how you interact with the site, collected through cookies and similar tools.</li>
      </ul>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">2. How we use it</h2>
      <ul className="space-y-2">
        <li>- Process and ship orders, and send order updates</li>
        <li>- Respond to questions and provide customer support</li>
        <li>- Send marketing emails and texts if you&apos;ve opted in</li>
        <li>- Improve our website, products, and marketing</li>
        <li>- Prevent fraud and meet legal obligations</li>
      </ul>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">3. How we share it</h2>
      <p>We share information only with service providers who help us run the store, such as Shopify (store and checkout), payment processors, shipping carriers, Klaviyo (email and SMS), and analytics providers. They may use it only to provide services to us. We may also share information if required by law. We do not sell your personal information.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">4. SMS / text messaging</h2>
      <p>If you opt in to texts, we collect your mobile number and consent to send you marketing messages. Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties. Text STOP to opt out at any time or HELP for help. See our Mobile Terms of Service at <Link className="underline underline-offset-4 hover:text-foreground" to="/sms-terms">https://bombshell.vip/sms-terms</Link>.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">5. Email</h2>
      <p>You can unsubscribe from marketing emails at any time using the link at the bottom of any email. We&apos;ll still send order-related emails.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">6. Cookies</h2>
      <p>We use cookies to keep the site working, remember your cart, understand site traffic, and measure marketing. You can block or delete cookies in your browser settings, but some parts of the site may not work properly.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">7. Your rights</h2>
      <p>Depending on where you live (including California and the EU/UK), you may have the right to access, correct, or delete your personal information, or to opt out of certain uses of it. To make a request, email <a className="underline underline-offset-4 hover:text-foreground" href="mailto:bombshellsupport@gmail.com">bombshellsupport@gmail.com</a>. We won&apos;t treat you differently for exercising these rights.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">8. How long we keep it</h2>
      <p>We keep your information as long as needed to fulfill orders, provide our services, and meet legal, tax, and accounting requirements, then delete or anonymize it.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">9. Security</h2>
      <p>We use reasonable safeguards to protect your information, but no online system is 100% secure.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">10. Children</h2>
      <p>Our site isn&apos;t directed at children under 13, and we don&apos;t knowingly collect their information.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">11. Changes</h2>
      <p>We may update this policy. The latest version and its effective date will always be posted on this page.</p>
    </section>

    <section>
      <h2 className="mb-3 text-base font-bold tracking-normal md:text-lg">12. Contact us</h2>
      <p>BOMBSHELL.VIP, <a className="underline underline-offset-4 hover:text-foreground" href="mailto:bombshellsupport@gmail.com">bombshellsupport@gmail.com</a></p>
    </section>
  </LegalPageLayout>
);

export default Privacy;