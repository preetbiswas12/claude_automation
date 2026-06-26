/**
 * Parse WhatsApp webhook payloads (Twilio & Meta formats)
 * Returns normalized task object for the n8n agent
 */

function extractRepoName(message) {
  if (!message) return null;
  const patterns = [
    /(?:in|to|for|create)\s+(?:repo|repository|project)\s+([a-zA-Z0-9_-]+)/i,
    /(?:repo|repository|project)\s+([a-zA-Z0-9_-]+)/i,
    /([a-zA-Z0-9_-]+)\s+(?:repo|repository|project)/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1].toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  }
  return null;
}

function extractAction(message) {
  if (!message) return 'build';
  const lower = message.toLowerCase();
  if (lower.includes('fix') || lower.includes('bug') || lower.includes('patch')) return 'fix';
  if (lower.includes('scaffold') || lower.includes('init') || lower.includes('create new')) return 'scaffold';
  if (lower.includes('refactor') || lower.includes('restructure')) return 'refactor';
  if (lower.includes('test') || lower.includes('add test')) return 'test';
  if (lower.includes('deploy') || lower.includes('push')) return 'deploy';
  if (lower.includes('document') || lower.includes('readme')) return 'document';
  return 'build';
}

function extractLanguage(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const langs = ['typescript', 'javascript', 'python', 'rust', 'go', 'java', 'kotlin', 'swift', 'ruby', 'php', 'c#', 'c++', 'react', 'nextjs', 'vue', 'angular', 'svelte', 'node', 'express', 'fastapi', 'django', 'flask'];
  for (const lang of langs) {
    if (lower.includes(lang)) return lang;
  }
  return null;
}

const body = $input.first().json.body;

// Detect format: Twilio vs Meta
let message = '';
let from = '';
let timestamp = '';

if (body.Body && body.From) {
  // Twilio format
  message = body.Body;
  from = body.From;
  timestamp = body.MessageSid || new Date().toISOString();
} else if (body.entry && body.entry[0] && body.entry[0].changes) {
  // Meta WhatsApp Business API format
  const change = body.entry[0].changes[0];
  if (change.value && change.value.messages && change.value.messages[0]) {
    const msg = change.value.messages[0];
    message = msg.text?.body || '';
    from = msg.from || '';
    timestamp = new Date().toISOString();
  }
} else {
  // Fallback: treat raw body as message
  message = typeof body === 'string' ? body : JSON.stringify(body);
  from = 'unknown';
  timestamp = new Date().toISOString();
}

const repoName = extractRepoName(message);
const action = extractAction(message);
const language = extractLanguage(message);

return [{
  json: {
    task: message,
    from,
    timestamp,
    repoName: repoName || `auto-project-${Date.now()}`,
    action,
    language,
    // Sanitized values for use in paths/commands
    safeRepoName: (repoName || `project-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, ''),
  }
}];
