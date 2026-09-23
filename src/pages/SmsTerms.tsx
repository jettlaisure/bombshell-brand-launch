import { Link } from "react-router-dom";
import LegalPageLayout from "@/components/LegalPageLayout";

const SmsTerms = () => (
  <LegalPageLayout title="Mobile Terms of Service" effectiveDate="Effective date: September 22, 2026">
    <p><strong>1. Program.</strong> BOMBSHELL.VIP (&quot;we,&quot; &quot;us&quot;) offers a recurring SMS/MMS marketing program with promotions, new product drops, restock alerts, cart reminders, and order updates.</p>

    <p><strong>2. Consent.</strong> By opting in (through a website form, at checkout, or by texting a keyword), you agree to receive recurring automated marketing text messages from BOMBSHELL.VIP at the number you provide. Consent is not a condition of any purchase. You confirm you are the account holder or have the account holder&apos;s permission.</p>

    <p><strong>3. Message frequency.</strong> Message frequency varies.</p>

    <p><strong>4. Cost.</strong> Message and data rates may apply. Check your mobile plan for details.</p>

    <p><strong>5. Opting out.</strong> Text STOP to cancel at any time. You&apos;ll get one final message confirming you&apos;ve been unsubscribed and won&apos;t receive further messages unless you opt in again. You can also reply END, CANCEL, UNSUBSCRIBE, or QUIT.</p>

    <p><strong>6. Help.</strong> Text HELP for help, or email us at <a className="underline underline-offset-4 hover:text-foreground" href="mailto:bombshellsupport@gmail.com">bombshellsupport@gmail.com</a>.</p>

    <p><strong>7. Carriers.</strong> Carriers are not liable for delayed or undelivered messages.</p>

    <p><strong>8. Privacy.</strong> We don&apos;t sell or share your mobile number or SMS consent with third parties for their marketing purposes. See our Privacy Policy at <Link className="underline underline-offset-4 hover:text-foreground" to="/privacy">https://bombshell.vip/privacy</Link>.</p>

    <p><strong>9. Changes.</strong> We may update these terms at any time. The latest version will always be posted on this page.</p>

    <p><strong>10. Contact.</strong> BOMBSHELL.VIP, <a className="underline underline-offset-4 hover:text-foreground" href="mailto:bombshellsupport@gmail.com">bombshellsupport@gmail.com</a>.</p>
  </LegalPageLayout>
);

export default SmsTerms;