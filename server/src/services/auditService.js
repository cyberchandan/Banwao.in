const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ actorId = null, actorRole = 'system', action, entityType, entityId = null, details = {} }) => {
  try {
    await ActivityLog.create({
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      details
    });
  } catch (err) {
    console.error('[Audit Log Error]', err.message);
  }
};

module.exports = { logActivity };
