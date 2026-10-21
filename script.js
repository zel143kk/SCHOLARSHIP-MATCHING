// Fictional sample data for demonstration only.
// Replace these records with verified scholarship information before public use.
const scholarships = [
  {
    id: "merit",
    name: "Bright Futures Merit Award",
    provider: "Sample Education Foundation",
    description: "A fictional merit-based award for students with strong academic performance.",
    minAverage: 90,
    levels: ["Grade 11", "Grade 12", "College"],
    income: ["low", "middle", "high", "prefer-not"],
    locations: ["NCR", "Luzon", "Visayas", "Mindanao", "any"],
    type: "academic",
    supportLabel: "Academic merit",
    award: "Sample: ₱10,000",
    notes: "Confirm grade documentation and application dates."
  },
  {
    id: "need",
    name: "Student Support Grant",
    provider: "Sample Community Learning Fund",
    description: "A fictional needs-based grant intended to help students with school expenses.",
    minAverage: 80,
    levels: ["Grade 11", "Grade 12", "College"],
    income: ["low", "middle"],
    locations: ["NCR", "Luzon", "Visayas", "Mindanao", "any"],
    type: "financial",
    supportLabel: "Financial need",
    award: "Sample: ₱8,000",
    notes: "Confirm household-income documents and other conditions."
  },
  {
    id: "ict",
    name: "Digital Skills Scholarship",
    provider: "Sample Technology Learning Program",
    description: "A fictional scholarship for students interested in technology, ICT, or computing.",
    minAverage: 85,
    levels: ["Grade 11", "Grade 12", "College"],
    income: ["low", "middle", "high", "prefer-not"],
    locations: ["NCR", "Luzon", "Visayas", "Mindanao", "any"],
    type: "technology",
    supportLabel: "Technology / ICT",
    award: "Sample: Learning allowance",
    notes: "Confirm whether an ICT-related course or portfolio is required."
  },
  {
    id: "regional",
    name: "Local Learner Opportunity Award",
    provider: "Sample Regional Education Office",
    description: "A fictional award with a regional eligibility requirement.",
    minAverage: 85,
    levels: ["Grade 11", "Grade 12"],
    income: ["low", "middle", "prefer-not"],
    locations: ["Luzon"],
    type: "financial",
    supportLabel: "General student support",
    award: "Sample: ₱5,000",
    notes: "Confirm residency rules and the accepted school levels."
  }
];

const form = document.getElementById("scholarship-form");
const resultsList = document.getElementById("results-list");
const resultsTitle = document.getElementById("results-title");
const resultsDescription = document.getElementById("results-description");

document.getElementById("year").textContent = new Date().getFullYear();

function getStudentProfile() {
  return {
    level: document.getElementById("level").value,
    average: Number(document.getElementById("average").value),
    income: document.getElementById("income").value,
    location: document.getElementById("location").value,
    support: document.getElementById("support").value
  };
}

function evaluateScholarship(scholarship, student) {
  const checks = [
    {
      label: `Grade average: ${scholarship.minAverage}% minimum`,
      passed: student.average >= scholarship.minAverage,
      reason: student.average >= scholarship.minAverage
        ? "Your average meets the sample minimum."
        : `This sample requires at least ${scholarship.minAverage}%.`
    },
    {
      label: `School level: ${student.level}`,
      passed: scholarship.levels.includes(student.level),
      reason: scholarship.levels.includes(student.level)
        ? "Your school level is included."
        : "Your school level is not listed in this sample's criteria."
    },
    {
      label: "Household income",
      passed: scholarship.income.includes(student.income),
      reason: scholarship.income.includes(student.income)
        ? "Your selected income range fits this sample's criteria."
        : "Your selected income range does not fit this sample's criteria."
    },
    {
      label: "Location",
      passed: scholarship.locations.includes(student.location) ||
              scholarship.locations.includes("any") ||
              student.location === "any",
      reason: scholarship.locations.includes(student.location) ||
              scholarship.locations.includes("any") ||
              student.location === "any"
        ? "No location conflict was found in this demo."
        : "Your selected location is not included in this sample's criteria."
    }
  ];

  const score = checks.filter(check => check.passed).length;
  const supportMatches = student.support === "any" || student.support === scholarship.type;
  return { scholarship, checks, score, eligibleByDemoRules: score === checks.length, supportMatches };
}

function renderResults(matches) {
  resultsList.replaceChildren();

  if (matches.length === 0) {
    resultsTitle.textContent = "No sample scholarships found";
    resultsDescription.textContent = "Try changing your preferred support type or review your profile details.";
    const message = document.createElement("div");
    message.className = "no-match";
    message.textContent = "No sample opportunities were available for the selected preferences. This does not mean you are ineligible for real scholarships.";
    resultsList.append(message);
    return;
  }

  const exactMatches = matches.filter(item => item.eligibleByDemoRules && item.supportMatches).length;
  resultsTitle.textContent = `${exactMatches} potential ${exactMatches === 1 ? "match" : "matches"} found`;
  resultsDescription.textContent = "Ranked by how well the sample criteria fit your answers. Review every requirement before applying.";

  matches.forEach(item => {
    const { scholarship, checks, score, eligibleByDemoRules, supportMatches } = item;
    const isStrongMatch = eligibleByDemoRules && supportMatches;
    const card = document.createElement("article");
    card.className = `match-card ${isStrongMatch ? "match-yes" : "match-review"}`;

    const top = document.createElement("div");
    top.className = "match-top";
    const titleWrap = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = scholarship.name;
    const provider = document.createElement("div");
    provider.className = "match-provider";
    provider.textContent = scholarship.provider;
    titleWrap.append(title, provider);

    const badge = document.createElement("span");
    badge.className = "match-badge";
    badge.textContent = isStrongMatch ? "Fits sample criteria" : `${score}/4 criteria`;
    top.append(titleWrap, badge);

    const description = document.createElement("p");
    description.textContent = scholarship.description;

    const tags = document.createElement("div");
    tags.className = "match-reasons";
    const typeTag = document.createElement("span");
    typeTag.className = "reason-tag";
    typeTag.textContent = scholarship.supportLabel;
    tags.append(typeTag);

    const detail = document.createElement("div");
    detail.className = "match-detail";
    const awardLabel = document.createElement("span");
    awardLabel.textContent = "Illustrative support";
    const award = document.createElement("strong");
    award.textContent = scholarship.award;
    detail.append(awardLabel, award);

    const reasonText = document.createElement("p");
    const failedChecks = checks.filter(check => !check.passed);
    if (failedChecks.length === 0 && supportMatches) {
      reasonText.textContent = "Your answers meet the listed demo criteria. " + scholarship.notes;
    } else {
      const reasons = failedChecks.map(check => check.reason);
      if (!supportMatches) reasons.push("This opportunity is a different type from your preference.");
      reasonText.textContent = reasons.join(" ") + " " + scholarship.notes;
    }

    card.append(top, description, tags, reasonText, detail);
    resultsList.append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const student = getStudentProfile();
  const matches = scholarships
    .map(scholarship => evaluateScholarship(scholarship, student))
    .filter(item => item.supportMatches || student.support === "any")
    .sort((a, b) => {
      if (a.eligibleByDemoRules !== b.eligibleByDemoRules) {
        return Number(b.eligibleByDemoRules) - Number(a.eligibleByDemoRules);
      }
      return b.score - a.score;
    });

  renderResults(matches);
  document.querySelector(".results-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    resultsTitle.textContent = "Your matches will appear here";
    resultsDescription.textContent = "Complete your profile to see which sample opportunities fit your answers.";
    resultsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-illustration"><span>✦</span><span>✓</span><span>✧</span></div>
        <strong>Your next opportunity could be here.</strong>
        <p>Fill in the form and select “Find my matches” to get started.</p>
      </div>`;
  }, 0);
});
