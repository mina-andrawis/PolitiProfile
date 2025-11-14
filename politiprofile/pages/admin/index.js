// Admin Dashboard - Only accessible to mi.andrawis@gmail.com
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import useGetUserDetails from '../../hooks/user/useGetUserDetails';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { userDetails, loading: userLoading } = useGetUserDetails();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin using userDetails from database
  const isAdmin = userDetails?.email === 'mi.andrawis@gmail.com';

  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!user) {
        router.push('/');
      } else if (userDetails && !isAdmin) {
        // Only redirect after userDetails loads and confirms not admin
        router.push('/');
      }
    }
  }, [user, userDetails, isAdmin, authLoading, userLoading, router]);

  if (authLoading || userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - PolitiProfile</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage fighter positions, analyze data, and configure alignment scoring
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'fighters', label: 'Fighter Positions' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'scripts', label: 'Run Scripts' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === 'overview' && <OverviewTab userId={user?.uid} />}
          {activeTab === 'fighters' && <FighterPositionsTab userId={user?.uid} />}
          {activeTab === 'analytics' && <AnalyticsTab userId={user?.uid} />}
          {activeTab === 'scripts' && <ScriptsTab userId={user?.uid} />}
          {activeTab === 'settings' && <SettingsTab userId={user?.uid} />}
        </div>
      </div>
    </Layout>
  );
}

// Overview Tab Component
function OverviewTab({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/admin/stats?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fighters"
          value={stats?.totalFighters || 0}
          icon="👤"
        />
        <StatCard
          title="With Positions"
          value={stats?.fightersWithPositions || 0}
          icon="✅"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
        />
        <StatCard
          title="Total Bills"
          value={stats?.totalBills || 0}
          icon="📄"
        />
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            • Need to populate fighter positions? Go to the <strong>Run Scripts</strong> tab
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            • Want to edit fighter positions manually? Go to the <strong>Fighter Positions</strong> tab
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            • Check system performance in the <strong>Analytics</strong> tab
          </p>
        </div>
      </div>
    </div>
  );
}

// Fighter Positions Tab Component
function FighterPositionsTab({ userId }) {
  const [fighters, setFighters] = useState([]);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFighters();
  }, []);

  const loadFighters = () => {
    setLoading(true);
    fetch('/api/fighters/getFighters?limit=100')
      .then(res => res.json())
      .then(data => {
        setFighters(data.fighters || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredFighters = fighters.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fighter Positions</h2>
        <input
          type="text"
          placeholder="Search fighters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fighters List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div>Loading fighters...</div>
          ) : (
            filteredFighters.map(fighter => (
              <div
                key={fighter._id}
                onClick={() => setSelectedFighter(fighter)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedFighter?._id === fighter._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="font-semibold">{fighter.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{fighter.office}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {fighter.bioguideId ? `Bio ID: ${fighter.bioguideId}` : 'No bioguide ID'}
                </div>
                {fighter.topicPositions && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Has positions
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Fighter Detail/Editor */}
        <div className="border rounded-lg p-4">
          {selectedFighter ? (
            <FighterEditor fighter={selectedFighter} onUpdate={loadFighters} />
          ) : (
            <div className="text-center text-gray-500 py-20">
              Select a fighter to view/edit positions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fighter Editor Component
function FighterEditor({ fighter, onUpdate }) {
  const [positions, setPositions] = useState(fighter.topicPositions || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const topics = [
    "Health", "Government Operations and Politics", "Armed Forces and National Security",
    "International Affairs", "Taxation", "Crime and Law Enforcement", "Agriculture and Food",
    "Finance and Financial Sector", "Education", "Public Lands and Natural Resources",
    "Transportation and Public Works", "Immigration", "Commerce", "Energy", "Labor and Employment"
  ];

  const updatePosition = (topic, field, value) => {
    setPositions(prev => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/fighters/updateTopicPositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fighterId: fighter._id,
          topicPositions: positions
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Positions saved successfully!');
        onUpdate();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-xl font-bold">{fighter.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{fighter.office}</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {topics.map(topic => (
          <div key={topic} className="border rounded p-3">
            <div className="font-semibold text-sm mb-2">{topic}</div>
            <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs dark:text-gray-400">Stance</label>
              <select
                value={positions[topic]?.stance || 'no-position'}
                onChange={(e) => updatePosition(topic, 'stance', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1 dark:text-black"
              >
                <option value="support">Support</option>
                <option value="oppose">Oppose</option>
                <option value="neutral">Neutral</option>
                <option value="no-position">No Position</option>
              </select>
            </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Priority</label>
                <select
                  value={positions[topic]?.priority || 'low'}
                  onChange={(e) => updatePosition(topic, 'priority', e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1 dark:text-black"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Positions'}
        </button>
        {message && (
          <div className={`text-sm p-2 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ userId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/admin/analytics?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Top User Topics</h3>
          <div className="space-y-2">
            {analytics?.topUserTopics?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm">{item.topic}</span>
                <span className="text-sm font-semibold">{item.count} users</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Fighter Position Coverage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>With Positions:</span>
              <span className="font-semibold">{analytics?.positionCoverage?.withPositions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Without Positions:</span>
              <span className="font-semibold">{analytics?.positionCoverage?.withoutPositions || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analytics?.positionCoverage?.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scripts Tab Component
function ScriptsTab({ userId }) {
  const [running, setRunning] = useState(null);
  const [output, setOutput] = useState('');

  const runScript = async (scriptName) => {
    if (!userId) {
      setOutput('Error: Not authenticated');
      return;
    }

    setRunning(scriptName);
    setOutput(`Running ${scriptName}...\n`);

    try {
      const res = await fetch('/api/admin/runScript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptName, userId })
      });

      const data = await res.json();
      setOutput(prev => prev + '\n' + (data.output || data.message || 'Completed'));
    } catch (err) {
      setOutput(prev => prev + `\nError: ${err.message}`);
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Run Scripts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScriptCard
          title="Update Bills Database"
          description="Import new bills from congress data repository"
          scriptName="updateBills"
          onRun={runScript}
          running={running === 'updateBills'}
        />
        <ScriptCard
          title="Link Fighters to Bioguide"
          description="Match fighter names to legislators and add bioguideId"
          scriptName="linkFightersToBioguide"
          onRun={runScript}
          running={running === 'linkFightersToBioguide'}
        />
        <ScriptCard
          title="Analyze Fighter Positions"
          description="Auto-analyze positions from bill sponsorship"
          scriptName="analyzeFighterPositions"
          onRun={runScript}
          running={running === 'analyzeFighterPositions'}
        />
        <ScriptCard
          title="Migrate Fighter Topics"
          description="Initialize topicPositions for all fighters"
          scriptName="migrateFighterTopics"
          onRun={runScript}
          running={running === 'migrateFighterTopics'}
        />
      </div>

      {output && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
          {output}
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ userId }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="text-gray-600 dark:text-gray-400">
        Settings panel coming soon...
      </div>
      {userId && (
        <div className="text-xs text-gray-500 mt-4">
          User ID: {userId}
        </div>
      )}
    </div>
  );
}

// Reusable Components
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function ScriptCard({ title, description, scriptName, onRun, running }) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <button
        onClick={() => onRun(scriptName)}
        disabled={running}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {running ? 'Running...' : 'Run Script'}
      </button>
    </div>
  );
}
