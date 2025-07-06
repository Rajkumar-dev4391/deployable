import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to MCP Chat Bot. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              application and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>When you use our service, we may collect the following information:</p>
            <ul>
              <li>Google account information (name, email, profile picture)</li>
              <li>Chat messages and conversation history</li>
              <li>Files and documents you upload</li>
              <li>Usage data and analytics</li>
            </ul>

            <h3>Google Workspace Integration</h3>
            <p>
              Our application integrates with Google Workspace services. When you grant permission, we may access:
            </p>
            <ul>
              <li>Google Drive files and folders</li>
              <li>Gmail messages and contacts</li>
              <li>Google Calendar events</li>
              <li>Google Docs, Sheets, and other workspace documents</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To process your requests and provide AI-powered responses</li>
              <li>To integrate with Google Workspace services as requested</li>
              <li>To improve our service and user experience</li>
              <li>To communicate with you about service updates</li>
            </ul>

            <h2>Data Storage and Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul>
              <li>Data is encrypted in transit and at rest</li>
              <li>Access to your data is strictly controlled</li>
              <li>We use secure cloud infrastructure (Supabase)</li>
              <li>Regular security audits and updates</li>
            </ul>

            <h2>Data Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations (under strict confidentiality)</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
            </ul>

            <h2>Google API Services</h2>
            <p>
              Our use of information received from Google APIs will adhere to the 
              <a href="https://developers.google.com/terms/api-services-user-data-policy" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                Google API Services User Data Policy
              </a>, including the Limited Use requirements.
            </p>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul>
              <li>Essential cookies for authentication and security</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings</li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, 
              please contact us at:
            </p>
            <ul>
              <li>Email: privacy@mcpchatbot.com</li>
              <li>Address: [Your Company Address]</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes 
              outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2>Third-Party Services</h2>
            <p>Our application integrates with the following third-party services:</p>
            <ul>
              <li><strong>Google Workspace:</strong> For accessing your Google services</li>
              <li><strong>OpenAI:</strong> For AI-powered responses</li>
              <li><strong>Supabase:</strong> For data storage and authentication</li>
            </ul>
            <p>
              Each service has its own privacy policy, and we encourage you to review them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};