import React, { useState } from 'react';
import EmailList from './EmailList';

const EmailStats = ({ emailData }) => {
  const [showApplications, setShowApplications] = useState(false);
  const [showRejections, setShowRejections] = useState(false);

  if (!emailData) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Job Application Emails: {emailData.applications.length}</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowApplications(!showApplications)}
        >
          {showApplications ? 'Hide' : 'Expand'}
        </button>
        {showApplications && <EmailList emails={emailData.applications} />}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Job Rejection Emails: {emailData.rejections.length}</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowRejections(!showRejections)}
        >
          {showRejections ? 'Hide' : 'Expand'}
        </button>
        {showRejections && <EmailList emails={emailData.rejections} />}
      </div>
    </div>
  );
};

export default EmailStats;