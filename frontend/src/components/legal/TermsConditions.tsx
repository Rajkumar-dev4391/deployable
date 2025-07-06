import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/settings">
              <Button variant="ghost" size="sm" icon={ArrowLeft}>
                Back to Settings
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-gray-600 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using MCP Chat Bot, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>

            <h2>Description of Service</h2>
            <p>
              MCP Chat Bot is an AI-powered conversational tool that integrates with Google Workspace 
              services to help you manage your productivity tasks. Our service includes:
            </p>
            <ul>
              <li>AI-powered chat interface</li>
              <li>Google Drive integration</li>
              <li>Gmail management</li>
              <li>Google Calendar integration</li>
              <li>Document creation and editing</li>
              <li>File upload and analysis</li>
            </ul>

            <h2>User Accounts</h2>
            <h3>Account Creation</h3>
            <p>
              To use our service, you must create an account using your Google account. You are 
              responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h3>Account Responsibilities</h3>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious software or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the service's operation</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Share inappropriate, offensive, or illegal content</li>
            </ul>

            <h2>Google Workspace Integration</h2>
            <h3>Authorization</h3>
            <p>
              By connecting your Google account, you authorize us to access your Google Workspace 
              data as necessary to provide our services. This includes:
            </p>
            <ul>
              <li>Reading and writing Google Drive files</li>
              <li>Sending emails on your behalf</li>
              <li>Creating and managing calendar events</li>
              <li>Accessing Google Docs, Sheets, and other workspace applications</li>
            </ul>

            <h3>Data Usage</h3>
            <p>
              We will only access your Google data when explicitly requested by you through our 
              interface. We do not access your data for any other purposes.
            </p>

            <h2>Intellectual Property</h2>
            <h3>Our Content</h3>
            <p>
              The service and its original content, features, and functionality are owned by us 
              and are protected by international copyright, trademark, and other intellectual 
              property laws.
            </p>

            <h3>User Content</h3>
            <p>
              You retain ownership of any content you upload or create using our service. By using 
              our service, you grant us a limited license to use your content solely to provide 
              our services.
            </p>

            <h2>Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also 
              governs your use of the service, to understand our practices.
            </p>

            <h2>Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee that the service will 
              be available 100% of the time. We may experience downtime for:
            </p>
            <ul>
              <li>Scheduled maintenance</li>
              <li>Emergency repairs</li>
              <li>Third-party service outages</li>
              <li>Force majeure events</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul>
              <li>Loss of profits or data</li>
              <li>Business interruption</li>
              <li>Loss of goodwill</li>
              <li>Computer failure or malfunction</li>
            </ul>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, losses, or 
              expenses arising from your use of the service or violation of these terms.
            </p>

            <h2>Termination</h2>
            <h3>Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting us or using the account 
              deletion feature in your settings.
            </p>

            <h3>Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately if you violate these terms 
              or engage in prohibited activities.
            </p>

            <h3>Effect of Termination</h3>
            <p>
              Upon termination, your right to use the service will cease immediately. We may 
              delete your data according to our data retention policy.
            </p>

            <h2>Disclaimers</h2>
            <p>
              The service is provided "as is" and "as available" without warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul>
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or completeness of content</li>
            </ul>

            <h2>AI-Generated Content</h2>
            <p>
              Our service uses artificial intelligence to generate responses and content. Please note:
            </p>
            <ul>
              <li>AI responses may not always be accurate</li>
              <li>You should verify important information independently</li>
              <li>We are not responsible for decisions made based on AI responses</li>
              <li>AI-generated content should be reviewed before use</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
              Our service integrates with third-party services including Google Workspace and OpenAI. 
              Your use of these services is also subject to their respective terms of service.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of 
              [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the service. Continued use of the service 
              after changes constitutes acceptance of the new terms.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable, the remaining 
              provisions will remain in full force and effect.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <ul>
              <li>Email: legal@mcpchatbot.com</li>
              <li>Address: [Your Company Address]</li>
            </ul>

            <h2>Entire Agreement</h2>
            <p>
              These terms, together with our Privacy Policy, constitute the entire agreement 
              between you and us regarding the use of the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};