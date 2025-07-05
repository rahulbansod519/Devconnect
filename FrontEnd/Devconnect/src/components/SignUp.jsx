// SignUp.jsx
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      afterSignUp={() => {
        // User will be automatically saved via webhook
        console.log('✅ User signed up - webhook will handle DB storage');
      }}
    />
  );
};

export default SignUpPage;