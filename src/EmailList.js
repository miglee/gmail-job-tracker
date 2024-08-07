import React from 'react';

const EmailList = ({ emails }) => {
  return (
    <ul className="list-disc pl-5">
      {emails.map((email) => (
        <li key={email.id} className="mb-2">
          
            href={`https://mail.google.com/mail/u/0/#inbox/${email.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {email.company} - {email.subject}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default EmailList;