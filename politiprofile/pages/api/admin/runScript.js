import { exec } from 'child_process';
import { promisify } from 'util';
import { verifyAdminAccess } from '../../../helpers/adminAuth';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify admin access
  const isAdmin = await verifyAdminAccess(req);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const { script } = req.body;

  const allowedScripts = {
    'linkFightersToBioguide': 'scripts/linkFightersToBioguide.js',
    'analyzeFighterPositions': 'scripts/analyzeFighterPositions.js',
    'migrateFighterTopics': 'scripts/migrateFighterTopics.js',
    'updateBills': 'scripts/updateBills.js'
  };

  if (!allowedScripts[script]) {
    return res.status(400).json({ error: 'Invalid script name' });
  }

  try {
    const scriptPath = allowedScripts[script];
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      timeout: 300000 // 5 minute timeout
    });

    return res.status(200).json({
      message: 'Script completed successfully',
      output: stdout,
      errors: stderr || null
    });

  } catch (error) {
    console.error('Script execution error:', error);
    return res.status(500).json({
      error: 'Script execution failed',
      message: error.message,
      output: error.stdout || '',
      stderr: error.stderr || ''
    });
  }
}

// Increase timeout for long-running scripts
export const config = {
  api: {
    responseLimit: false,
    externalResolver: true,
  },
};
