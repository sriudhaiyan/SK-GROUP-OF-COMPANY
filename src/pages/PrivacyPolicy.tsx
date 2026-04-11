import React from 'react';
import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 bg-zinc-900/50 p-8 rounded-2xl border border-white/10">
        <h1 className="text-4xl font-display mb-8 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Privacy <span className="text-[#cc0000]">Policy</span>
        </h1>
        
        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-[#cc0000] prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="text-gray-400 text-sm mb-8">Last updated: April 08, 2026</p>
          
          <p>
            This Privacy Notice for SK GROUP OF COMPANY ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
          </p>
          <ul>
            <li>Visit our website at <a href="https://sk-group-of-company.vercel.app/auth" target="_blank" rel="noopener noreferrer">https://sk-group-of-company.vercel.app/auth</a> or any website of ours that links to this Privacy Notice</li>
            <li>Engage with us in other related ways, including any marketing or events</li>
          </ul>

          <p>
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:skgroupofcompany28@gmail.com">skgroupofcompany28@gmail.com</a>.
          </p>

          <h2>SUMMARY OF KEY POINTS</h2>
          <p>
            <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
          </p>
          <p>
            <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
          </p>
          <p>
            <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
          </p>
          <p>
            <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.
          </p>
          <p>
            <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.
          </p>
          <p>
            <strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
          </p>
          <p>
            <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
          </p>
          <p>
            <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
          </p>

          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3>Personal information you disclose to us</h3>
          <p><em>In Short: We collect personal information that you provide to us.</em></p>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          <p><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul>
            <li>names</li>
            <li>email addresses</li>
            <li>usernames</li>
            <li>passwords</li>
            <li>contact or authentication data</li>
            <li>billing addresses</li>
            <li>debit/credit card numbers</li>
          </ul>
          <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
          <p><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider.</p>
          <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
          
          <h3>Google API</h3>
          <p>Our use of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" target="_blank" rel="noopener noreferrer">Limited Use requirements</a>.</p>

          <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p><em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes only with your prior explicit consent.</em></p>
          <p><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></p>
          <ul>
            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
            <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
          </ul>

          <h2>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h2>
          <p><em>In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</em></p>

          <h2>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p><em>In Short: We may share information in specific situations described in this section and/or with the following third parties.</em></p>
          <p>We may need to share your personal information in the following situations:</p>
          <ul>
            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location.</li>
          </ul>

          <h2>5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</h2>
          <p><em>In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</em></p>

          <h2>6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p><em>In Short: We may use cookies and other tracking technologies to collect and store your information.</em></p>

          <h2>7. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
          <p><em>In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</em></p>
          <p>As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions.</p>

          <h2>8. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
          <p><em>In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em></p>

          <h2>9. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p><em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em></p>

          <h2>10. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p><em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em></p>

          <h2>11. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p><em>In Short: We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction.</em></p>

          <h2>12. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p><em>In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em></p>

          <h2>13. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.</p>

          <h2>14. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
          <p><em>In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.</em></p>

          <h2>15. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p><em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></p>

          <h2>16. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>If you have questions or comments about this notice, you may email us at <a href="mailto:skgroupofcompany28@gmail.com">skgroupofcompany28@gmail.com</a> or contact us by post at:</p>
          <address className="not-italic">
            SK GROUP OF COMPANY<br />
            __________<br />
            tamil nadu<br />
            India
          </address>

          <h2>17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p>Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information.</p>
        </div>
      </div>
    </motion.div>
  );
}
