/**
 * Safety check — rejects dangerous operations before execution
 * Runs as a Code node before the Agent node
 */

const FORBIDDEN_PATTERNS = [
  /\brm\s+-rf\s+\//i,
  /\brm\s+-rf\s+~/i,
  /\bdrop\s+table\b/i,
  /\bdrop\s+database\b/i,
  /\bdelete\s+from\b/i,
  /\bforce\s+push\b.*\bmain\b/i,
  /\bgit\s+push\s+--force\b.*\b(main|master)\b/i,
  /\bsudo\b/i,
  /\bchmod\s+777\b/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /\bformat\s+c:/i,
  /\bdel\s+/i.*\bwindows\b/i,
  /\bcurl\b.*\|\s*bash\b/i,
  /\bwget\b.*\|\s*sh\b/i,
  /\bchmod\s+4755\b/i,
  /\bchmod\s\+s\b/i,
];

const DANGEROUS_KEYWORDS = [
  'delete production',
  'drop production',
  'truncate production',
  'wipe database',
  'destroy',
  'nuke',
  'rm -rf',
];

const task = ($input.first().json.task || '').toLowerCase();

// Check forbidden patterns
for (const pattern of FORBIDDEN_PATTERNS) {
  if (pattern.test(task)) {
    return [{
      json: {
        safe: false,
        reason: `Blocked by safety rule (pattern match): ${pattern.source}`,
        requiresConfirmation: false,
        task: $input.first().json.task,
      }
    }];
  }
}

// Check dangerous keywords
for (const keyword of DANGEROUS_KEYWORDS) {
  if (task.includes(keyword)) {
    return [{
      json: {
        safe: false,
        reason: `Task contains dangerous keyword: "${keyword}". This operation requires manual confirmation.`,
        requiresConfirmation: true,
        task: $input.first().json.task,
      }
    }];
  }
}

// Check for operations that need confirmation
const CONFIRMATION_PATTERNS = [
  { pattern: /\bforce\s+/i, keyword: 'force operation' },
  { pattern: /\bdelete\s+(?:all|every)\b/i, keyword: 'mass deletion' },
  { pattern: /\boverride\b/i, keyword: 'override' },
  { pattern: /\breplace\b.*\bproduction\b/i, keyword: 'production replacement' },
];

const confirmationNeeded = [];
for (const { pattern, keyword } of CONFIRMATION_PATTERNS) {
  if (pattern.test(task)) {
    confirmationNeeded.push(keyword);
  }
}

if (confirmationNeeded.length > 0) {
  return [{
    json: {
      safe: true,
      reason: `Task requires confirmation for: ${confirmationNeeded.join(', ')}`,
      requiresConfirmation: true,
      task: $input.first().json.task,
    }
  }];
}

return [{
  json: {
    safe: true,
    reason: 'Task passed safety check',
    requiresConfirmation: false,
    task: $input.first().json.task,
  }
}];
