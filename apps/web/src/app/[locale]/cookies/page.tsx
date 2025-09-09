import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy - NumTrip',
  description: 'Cookie Policy for NumTrip - How we use cookies and tracking technologies',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
        <p className="text-gray-700 mb-4">
          Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
        </p>
        <p className="text-gray-700 mb-4">
          This Cookie Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Service, your choices regarding cookies and further information about cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
        <p className="text-gray-700 mb-4">
          When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><strong>Essential cookies:</strong> To enable certain features of the Service</li>
          <li><strong>Analytical/performance cookies:</strong> To analyze how you use the Service and monitor the Service's performance</li>
          <li><strong>Functionality cookies:</strong> To remember your preferences and settings</li>
          <li><strong>Advertising cookies:</strong> To deliver relevant advertisements to you</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
        
        <h3 className="text-xl font-semibold mb-3 mt-4">Session Cookies</h3>
        <p className="text-gray-700 mb-4">
          We use Session Cookies to operate our Service. These cookies are deleted when you close your browser.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Persistent Cookies</h3>
        <p className="text-gray-700 mb-4">
          We use Persistent Cookies to remember your preferences and various settings. These cookies remain on your device until they expire or you delete them.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Essential Cookies</h3>
        <p className="text-gray-700 mb-4">
          These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Analytics Cookies</h3>
        <p className="text-gray-700 mb-4">
          We use Google Analytics to understand how visitors interact with our website. These cookies collect information in an anonymous form, including the number of visitors to the site, where visitors have come to the site from, and the pages they visited.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Advertising Cookies</h3>
        <p className="text-gray-700 mb-4">
          We use Google AdSense to display advertisements on our website. These cookies may track your browsing activity across different websites to show you relevant ads. The information collected is anonymized and cannot be used to personally identify you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
        <p className="text-gray-700 mb-4">
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver advertisements on and through the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Google Analytics</h3>
        <p className="text-gray-700 mb-4">
          We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered is used to create reports about the use of our website.
        </p>
        <p className="text-gray-700 mb-4">
          You can opt-out of Google Analytics by visiting: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Google AdSense</h3>
        <p className="text-gray-700 mb-4">
          We use Google AdSense to display advertisements. Google may use cookies to serve ads based on a user's prior visits to your website or other websites.
        </p>
        <p className="text-gray-700 mb-4">
          You can opt-out of personalized advertising by visiting: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. What Are Your Choices Regarding Cookies</h2>
        <p className="text-gray-700 mb-4">
          If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
        </p>
        <p className="text-gray-700 mb-4">
          Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Browser Settings</h3>
        <p className="text-gray-700 mb-4">
          Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-4">Managing Cookies in Popular Browsers</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Opt-Out Options</h2>
        <p className="text-gray-700 mb-4">
          You can opt-out of interest-based advertising by third-party advertisers and ad networks who are members of the Network Advertising Initiative (NAI) or who follow the Digital Advertising Alliance's (DAA) Self-Regulatory Principles for Online Behavioral Advertising by visiting:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NAI opt-out page</a></li>
          <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DAA opt-out page</a></li>
          <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Cookie Categories and Purposes</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left">Category</th>
                <th className="px-4 py-2 border-b text-left">Purpose</th>
                <th className="px-4 py-2 border-b text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Essential</td>
                <td className="px-4 py-2 border-b">Authentication, security, user preferences</td>
                <td className="px-4 py-2 border-b">Session/1 year</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 border-b">Analytics</td>
                <td className="px-4 py-2 border-b">Website usage statistics, performance monitoring</td>
                <td className="px-4 py-2 border-b">2 years</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Advertising</td>
                <td className="px-4 py-2 border-b">Personalized ads, ad performance measurement</td>
                <td className="px-4 py-2 border-b">30 days - 2 years</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 border-b">Functional</td>
                <td className="px-4 py-2 border-b">Language preferences, user settings</td>
                <td className="px-4 py-2 border-b">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Updates to This Cookie Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Where Can You Get Further Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about our use of cookies or other technologies, please email us at privacy@numtrip.com or contact us via our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
        </p>
        <p className="text-gray-700 mb-4">
          For more information about cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">All About Cookies</a>.
        </p>
        <p className="text-gray-700 mb-4">
          This Cookie Policy is part of our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </section>
    </div>
  );
}