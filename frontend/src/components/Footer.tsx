import React from 'react';

export function Footer() {
  return (
    <footer className="bg-clinical-900 text-clinical-100 py-10 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-clinical-700 pb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Maternal Health Platform</h3>
            <p className="text-clinical-300 text-sm leading-relaxed">
              Advanced multimodal risk assessment and fetal growth monitoring designed to empower healthcare professionals and expectant mothers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-clinical-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clinical Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-clinical-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-clinical-400">
          <p>&copy; {new Date().getFullYear()} Maternal Health Platform. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Clinical Decision Support v1.0</p>
        </div>
      </div>
    </footer>
  );
}
