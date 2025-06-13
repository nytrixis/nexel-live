import { Suspense } from 'react';
import AuthPageContent from './AuthPageContent';

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageContent />
    </Suspense>
  );
}
