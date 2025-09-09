import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - NumTrip',
  description: 'Privacy Policy for NumTrip - How we collect, use, and protect your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-4">
          NumTrip ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.numtrip.com, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site").
        </p>
        <p className="text-gray-700 mb-4">
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mb-3 mt-4">Personal Data</h3>
        <p className="text-gray-700 mb-4">
          Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Derivative Data</h3>
        <p className="text-gray-700 mb-4">
          Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Financial Data</h3>
        <p className="text-gray-700 mb-4">
          Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect through a secure payment processor.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Data from Social Networks</h3>
        <p className="text-gray-700 mb-4">
          User information from social networking sites, such as Google, Facebook, Instagram, Twitter, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Use of Your Information</h2>
        <p className="text-gray-700 mb-4">
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information.</li>
          <li>Email you regarding your account or order.</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions.</li>
          <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
          <li>Increase the efficiency and operation of the Site.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          <li>Notify you of updates to the Site.</li>
          <li>Offer new products, services, and/or recommendations to you.</li>
          <li>Perform other business activities as needed.</li>
          <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
          <li>Process payments and refunds.</li>
          <li>Request feedback and contact you about your use of the Site.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
          <li>Send you a newsletter.</li>
          <li>Solicit support for the Site.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Disclosure of Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-4">By Law or to Protect Rights</h3>
        <p className="text-gray-700 mb-4">
          If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Business Transfers</h3>
        <p className="text-gray-700 mb-4">
          We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Third-Party Service Providers</h3>
        <p className="text-gray-700 mb-4">
          We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Marketing Communications</h3>
        <p className="text-gray-700 mb-4">
          With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Online Postings</h3>
        <p className="text-gray-700 mb-4">
          When you post comments, contributions, or other content to the Site, your posts may be viewed by all users and may be publicly distributed outside the Site in perpetuity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 mb-4">
          We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
        </p>
        <p className="text-gray-700 mb-4">
          For more information on how we use cookies, please refer to our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Third-Party Advertising</h2>
        <p className="text-gray-700 mb-4">
          We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies to serve ads based on your prior visits to our Site or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Ads Settings</a>.
        </p>
        <p className="text-gray-700 mb-4">
          We comply with Google AdSense program policies and terms of service. We do not place ads on pages with prohibited content, and we ensure our content meets Google's content requirements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Security of Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Your Data Protection Rights (GDPR)</h2>
        <p className="text-gray-700 mb-4">
          If you are a resident of the European Economic Area (EEA), you have certain data protection rights. NumTrip aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
        </p>
        <p className="text-gray-700 mb-4">
          You have the following data protection rights:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
          <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h3>
          <p className="text-blue-800 text-sm mb-3">
            You can exercise any of your data protection rights by using our dedicated form or contacting us directly:
          </p>
          <div className="space-y-2">
            <div>
              <Link href="/data-subject-rights" className="text-blue-600 hover:text-blue-800 font-medium">
                📝 Submit a Data Subject Rights Request
              </Link>
            </div>
            <div>
              <Link href="/cookie-preferences" className="text-blue-600 hover:text-blue-800 font-medium">
                🍪 Manage Cookie Preferences
              </Link>
            </div>
            <div className="text-blue-700 text-sm">
              <strong>Email:</strong> privacy@numtrip.com | <strong>Response time:</strong> 30 days maximum
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">Legal Basis for Processing</h3>
        <p className="text-gray-700 mb-4">
          We process your personal data under the following legal bases:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><strong>Consent:</strong> For marketing communications, analytics cookies, and advertising cookies</li>
          <li><strong>Legitimate Interest:</strong> For improving our services, fraud prevention, and business operations</li>
          <li><strong>Contract Performance:</strong> For providing our services and processing business listings</li>
          <li><strong>Legal Obligation:</strong> For compliance with legal requirements and regulatory obligations</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">Data Protection Officer</h3>
        <p className="text-gray-700 mb-4">
          We have appointed a Data Protection Officer (DPO) to ensure compliance with data protection laws. 
          You can contact our DPO regarding any data protection matters:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm">
            <strong>Data Protection Officer</strong><br />
            Email: dpo@numtrip.com<br />
            Phone: +57 300 123 4567<br />
            Address: Cartagena, Colombia
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">Right to Lodge a Complaint</h3>
        <p className="text-gray-700 mb-4">
          If you believe we have not handled your personal data in accordance with data protection laws, 
          you have the right to lodge a complaint with your local supervisory authority. In Colombia, 
          this is the Superintendencia de Industria y Comercio (SIC).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. California Privacy Rights (CCPA)</h2>
        <p className="text-gray-700 mb-4">
          If you are a California resident, you have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Know what personal information is being collected about you.</li>
          <li>Know whether your personal information is sold or disclosed and to whom.</li>
          <li>Say no to the sale of personal information.</li>
          <li>Access your personal information.</li>
          <li>Request that a business delete any personal information about you.</li>
          <li>Not be discriminated against for exercising your privacy rights.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
        <p className="text-gray-700 mb-4">
          We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us at privacy@numtrip.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Data Retention</h2>
        <p className="text-gray-700 mb-4">
          We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. International Data Transfers</h2>
        <p className="text-gray-700 mb-4">
          Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-700">
          NumTrip<br />
          Email: privacy@numtrip.com<br />
          Website: www.numtrip.com
        </p>
      </section>
    </div>
  );
}