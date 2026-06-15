export const site = {
  name: "Jenifer Tabita Ciuciu-Kiss",
  shortName: "Jenifer Ciuciu-Kiss",
  title: "AI Engineer, Knowledge Graph & Ontology Specialist",
  description:
    "AI engineer and PhD researcher working on knowledge graphs, ontology engineering, data engineering, research software, and intelligent systems.",
  url: "https://jeniferciuciukiss.com",
  email: "jenifer.tabita.ciuciu.kiss@gmail.com",
  location: "Zurich, Switzerland",
  github: "https://github.com/kuefmz",
  linkedin: "https://www.linkedin.com/in/jenifer-tabita-ciuciu-kiss/",
  orcid: "https://orcid.org/0000-0002-3170-6730",
  googleScholar: "https://scholar.google.com/citations?user=G86xVZ0AAAAJ&hl=en",
  researchGate: "https://www.researchgate.net/profile/Jenifer-Ciuciu-Kiss",
  cv: "/assets/jenifer_tabita_ciuciu_kiss_cv.pdf",
  formsEndpoint:
    "https://script.google.com/macros/s/AKfycbzCQhX3feFHTrNC-tqTxZ0P5hO2TdaTqY36rb-gK-Sv_q-3YkI-Jr_WKlfTKf2p_rOAhw/exec",
} as const;

export const navigation = [
  { href: "/projects/", label: "Projects" },
  { href: "/publications/", label: "Publications" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About me" },
] as const;

export const experience = [
  {
    period: "From July 2026",
    role: "Incoming Data / AI Automation Engineer",
    organization: "UBS",
    location: "Zurich, Switzerland",
    summary:
      "Joining UBS to work on data and AI automation for enterprise financial workflows.",
  },
  {
    period: "2023 - Present",
    role: "PhD Candidate in Artificial Intelligence",
    organization: "Ontology Engineering Group, UPM",
    location: "Madrid / Remote",
    summary:
      "Researching scalable and interpretable classification of research software through machine learning, scientific knowledge graphs, and semantic alignment.",
  },
  {
    period: "2022 - 2024",
    role: "Machine Learning & Data Analytics Engineer",
    organization: "Sense6",
    location: "Zurich, Switzerland",
    summary:
      "Building production systems that turn complex, unstructured documents into reliable, decision-ready data.",
  },
  {
    period: "2022 - Present",
    role: "Data Science & Analytics Teacher",
    organization: "Le Wagon",
    location: "Zurich / Amsterdam",
    summary:
      "Taught applied data science, analytics, SQL, machine learning, MLOps, and visualization to more than 100 career changers.",
  },
  {
    period: "2022",
    role: "Data Scientist",
    organization: "Parquery",
    location: "Zurich, Switzerland",
    summary:
      "Developed computer vision and large-scale data pipelines for smart mobility, spanning Python, SQL, GCP, and frontend delivery.",
  },
  {
    period: "2021 - 2022",
    role: "Research Assistant",
    organization: "Ontology Engineering Group, UPM",
    location: "Madrid, Spain",
    summary:
      "Created a research software classification method that outperformed the prior state of the art and was integrated into SOMEF.",
  },
  {
    period: "2019 - 2021",
    role: "Software & Machine Learning Engineer",
    organization: "Ericsson",
    location: "Budapest, Hungary",
    summary:
      "Built dependable telecommunications software in Erlang and applied machine learning to static-analysis bug prioritization.",
  },
] as const;

export const education = [
  {
    degree: "PhD in Artificial Intelligence",
    institution: "Universidad Politécnica de Madrid",
    period: "2023 - Present",
    detail: "Research software classification and scientific knowledge graph alignment.",
  },
  {
    degree: "MSc in Data Science",
    institution: "EIT Digital, ELTE & Universidad Politécnica de Madrid",
    period: "2020 - 2022",
    detail: "Innovation and entrepreneurship minor. Thesis on research software classification.",
  },
  {
    degree: "BSc in Computer Science",
    institution: "Eötvös Loránd University",
    period: "2017 - 2021",
    detail: "Thesis and publication on version control in the RefactorErl semantic program graph.",
  },
] as const;

export const skillGroups = [
  {
    title: "AI & Machine Learning",
    skills: [
      "Machine Learning",
      "LLMs",
      "Natural Language Processing",
      "Computer Vision",
      "Model Evaluation",
    ],
  },
  {
    title: "Knowledge Systems",
    skills: [
      "Knowledge Graphs",
      "Ontology Engineering",
      "RDF",
      "SPARQL",
      "SHACL",
      "Semantic Alignment",
    ],
  },
  {
    title: "Data & Platform Engineering",
    skills: [
      "Python",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "GCP",
      "CI/CD",
      "dbt",
    ],
  },
  {
    title: "Research & Communication",
    skills: [
      "Research Software",
      "Technical Writing",
      "Teaching",
      "Public Speaking",
      "Workshop Organization",
    ],
  },
] as const;

export const interestGroups = [
  {
    title: "Running",
    description: "Endurance training, half marathons, and exploring new places on foot.",
  },
  {
    title: "Tennis",
    description: "Recreational tennis, friendly matches, and learning through practice.",
  },
  {
    title: "Languages",
    description: "Learning German and Spanish, and staying curious about how people communicate.",
  },
] as const;

export const projectCategories = [
  { label: "All projects", value: "All", href: "/projects/" },
  { label: "Products", value: "Product", href: "/projects/?category=Product" },
  { label: "Data", value: "Data", href: "/projects/?category=Data" },
  { label: "Automation", value: "Automation", href: "/projects/?category=Automation" },
  { label: "Websites", value: "Website", href: "/projects/?category=Website" },
] as const;

export const researchProfiles = [
  { label: "GitHub", href: site.github },
  { label: "Google Scholar", href: site.googleScholar },
  { label: "ORCID", href: site.orcid },
  { label: "ResearchGate", href: site.researchGate },
] as const;
