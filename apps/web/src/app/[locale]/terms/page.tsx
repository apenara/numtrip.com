import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions - NumTrip',
  description: 'Terms and Conditions for using NumTrip - Your trusted tourism contact directory',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By accessing and using NumTrip ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
        <p className="text-gray-700 mb-4">
          Permission is granted to temporarily access the materials (information or software) on NumTrip for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on NumTrip;</li>
          <li>remove any copyright or other proprietary notations from the materials;</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p className="text-gray-700 mb-4">
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by NumTrip at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User-Generated Content</h2>
        <p className="text-gray-700 mb-4">
          NumTrip allows users to submit, post, and share content including business information, reviews, and contact details ("User Content"). By submitting User Content, you grant NumTrip a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.
        </p>
        <p className="text-gray-700 mb-4">
          You represent and warrant that:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>You own or have the necessary rights to submit the User Content;</li>
          <li>Your User Content does not infringe any third party's rights;</li>
          <li>Your User Content is accurate and not misleading;</li>
          <li>Your User Content does not contain viruses or malicious code;</li>
          <li>Your User Content complies with all applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Business Listings and Verification</h2>
        <p className="text-gray-700 mb-4">
          Business listings on NumTrip may be submitted by users or obtained from public sources. NumTrip makes efforts to verify business information but does not guarantee the accuracy, completeness, or reliability of any business listing.
        </p>
        <p className="text-gray-700 mb-4">
          Business owners may claim and verify their listings through our verification process. Verified businesses are subject to additional terms and may access premium features.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
        <p className="text-gray-700 mb-4">
          You may not use NumTrip:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>For any unlawful purpose or to solicit others to perform unlawful acts;</li>
          <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances;</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
          <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate;</li>
          <li>To submit false or misleading information;</li>
          <li>To upload or transmit viruses or any other type of malicious code;</li>
          <li>To collect or track the personal information of others;</li>
          <li>To spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
          <li>For any obscene or immoral purpose;</li>
          <li>To interfere with or circumvent the security features of the Service.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
        <p className="text-gray-700 mb-4">
          The materials on NumTrip are provided on an 'as is' basis. NumTrip makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        <p className="text-gray-700 mb-4">
          Further, NumTrip does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
        <p className="text-gray-700 mb-4">
          In no event shall NumTrip or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NumTrip, even if NumTrip or a NumTrip authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Advertising and Third-Party Content</h2>
        <p className="text-gray-700 mb-4">
          NumTrip may display advertisements and promotions from third parties. Your business dealings or participation in promotions with such third parties, and any terms, conditions, warranties, or representations associated with such dealings or promotions, are solely between you and such third party. NumTrip is not responsible or liable for any loss or damage of any sort incurred as the result of any such dealings or promotions or as the result of the presence of such third-party advertisers or third-party information on the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          Your use of NumTrip is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
        <p className="text-gray-700 mb-4">
          You agree to defend, indemnify, and hold harmless NumTrip, its officers, directors, employees, agents, licensors, and suppliers from and against any claims, actions, or demands, liabilities, and settlements including without limitation, reasonable legal and accounting fees, resulting from, or alleged to result from, your violation of these Terms and Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
        <p className="text-gray-700 mb-4">
          NumTrip may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
        <p className="text-gray-700 mb-4">
          These Terms shall be governed and construed in accordance with the laws of Colombia, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          NumTrip reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <p className="text-gray-700">
          Email: legal@numtrip.com<br />
          Website: www.numtrip.com
        </p>
      </section>
    </div>
  );
}