const COSTS = {
  notes: 25,
  "pyq-analysis": 25,
  "study-plan": 25,
  flashcards: 25,
  quiz: 25,
  predictions: 25
};

const PACKAGES = {
  starter: { name: "Starter", gems: 50, amount: 500 },
  student: { name: "Student", gems: 250, amount: 2000 },
  pro: { name: "Pro", gems: 1000, amount: 7500 },
  premium: { name: "Premium", gems: 5000, amount: 29900 }
};

function getCost(action) {
  return COSTS[action] || 25;
}

module.exports = { COSTS, PACKAGES, getCost };
