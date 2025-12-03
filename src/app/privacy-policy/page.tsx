import { Metadata } from 'next';
import PrivacyPolicyPage from '@/components/Pages/PrivacyPolicyPage'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Future of Gadgets',
  description: 'Read our privacy policy to understand how Future of Gadgets collects, uses, and protects your personal information.',
  keywords: ['privacy policy', 'data protection', 'personal information', 'privacy'],
};


export default function PrivacyPolicy(){
  return (
<PrivacyPolicyPage/>
  )
}


