/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { Dashboard } from '@/src/pages/Dashboard';
import { NoteKeeper } from '@/src/pages/NoteKeeper';
import { RegulatoryReview } from '@/src/pages/RegulatoryReview';
import { Settings } from '@/src/pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'notekeeper' && <NoteKeeper />}
      {activeTab === 'regulatory' && <RegulatoryReview />}
      {activeTab === 'settings' && <Settings />}
    </AppLayout>
  );
}
