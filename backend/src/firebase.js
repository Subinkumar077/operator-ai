const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, update, get } = require('firebase/database');
const { getCoordinates, analyzeTranscript, getNamedEntities } = require('./utils');

const app = initializeApp({
  apiKey: 'AIzaSyCHM9q2pxIV2oq0xvR5S-FWrY9h4LKA11w',
  authDomain: 'bookify-d64a4.firebaseapp.com',
  databaseURL: 'https://bookify-d64a4-default-rtdb.firebaseio.com',
  projectId: 'bookify-d64a4',
  storageBucket: 'bookify-d64a4.firebasestorage.app',
  messagingSenderId: '316599594832',
  appId: '1:316599594832:web:2c50f0e40242dea8464655',
});

const db = getDatabase(app);

module.exports.initCallData = (callSid, payload) => {
  if (!callSid) {
    return;
  }

  return set(ref(db, `/calls/${callSid}`), {
    dateCreated: new Date().toISOString(),
    emergency: '',
    // geocode: undefined,
    // location: undefined,
    live: true,
    name: payload.CallerName || 'Unknown Caller',
    phone: payload.From || 'Unknown Number',
    priority: 'TBD', // HIGH | MEDIUM | LOW | TBD
    status: 'OPEN', // 'OPEN' | 'DISPATCHED' | 'RESOLVED'
    transcript: '',
  });
};

const updateNamedEntitiesWithExpensiveModel = (transcript, callSid) =>
  getNamedEntities(transcript, true).then(async ({ name, location }) => {
    const updates = {};
    if (name) {
      console.log('[Expensive Model] Found name:\t', name);
      updates.name = name;
    }

    if (location) {
      console.log('[Expensive Model] Found location:\t', location);
      updates.location = location;

      const coordinates = await getCoordinates(location);
      if (coordinates.lat && coordinates.lng) {
        updates.geocode = coordinates;
      }
    }

    return update(ref(db, `/calls/${callSid}`), updates);
  });

module.exports.updateOnDisconnect = async (callSid) => {
  if (!callSid) {
    return;
  }

  const updates = {
    live: false,
    dateDisconnected: new Date().toISOString(),
  };

  const snapshot = await get(ref(db, `/calls/${callSid}/transcript`));

  if (snapshot.exists()) {
    const transcript = snapshot.val();

    if (!transcript) {
      console.warn('Transcript is empty, will not analyze');
      return;
    }

    console.log('Final transcript:\t', transcript);

    const { name, location, emergencyType } = await analyzeTranscript(transcript);

    if (location) {
      console.log('Found location:\t', location);
      updates.location = location;

      const coordinates = await getCoordinates(location);
      if (coordinates.lat && coordinates.lng) {
        updates.geocode = coordinates;
      }
    }

    // override because the caller has announced their name which is more accurate
    if (name) {
      console.log('Found name:\t', name);
      updates.name = name;
    }

    if (emergencyType) {
      console.log('Found emergencyType:\t', emergencyType);
      updates.emergency = emergencyType;
    }

    // Whenever this resolves => override previous model's result
    updateNamedEntitiesWithExpensiveModel(transcript, callSid);
  }

  return update(ref(db, `/calls/${callSid}`), updates);
};

module.exports.updateTranscript = (callSid, streamSid, transcript, priority) => {
  if (!callSid) {
    return;
  }

  return update(ref(db, `/calls/${callSid}`), {
    callSid,
    streamSid,
    transcript,
    priority,
  });
};
