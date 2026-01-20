/**
 * API Client for Exercise Backend
 * Handles REST endpoints for session management
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Pro athlete exercise icons (using Lucide icon names)
export const EXERCISES = [
  { id: 'pushup', name: 'Push-ups', icon: 'Dumbbell', description: 'Upper body strength' },
  { id: 'squat', name: 'Squats', icon: 'Footprints', description: 'Lower body power' },
  { id: 'situp', name: 'Sit-ups', icon: 'Activity', description: 'Core strength' },
  { id: 'sitnreach', name: 'Sit & Reach', icon: 'Ruler', description: 'Flexibility test' },
  { id: 'skipping', name: 'Skipping', icon: 'Zap', description: 'Cardio endurance' },
  { id: 'jumpingjacks', name: 'Jumping Jacks', icon: 'Sparkles', description: 'Full body cardio' },
  { id: 'vjump', name: 'Vertical Jump', icon: 'ArrowUp', description: 'Explosive power' },
  { id: 'bjump', name: 'Broad Jump', icon: 'MoveRight', description: 'Horizontal distance' },
];

/**
 * Create a new exercise session
 * @param {string} exercise - Exercise type
 * @param {number} heightCm - User height in cm
 * @returns {Promise<{session_id: string, websocket_url: string}>}
 */
export async function createSession(exercise, heightCm = 170) {
  const response = await fetch(
    `${API_BASE}/session/create?exercise=${exercise}&height_cm=${heightCm}`,
    { method: 'POST' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create session');
  }
  
  return response.json();
}

/**
 * Get session info
 * @param {string} sessionId
 */
export async function getSessionInfo(sessionId) {
  const response = await fetch(`${API_BASE}/session/${sessionId}`);
  if (!response.ok) {
    throw new Error('Session not found');
  }
  return response.json();
}

/**
 * Get session metrics (final results)
 * @param {string} sessionId
 */
export async function getSessionMetrics(sessionId) {
  const response = await fetch(`${API_BASE}/session/${sessionId}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to get metrics');
  }
  return response.json();
}

/**
 * Delete/end a session
 * @param {string} sessionId
 */
export async function deleteSession(sessionId) {
  const response = await fetch(`${API_BASE}/session/${sessionId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete session');
  }
  return response.json();
}

/**
 * Get WebSocket URL for a session
 * @param {string} sessionId
 * @returns {string}
 */
export function getWebSocketUrl(sessionId) {
  const wsProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' 
    ? 'wss:' 
    : 'ws:';
  const host = API_BASE.replace(/^https?:\/\//, '');
  return `${wsProtocol}//${host}/ws/${sessionId}`;
}
