// Grounding context for the portfolio chat assistant. Plain-text facts about
// Jim only — the model is instructed (see index.js) to answer solely from this.
export const JIM_FACTS = `
SUMMARY
Jim Lee is a senior AI strategy leader focused on the healthcare ecosystem (pharma, payer,
provider). He grew Databricks enterprise investment at Takeda from $1M to $30M+ while leading
global AI platform adoption across 8 business units and $20B+ in impact scope. His path ran
through consulting and product management, into hands-on data science at Humana, then AI
platform strategy at Takeda.

CAREER TIMELINE
- AI Portfolio Lead, Foundational Technology Platforms, Takeda (Jun 2025 - Jul 2026): Led AI
  portfolio across four platform pillars (networking, infrastructure, data, support) spanning
  20+ enterprise applications, unifying demand management and establishing governance that
  resulted in zero major production incidents.
- AI Transformation Product Owner, Databricks, Takeda (May 2022 - Jun 2025): Directed enterprise
  data and AI platform strategy across 8 business units and 2,700+ users, leading a 20-person
  cross-functional team and growing platform investment from $17.5M to $30M+.
- Data Scientist, Humana (Dec 2019 - May 2022): Built predictive models and Power BI dashboards
  to improve member experience and reduce CMS complaints, using claims and survey data across
  ~75K members to identify cost-saving intervention points.
- Product Manager, Integrations, par8o (Jan 2018 - Oct 2018): Led product development for
  healthcare EMR integrations (Epic, Cerner, athenahealth) via APIs and HL7, onboarding major
  health systems.
- Implementation Specialist, Azara Healthcare (Oct 2016 - Jan 2018): Implemented a population
  health analytics platform, integrating EHR data (Epic, NextGen, eCW).
- Data Analyst, Beth Israel Deaconess Medical Center (Sep 2014 - Oct 2016): Designed a referral
  tracking system and reporting tools for executive leadership (CEO, COO, CMO), improving
  patient retention and reducing out-of-network leakage.
- Senior Analyst, Consulting, Accenture (Aug 2012 - Jul 2014): Automated deployment and release
  processes for large-scale government and financial-sector systems.

EDUCATION
- B.S., Electrical Engineering, Boston University
- Data Science Coursework, Harvard Extension School (Jan 2019 - Sep 2019)
- Graduate Coursework in Healthcare Entrepreneurship, Massachusetts Institute of Technology

SKILLS
Databricks, Unity Catalog, Delta Sharing, Serverless SQL, AWS S3, Informatica BDM, Python,
PySpark, scikit-learn, DataRobot, Power BI, AI Product Strategy, Platform Governance,
Cross-Functional Leadership, Stakeholder Management, Cost Optimization, EMR Integrations (HL7).

TAKEDA DATABRICKS MIGRATION (PVC -> E2)
Jim treated platform foundations (governance, metadata, permissions, data quality) as the real
deliverable, since without those in place it's hard to deploy AI responsibly at scale. Challenges:
global stakeholder buy-in, a deprecating legacy support window, finance pressure to cut costs
(SQL Warehouses ran ~60% cheaper than the old setup), and features like Unity Catalog that
couldn't ship on the old infrastructure. Actions: scaled up a consulting team (including a
Deloitte partner group) to work hands-on with each business unit, negotiated an extended support
window and financial backing directly with Databricks, and drove adoption of Unity Catalog, the
Databricks Assistant, and Serverless SQL. Results: multi-year contract grew from $1M to $17.5M to
$30M+, expansion into the EU and Japan, MAU grew from 900 to 2,700, and 2,000+ active users were
migrated without disrupting live support.

INFORMATICA BDM COST SAVE
A vendor-proposed plan to migrate Informatica BDM (which runs many of Takeda's core workflows)
came in over budget, over timeline, and risky for live operations. Jim partnered directly with
the vendor and Informatica's product owner to pilot a leaner approach: cut the timeline by
months, reduced coding effort ~40%, and saved $1.2M.

BIGGEST COST SAVINGS (STORAGE CLEANUP)
Finance flagged runaway S3 storage costs at Takeda. Jim traced the root cause to a missing
garbage-collection cycle that had let years of log files pile up to roughly 3 petabytes. After
coordinating with stakeholders to safely notify and clean it up, the result was over $4M in
savings.

WHAT JIM IS DOING NOW / WHAT HE'S LOOKING FOR
Jim piloted and scaled Unity Catalog enterprise-wide at Takeda, alongside newer Databricks SaaS
capabilities (Serverless SQL, Delta Live Tables, Delta Sharing). With that roadmap delivered,
he's now seeking a senior AI leadership role, ideally in healthcare or life sciences.

HOW JIM PRIORITIZES
Jim's view: product management is about sequencing, not just saying yes. After the Databricks
rollout at Takeda, several new demands surfaced at once (Unity Catalog governance, Delta
Sharing, Delta Live Tables, Databricks Assistant, Serverless SQL). He prioritized Unity Catalog
governance first because it was both highest-effort and the one actively blocking the enterprise
from adopting new vendor capabilities. Serverless SQL was lower effort but its ROI wasn't proven,
so he ran internal pilots to justify it before scaling — it adopted quickly and the pilots
surfaced real cost savings.

HOW JIM GOT INTO DATA SCIENCE / CAREER STORY
Jim started in consulting on digital transformations, which pulled him into health tech — time
on the provider side at Beth Israel, then early-stage healthtech startups doing EHR integrations
and population health work. That gave him a firsthand appreciation for how fragmented healthcare
data is. He then took data science coursework (including a class taught by a former DataRobot
VP) and moved to the payer side at Humana, building predictive models on claims, survey, and
contact-center data — what he enjoyed most was partnering with business stakeholders to find
where analytics could move the needle. At Takeda, his role evolved from owning models to owning
the platform, roadmap, governance, and product strategy that let hundreds of AI use cases scale
across business units.

JIM'S BIGGEST WEAKNESS (from his own interview prep, in his voice)
"One area I've continued to develop is becoming comfortable saying no. I genuinely enjoy
partnering with stakeholders, and early on I sometimes tried to accommodate too many requests
because I wanted to be responsive. As I've taken on larger enterprise platforms, I've realized
that saying yes to everything usually means delivering less value overall. Today, I spend much
more time explaining the tradeoffs behind prioritization. Sometimes a request has to wait
because of engineering capacity, platform stability, or strategic priorities. I've found that
stakeholders are much more accepting of a 'not now' when they understand the reasoning and
where their request fits into the broader roadmap."

A TIME JIM HANDLED CONFLICT
When a modeling project fell behind at Humana, Jim was pulled in to deliver within a month. He
and the lead data scientist came from very different backgrounds (academia vs. industry) and
initially struggled to align on data gathering. Jim built out a parallel feature set and rallied
the team to create a backup modeling approach — the project shipped on time, and the team ended
up with two viable models to offer stakeholders a choice.

CUSTOMER JOURNEY DASHBOARD (Humana)
Jim led the visualization workstream on a three-team effort (Modeling, Engineering,
Visualization) to quantify a member's prescription-fill journey across channels. As requirements
started getting lost in stakeholder feedback, he introduced JIRA-based documentation and learned
Power BI to build dashboards. He delivered two iterations over four months, including a
presentation to Humana's SVP of DH&A.

MEDICARE COMPLAINTS MODEL (Humana)
Jim built a predictive model to flag members likely to file a CMS complaint, following the SEMMA
process (Sample, Explore, Modify, Model, Assess). He aggregated hundreds of features, used an
80/20 train/test split with over/undersampling to handle class imbalance, and evaluated
candidate models on AUC. The findings were adopted into outreach and call-routing strategy.

INSULIN SAVINGS & WELCOME CALLS (Humana)
Jim supported new-member enrollment analytics at Humana, including two outreach campaigns: the
Insulin Savings Program (claims-based alternative-prescription suggestions) and Welcome Calls
(propensity-matched retention outreach). Despite churn in data science leadership on the team,
he delivered on time — Insulin Savings hit 90%+ adoption and Welcome Calls drove 3x better
retention.

MENTORING & LEADERSHIP
Jim remotely managed three graduate-student interns through the pandemic, running biweekly 1:1s
and working alongside them directly. He spearheaded documentation of the Retail team's projects
into an internal wiki covering onboarding and offboarding. All three interns were recognized for
their contributions.

TESTIMONIALS
- Shyam J Dadala (Jai), Data, Digital & Technology Leader, Takeda: "Jim played an important role
  in bringing structure and alignment to a broad and evolving portfolio. He partnered
  effectively with platform and business stakeholders to prioritize initiatives, manage demand,
  and keep teams focused on high-impact outcomes. What stands out about Jim is his collaborative
  style and positive attitude."
- Blake Xiao, Data & AI Architect at Eli Lilly (formerly Takeda): "Jim is one of those rare
  leaders who combines deep technical credibility with the cross-functional instincts needed to
  actually move the needle at enterprise scale. He is exactly the kind of manager you want
  leading a data platform function. I recommend him without reservation."

CONTACT
Email: jim.lee.nj@gmail.com | LinkedIn: linkedin.com/in/jlee1991 | GitHub: github.com/jlee1991
Phone: (908) 461-6749 | Resume download button is on the site (hero and contact sections).
`.trim();
