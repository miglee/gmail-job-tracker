import React, {useState} from 'react';
//removed useeffect because of warning
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import EmailStats from './EmailStats';

const GOOGLE_CLIENT_ID = '677057704680-cfa0p3qc6b4nnntng7mjuf32ofr2vfa8.apps.googleusercontent.com';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);



  // const handleLoginSuccess = async (credentialResponse) => {
  //   setAccessToken(credentialResponse.access_token);
  //   setIsAuthenticated(true);
  //   await fetchEmails(credentialResponse.access_token);
  // };

  // const handleLoginSuccess = async (credentialResponse) => {
  //   console.log('Credential Response:', credentialResponse);
  //   if (credentialResponse.access_token) {
  //     setAccessToken(credentialResponse.access_token);
  //     setIsAuthenticated(true);
  //     try {
  //       await fetchEmails(credentialResponse.access_token);
  //     } catch (error) {
  //       console.error('Error in fetchEmails:', error);
  //     }
  //   } else {
  //     console.error('No access token received');
  //   }
  // };

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Credential Response:', credentialResponse);
    if (credentialResponse.credential) {
      setAccessToken(credentialResponse.credential);
      setIsAuthenticated(true);
      try {
        await fetchEmails(credentialResponse.credential);
      } catch (error) {
        console.error('Error in fetchEmails:', error);
      }
    } else {
      console.error('No credential received');
    }
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  const fetchEmails = async (idToken) => {
    try {
      console.log('Using ID token:', idToken);
      const response = await axios.get(
        'https://www.googleapis.com/gmail/v1/users/me/messages',
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          params: {
            q: `after:${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
          },
        }
      );

      const messages = response.data.messages;
      const applicationEmails = [];
      const rejectionEmails = [];

      for (const message of messages) {
        const emailData = await axios.get(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const subject = emailData.data.payload.headers.find(
          (header) => header.name === 'Subject'
        ).value;

        if (subject.toLowerCase().includes('application confirmation')) {
          applicationEmails.push({
            id: message.id,
            subject,
            company: 'Company Name', // You'd need to extract this from the email content
          });
        } else if (subject.toLowerCase().includes('application status') || subject.toLowerCase().includes('thank you for your interest')) {
          rejectionEmails.push({
            id: message.id,
            subject,
            company: 'Company Name', // You'd need to extract this from the email content
          });
        }
      }

      setEmailData({ applications: applicationEmails, rejections: rejectionEmails });
    } catch (error) {
      console.error('Error fetching emails:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Gmail Job Tracker</h1>
        {!isAuthenticated ? (
          <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          useOneTap
          flow="implicit"
          />
        ) : (
          <EmailStats emailData={emailData} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;