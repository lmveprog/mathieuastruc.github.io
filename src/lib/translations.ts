import type { Lang } from "@/context/LanguageContext";

export const T: Record<Lang, Translation> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      education: "Education",
      career: "Experience",
      projects: "Projects",
      hobbies: "Beyond",
      references: "References",
      contact: "Contact",
      resume: "Resume",
    },
    hero: {
      subtitle: "Applied AI Engineer",
      headline: "Applied AI engineer based in France. I build AI systems for concrete use cases and help companies grow their AI maturity. I also break down tech and AI for a wider audience on social media.",
      proof: [
        "Airbus · hybrid RAG over 10k+ export-control documents",
        "NTNU · humanoid robot interaction stack",
        "Banque de France · OCR / STT / LLM data pipeline",
        "HCI International 2026 · accepted publication",
      ],
      metrics: [
        ["4", "countries"],
        ["4", "AI/Data experiences"],
        ["Oct. 2026", "full-time search"],
      ],
      suggestions: ["Summarize Mathieu's AI profile", "What did he build at NTNU?", "What is his stack?", "How can I contact him?"],
      placeholder: "Ask about my AI/Data work...",
      placeholderMore: "Ask another question...",
    },
    home: {
      selectedProjects: "Selected projects",
      viewAllExperience: "Full experience",
      viewAllProjects: "All projects",
      demo: "demo",
      askTitle: "Ask my AI",
      askSubtitle: "A small assistant grounded in my work, ask it about my projects, stack or experience.",
      askOpen: "Ask my AI about my work",
      askClose: "Close",
    },
    about: {
      title: "About",
      subtitle: "Applied AI, research and production constraints",
      bio: [
        "Final-year engineering student at ESAIP, specializing in Data Science, currently completing a master thesis internship as an AI Engineer at Airbus.",
        "My work is focused on practical AI systems: RAG, LLM orchestration, computer vision, OCR, multimodal pipelines and human-robot interaction.",
        "I have worked or studied in France, Norway, Spain and Finland, with experience across enterprise AI, research engineering and data engineering.",
      ],
      stats: ["Countries", "AI domains", "Accepted paper", "Availability"],
      availability: "Seeking a full-time role in Data Science / AI from Oct. 2026",
    },
    career: {
      title: "Experience",
      subtitle: "AI/Data roles with research and enterprise constraints",
      current: "Current",
      open: "Available from",
      openDate: "Oct. 2026",
      experiences: [
        {
          period: "Mar 2026\nSep 2026",
          company: "Airbus",
          link: "https://x.com/Airbus",
          handle: "@airbus",
          location: "France",
          role: "Applied AI Engineer - Master Thesis",
          bullets: [
            "Built a hybrid RAG system over 10k+ export licenses and regulatory documents, routing queries between a LangChain/FAISS retrieval pipeline and a NL-to-SQL path for structured data, guaranteeing zero generative approximation on field-level queries.",
            "Engineered the full pipeline end-to-end: chunking, embedding, reranking, token-cost optimization, an evaluation framework and a user-feedback loop, all designed for reliability in a safety-critical environment.",
            "Developed AI proofs of concept with cross-functional teams and presented the system to 100+ employees, driving enterprise AI adoption.",
          ],
          current: true,
          logo: "/images/career/airbus-mono.png",
          logoSize: { w: 120, h: 36 },
        },
        {
          period: "May 2025\nAug 2025",
          company: "NTNU",
          link: "https://www.linkedin.com/school/ntnu/",
          handle: "@ntnu",
          location: "Norway",
          role: "Research Engineer Intern",
          logo: "/images/career/ntnu-mono.png",
          logoSize: { w: 134, h: 26 },
          bullets: [
            "Lead author of a paper accepted at HCI International 2026 (Montréal) on a real-time computer-vision architecture for gesture recognition in human-robot interaction.",
            "Developed an embedded AI interaction stack for a humanoid robot, combining real-time gesture recognition, computer vision and a fine-tuned LLM for domain-specific dialogue.",
            "Optimized on-device inference latency through GPU pipeline tuning, enabling real-time responses under hardware and runtime constraints.",
            "Implemented a Human-in-the-Loop framework to manage edge cases, improve robustness and support continuous model improvement.",
          ],
          photo: "/images/career/ntnu.jpg",
          videos: [
            { title: "NTNU humanoid robot demo", url: "https://youtu.be/QZ8oGMaRq6M", embedId: "QZ8oGMaRq6M" },
            { title: "NTNU interaction demo", url: "https://youtu.be/bfIvyZvMxsA", embedId: "bfIvyZvMxsA" },
          ],
        },
        {
          period: "May 2024\nAug 2024",
          company: "Banque de France",
          link: "https://x.com/banquedefrance",
          handle: "@banquedefrance",
          location: "France",
          role: "Data Scientist Intern",
          bullets: [
            "Automated scraping workflows aggregating unstructured public and financial data from multiple sources.",
            "Combined OCR, Speech-to-Text and LLMs to digitize raw audio/visual content, feeding a downstream RAG system.",
          ],
          logo: "/images/career/bdf-mono.png",
          logoSize: { w: 110, h: 36 },
        },
        {
          period: "Jan 2025\nMay 2025",
          company: "Comat Specific",
          link: "https://www.linkedin.com/company/groupe-comat/",
          handle: "@groupe-comat",
          location: "France",
          role: "Machine Learning Engineer - Part-time role alongside studies",
          bullets: [
            "Built a deep-learning OCR pipeline converting legacy hand-drawn 2D engineering sketches into structured machine-readable data, modernizing industrial workflows.",
          ],
          logo: "/images/career/comat-mono.png",
          logoSize: { w: 120, h: 40 },
        },
        {
          period: "→ 2022",
          company: "Basketball",
          location: "France",
          role: "National level",
          logo: "/images/career/smuc.png",
          logoSize: { w: 64, h: 64 },
          bullets: [
            "Sports-elite program.",
            "Balanced daily high-level training within a high-level athlete program.",
            "Team captain and point guard.",
          ],
          photo: "/images/career/basketball.png",
          photoWidth: 220,
        },
      ],
    },
    projects: {
      title: "Projects",
      subtitle: "Selected AI/Data work with concrete outputs",
      items: [
        {
          title: "Humanoid robot interaction stack",
          period: "2025 · NTNU",
          description:
            "Embedded AI system combining real-time gesture recognition, computer vision and a fine-tuned LLM for domain-specific dialogue, with GPU latency tuning and Human-in-the-Loop robustness.",
          tags: ["HRI", "Computer Vision", "Fine-tuned LLM", "Embedded AI"],
          videos: [
            { title: "Robot interaction demo", url: "https://youtu.be/QZ8oGMaRq6M", embedId: "QZ8oGMaRq6M" },
            { title: "Gesture / dialogue demo", url: "https://youtu.be/bfIvyZvMxsA", embedId: "bfIvyZvMxsA" },
          ],
        },
        {
          title: "HCI International 2026 publication",
          period: "2025 - 2026",
          description:
            "Lead author of an accepted HRI paper on an optimized real-time computer-vision architecture for gesture recognition, integrating MediaPipe landmarks, lightweight ML classifiers and low-latency robot actuation.",
          tags: ["Research", "HRI", "Computer Vision", "MediaPipe", "Springer Proceedings"],
        },
        {
          title: "Industrial OCR pipeline",
          period: "2025 · Comat Specific",
          description:
            "Deep-learning OCR pipeline converting legacy hand-drawn 2D engineering sketches into structured machine-readable data for industrial workflows.",
          tags: ["OCR", "Deep Learning", "Computer Vision", "Industrial AI"],
        },
        {
          title: "SME loan risk classification",
          period: "2025 · Universidad Politecnica de Madrid",
          description:
            "Won a Kaggle-style machine learning challenge by building a classifier to assess whether SME loan applications should be accepted or denied, optimized with Macro F1-Score.",
          tags: ["Machine Learning", "Classification", "Risk Scoring", "Macro F1"],
        },
        {
          title: "Noise-aware clustering analysis",
          period: "2025 · Universidad Politecnica de Madrid",
          description:
            "Analyzed a noisy three-variable dataset and selected a meaningful partitioning through exploratory analysis, cluster-number estimation and DBSCAN hyperparameter search.",
          tags: ["Clustering", "DBSCAN", "EDA", "Unsupervised Learning"],
        },
      ],
    },
    education: {
      title: "Education",
      subtitle: "Engineering and international exchanges",
      mainLabel: "Main school",
      schools: [
        {
          period: "Sep 2021\nSep 2026",
          school: "ESAIP",
          link: "https://www.linkedin.com/school/esaip-cole-sup-rieure-angevine-en-informatique-et-productique/",
          handle: "@esaip",
          location: "France",
          degree: "Master of Engineering, Data Science",
          description:
            "Grade A - Top 10%. Optimization algorithms, Multicriteria Optimization, ML, Image Processing, Reinforcement Learning, Explainable AI, Probabilistic Modeling.",
          main: true,
          photo: "/images/education/esaipv2.webp",
        },
        {
          period: "Sep 2025\nFeb 2026",
          school: "Universidad Politecnica de Madrid",
          link: "https://www.linkedin.com/school/universidad-politecnica-de-madrid/",
          handle: "@upm",
          location: "Spain",
          degree: "Study Abroad",
          description: "Machine Learning, cloud computing, large-scale data architectures.",
          photo: "/images/education/upm.jpg",
        },
        {
          period: "Jan 2024\nJun 2024",
          school: "SeAMK - University of Applied Sciences",
          link: "https://www.linkedin.com/school/seinajoki-university-of-applied-sciences/",
          handle: "@seamk",
          location: "Finland",
          degree: "Study Abroad",
          description: "Machine Learning, Deep Learning, Software Development, Embedded Systems.",
          photo: "/images/education/seamk.jpg",
        },
      ],
    },
    skills: {
      title: "Skills",
      subtitle: "AI engineering stack",
      technicalLabel: "Technical",
      softLabel: "Professional",
      technical: [
        { title: "Programming", description: "Core languages used in AI/Data projects.", tags: ["Python", "C", "C++", "SQL", "Bash"] },
        { title: "Data Science & ML", description: "Modeling, experimentation and computer vision stack.", tags: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "NumPy", "Pandas", "Transformers"] },
        { title: "LLM Engineering", description: "Retrieval, orchestration and adaptation of LLM systems.", tags: ["LangChain", "LlamaIndex", "Agent workflows", "LoRA", "QLoRA", "FAISS", "Chroma"] },
        { title: "Specializations", description: "Repeated themes across internships, research and projects.", tags: ["NLP", "RAG", "Computer Vision", "Multimodal AI", "Human Robot Interaction"] },
        { title: "Inference & Deployment", description: "Tools for serving and deploying AI systems.", tags: ["vLLM", "llama.cpp", "Hugging Face TGI", "FastAPI", "Docker", "Kubernetes"] },
        { title: "Languages", description: "Working languages.", tags: ["French native", "English C1", "Spanish B1"] },
      ],
      soft: [
        { title: "Research to engineering", description: "Accepted HCI International 2026 paper and hands-on implementation of the underlying AI stack." },
        { title: "Enterprise constraints", description: "Experience with confidential data, answer reliability, evaluation and deployment preparation." },
        { title: "Communication", description: "Experience translating complex technical topics for broad audiences through digital content projects." },
        { title: "International adaptability", description: "Worked or studied in France, Norway, Spain and Finland." },
      ],
    },
    hobbies: {
      title: "Beyond",
      subtitle: "Professional signals outside internships",
      items: [
        {
          label: "Content",
          title: "Digital Content Project",
          detail: "AI, Data Science and Tech communication",
          description:
            "Built and operated digital content brands focused on AI, Data Science and Tech, owning scripting, production, publishing and growth.",
          image: "/content.png",
          imageFit: "cover" as const,
          imagePosition: "center center",
          layout: "image-left" as const,
        },
        {
          label: "Sport",
          title: "Former competitive basketball player",
          detail: "Discipline · Teamwork · Competition",
          description: "Former competitive basketball player.",
          image: "/images/hobbies/basketball.png",
          imagePosition: "center 32%",
          layout: "image-right" as const,
        },
      ],
    },
    references: {
      title: "References",
      subtitle: "Professional contacts",
      text: "Professional references are available upon request.",
      button: "Request references",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "A propos",
      skills: "Competences",
      education: "Formation",
      career: "Experience",
      projects: "Projets",
      hobbies: "Beyond",
      references: "References",
      contact: "Contact",
      resume: "CV",
    },
    hero: {
      subtitle: "Ingenieur IA appliquee",
      headline: "Ingenieur IA appliquee base en France. Je construis des systemes d'IA pour des cas d'usage concrets et j'aide les entreprises a gagner en maturite sur l'IA. Je vulgarise aussi la tech et l'IA sur les reseaux sociaux.",
      proof: [
        "Airbus · RAG hybride sur 10k+ documents Export Controls",
        "NTNU · stack d'interaction pour robot humanoide",
        "Banque de France · pipeline OCR / STT / LLM",
        "HCI International 2026 · publication acceptee",
      ],
      metrics: [
        ["4", "pays"],
        ["4", "experiences IA/Data"],
        ["Oct. 2026", "recherche full-time"],
      ],
      suggestions: ["Resume le profil IA de Mathieu", "Qu'a-t-il construit a NTNU ?", "Quelle est sa stack ?", "Comment le contacter ?"],
      placeholder: "Pose une question sur mon travail IA/Data...",
      placeholderMore: "Pose une autre question...",
    },
    home: {
      selectedProjects: "Projets selectionnes",
      viewAllExperience: "Toute l'experience",
      viewAllProjects: "Tous les projets",
      demo: "demo",
      askTitle: "Demander a mon IA",
      askSubtitle: "Un petit assistant base sur mon travail, pose-lui une question sur mes projets, ma stack ou mon experience.",
      askOpen: "Pose une question a mon IA",
      askClose: "Fermer",
    },
    about: {
      title: "A propos",
      subtitle: "IA appliquee, recherche et contraintes de production",
      bio: [
        "Etudiant en derniere annee d'ecole d'ingenieurs a l'ESAIP, specialise en Data Science, actuellement en master thesis internship comme AI Engineer chez Airbus.",
        "Mon travail est centre sur des systemes IA concrets : RAG, orchestration LLM, computer vision, OCR, pipelines multimodaux et interaction humain-robot.",
        "J'ai travaille ou etudie en France, Norvege, Espagne et Finlande, avec des experiences en IA enterprise, research engineering et data engineering.",
      ],
      stats: ["Pays", "Domaines IA", "Article accepte", "Disponibilite"],
      availability: "Recherche un poste full-time en Data Science / IA a partir d'oct. 2026",
    },
    career: {
      title: "Experience",
      subtitle: "Roles IA/Data avec contraintes recherche et entreprise",
      current: "En cours",
      open: "Disponible a partir de",
      openDate: "Oct. 2026",
      experiences: [
        {
          period: "Mar 2026\nSep 2026",
          company: "Airbus",
          link: "https://x.com/Airbus",
          handle: "@airbus",
          location: "France",
          role: "Applied AI Engineer - Master Thesis",
          bullets: [
            "Construction d'un systeme RAG hybride sur 10k+ licences d'export et documents reglementaires, routant les requetes entre un pipeline de retrieval LangChain/FAISS et un chemin NL-to-SQL pour les donnees structurees, garantissant zero approximation generative sur les requetes au niveau des champs.",
            "Conception du pipeline end-to-end : chunking, embedding, reranking, optimisation des couts tokens, framework d'evaluation et boucle de feedback utilisateur, le tout pense pour la fiabilite dans un environnement safety-critical.",
            "Developpement de proofs of concept IA avec des equipes cross-functional et presentation du systeme a 100+ collaborateurs, accelerant l'adoption de l'IA en entreprise.",
          ],
          current: true,
          logo: "/images/career/airbus-mono.png",
          logoSize: { w: 120, h: 36 },
        },
        {
          period: "May 2025\nAug 2025",
          company: "NTNU",
          link: "https://www.linkedin.com/school/ntnu/",
          handle: "@ntnu",
          location: "Norway",
          role: "Research Engineer Intern",
          logo: "/images/career/ntnu-mono.png",
          logoSize: { w: 134, h: 26 },
          bullets: [
            "Auteur principal d'un paper accepte a HCI International 2026 (Montreal) sur une architecture de computer vision temps reel pour la reconnaissance de gestes en interaction homme-robot.",
            "Developpement d'une stack d'interaction IA embarquee pour un robot humanoide, combinant reconnaissance gestuelle temps reel, computer vision et LLM fine-tune pour le dialogue specifique au domaine.",
            "Optimisation de la latence d'inference on-device via tuning GPU, permettant des reponses temps reel sous contraintes materielles et runtime.",
            "Implementation d'un framework Human-in-the-Loop pour gerer les edge cases, ameliorer la robustesse et soutenir l'amelioration continue du modele.",
          ],
          photo: "/images/career/ntnu.jpg",
          videos: [
            { title: "Demo robot humanoide NTNU", url: "https://youtu.be/QZ8oGMaRq6M", embedId: "QZ8oGMaRq6M" },
            { title: "Demo interaction NTNU", url: "https://youtu.be/bfIvyZvMxsA", embedId: "bfIvyZvMxsA" },
          ],
        },
        {
          period: "May 2024\nAug 2024",
          company: "Banque de France",
          link: "https://x.com/banquedefrance",
          handle: "@banquedefrance",
          location: "France",
          role: "Data Scientist Intern",
          bullets: [
            "Automatisation de workflows de scraping agregeant des donnees publiques et financieres non structurees depuis plusieurs sources.",
            "Combinaison d'OCR, Speech-to-Text et LLMs pour numeriser du contenu audio/visuel brut et alimenter un systeme RAG aval.",
          ],
          logo: "/images/career/bdf-mono.png",
          logoSize: { w: 110, h: 36 },
        },
        {
          period: "Jan 2025\nMay 2025",
          company: "Comat Specific",
          link: "https://www.linkedin.com/company/groupe-comat/",
          handle: "@groupe-comat",
          location: "France",
          role: "Machine Learning Engineer - Part-time role alongside studies",
          bullets: [
            "Construction d'un pipeline OCR deep-learning convertissant d'anciens croquis techniques 2D manuscrits en donnees structurees lisibles par machine, afin de moderniser les workflows industriels.",
          ],
          logo: "/images/career/comat-mono.png",
          logoSize: { w: 120, h: 40 },
        },
        {
          period: "→ 2022",
          company: "Basketball",
          location: "France",
          role: "Niveau national",
          logo: "/images/career/smuc.png",
          logoSize: { w: 64, h: 64 },
          bullets: [
            "Section sportive d'elite.",
            "Entrainement haut niveau au quotidien dans un programme sportif d'excellence.",
            "Capitaine et meneur (point guard).",
          ],
          photo: "/images/career/basketball.png",
          photoWidth: 220,
        },
      ],
    },
    projects: {
      title: "Projets",
      subtitle: "Travaux IA/Data selectionnes avec resultats concrets",
      items: [
        {
          title: "Stack d'interaction pour robot humanoide",
          period: "2025 · NTNU",
          description:
            "Systeme IA embarque combinant reconnaissance gestuelle temps reel, computer vision et LLM fine-tune pour le dialogue specifique au domaine, avec optimisation GPU de la latence et robustesse Human-in-the-Loop.",
          tags: ["HRI", "Computer Vision", "LLM fine-tune", "IA embarquee"],
          videos: [
            { title: "Demo interaction robot", url: "https://youtu.be/QZ8oGMaRq6M", embedId: "QZ8oGMaRq6M" },
            { title: "Demo geste / dialogue", url: "https://youtu.be/bfIvyZvMxsA", embedId: "bfIvyZvMxsA" },
          ],
        },
        {
          title: "Publication HCI International 2026",
          period: "2025 - 2026",
          description:
            "Auteur principal d'un article HRI accepte sur une architecture de computer vision temps reel optimisee pour la reconnaissance de gestes, integrant les landmarks MediaPipe, des classifieurs ML legers et une actuation robot a faible latence.",
          tags: ["Recherche", "HRI", "Computer Vision", "MediaPipe", "Springer Proceedings"],
        },
        {
          title: "Pipeline OCR industriel",
          period: "2025 · Comat Specific",
          description:
            "Pipeline OCR deep-learning convertissant d'anciens croquis techniques 2D manuscrits en donnees structurees lisibles par machine pour des workflows industriels.",
          tags: ["OCR", "Deep Learning", "Computer Vision", "Industrial AI"],
        },
        {
          title: "Classification du risque de pret PME",
          period: "2025 · Universidad Politecnica de Madrid",
          description:
            "Competition Kaggle-style remportee en construisant un classifieur pour determiner si une demande de pret PME devait etre acceptee ou refusee, avec optimisation du Macro F1-Score.",
          tags: ["Machine Learning", "Classification", "Risk Scoring", "Macro F1"],
        },
        {
          title: "Analyse de clustering sur donnees bruitees",
          period: "2025 · Universidad Politecnica de Madrid",
          description:
            "Analyse d'un dataset bruite a trois variables et choix d'un partitionnement pertinent via exploration, estimation du nombre de clusters et recherche d'hyperparametres DBSCAN.",
          tags: ["Clustering", "DBSCAN", "EDA", "Unsupervised Learning"],
        },
      ],
    },
    education: {
      title: "Formation",
      subtitle: "Ingenierie et echanges internationaux",
      mainLabel: "Ecole principale",
      schools: [
        {
          period: "Sep 2021\nSep 2026",
          school: "ESAIP",
          link: "https://www.linkedin.com/school/esaip-cole-sup-rieure-angevine-en-informatique-et-productique/",
          handle: "@esaip",
          location: "France",
          degree: "Master of Engineering, Data Science",
          description:
            "Grade A - Top 10%. Optimization algorithms, Multicriteria Optimization, ML, Image Processing, Reinforcement Learning, Explainable AI, Probabilistic Modeling.",
          main: true,
          photo: "/images/education/esaipv2.webp",
        },
        {
          period: "Sep 2025\nFeb 2026",
          school: "Universidad Politecnica de Madrid",
          link: "https://www.linkedin.com/school/universidad-politecnica-de-madrid/",
          handle: "@upm",
          location: "Spain",
          degree: "Study Abroad",
          description: "Machine Learning, cloud computing, large-scale data architectures.",
          photo: "/images/education/upm.jpg",
        },
        {
          period: "Jan 2024\nJun 2024",
          school: "SeAMK - University of Applied Sciences",
          link: "https://www.linkedin.com/school/seinajoki-university-of-applied-sciences/",
          handle: "@seamk",
          location: "Finland",
          degree: "Study Abroad",
          description: "Machine Learning, Deep Learning, Software Development, Embedded Systems.",
          photo: "/images/education/seamk.jpg",
        },
      ],
    },
    skills: {
      title: "Competences",
      subtitle: "Stack IA engineering",
      technicalLabel: "Technique",
      softLabel: "Professionnel",
      technical: [
        { title: "Programmation", description: "Langages principaux utilises dans les projets IA/Data.", tags: ["Python", "C", "C++", "SQL", "Bash"] },
        { title: "Data Science & ML", description: "Stack modelisation, experimentation et computer vision.", tags: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "NumPy", "Pandas", "Transformers"] },
        { title: "LLM Engineering", description: "Retrieval, orchestration et adaptation de systemes LLM.", tags: ["LangChain", "LlamaIndex", "Agent workflows", "LoRA", "QLoRA", "FAISS", "Chroma"] },
        { title: "Specialisations", description: "Themes recurrents des stages, projets et travaux recherche.", tags: ["NLP", "RAG", "Computer Vision", "Multimodal AI", "Human Robot Interaction"] },
        { title: "Inference & Deploiement", description: "Outils pour servir et deployer des systemes IA.", tags: ["vLLM", "llama.cpp", "Hugging Face TGI", "FastAPI", "Docker", "Kubernetes"] },
        { title: "Langues", description: "Langues de travail.", tags: ["Francais natif", "Anglais C1", "Espagnol B1"] },
      ],
      soft: [
        { title: "De la recherche a l'engineering", description: "Article accepte a HCI International 2026 et implementation concrete de la stack IA associee." },
        { title: "Contraintes enterprise", description: "Experience avec donnees confidentielles, fiabilite des reponses, evaluation et preparation du deploiement." },
        { title: "Communication", description: "Experience dans la vulgarisation de sujets techniques complexes via des projets de contenu digital." },
        { title: "Adaptabilite internationale", description: "Experience de travail ou d'etudes en France, Norvege, Espagne et Finlande." },
      ],
    },
    hobbies: {
      title: "Beyond",
      subtitle: "Signaux professionnels hors stages",
      items: [
        {
          label: "Contenu",
          title: "Digital Content Project",
          detail: "Communication IA, Data Science et Tech",
          description:
            "Creation et gestion de marques de contenu autour de l'IA, de la Data Science et de la Tech, avec responsabilite sur le scripting, la production, la publication et la croissance.",
          image: "/content.png",
          imageFit: "cover" as const,
          imagePosition: "center center",
          layout: "image-left" as const,
        },
        {
          label: "Sport",
          title: "Former competitive basketball player",
          detail: "Discipline · Teamwork · Competition",
          description: "Former competitive basketball player.",
          image: "/images/hobbies/basketball.png",
          imagePosition: "center 32%",
          layout: "image-right" as const,
        },
      ],
    },
    references: {
      title: "References",
      subtitle: "Contacts professionnels",
      text: "Les references professionnelles sont disponibles sur demande.",
      button: "Demander des references",
    },
  },
};

export type Translation = {
  nav: {
    home: string;
    about: string;
    skills: string;
    education: string;
    career: string;
    projects: string;
    hobbies: string;
    references: string;
    contact: string;
    resume: string;
  };
  hero: {
    subtitle: string;
    headline: string;
    proof: string[];
    metrics: readonly (readonly [string, string])[];
    suggestions: string[];
    placeholder: string;
    placeholderMore: string;
  };
  home: {
    selectedProjects: string;
    viewAllExperience: string;
    viewAllProjects: string;
    demo: string;
    askTitle: string;
    askSubtitle: string;
    askOpen: string;
    askClose: string;
  };
  about: { title: string; subtitle: string; bio: string[]; stats: string[]; availability: string };
  career: { title: string; subtitle: string; current: string; open: string; openDate: string; experiences: Experience[] };
  projects: { title: string; subtitle: string; items: Project[] };
  education: { title: string; subtitle: string; mainLabel: string; schools: School[] };
  skills: { title: string; subtitle: string; technicalLabel: string; softLabel: string; technical: SkillGroup[]; soft: SoftSkill[] };
  hobbies: { title: string; subtitle: string; items: HobbyItem[] };
  references: { title: string; subtitle: string; text: string; button: string };
};

export type Video = { title: string; url: string; embedId: string };
export type Experience = {
  period: string;
  company: string;
  location: string;
  role: string;
  description?: string;
  bullets?: string[];
  current?: boolean;
  logo?: string;
  logoSize?: { w: number; h: number };
  photo?: string;
  photoWidth?: number;
  videos?: Video[];
  link?: string;
  handle?: string;
};
export type Project = { title: string; period: string; description: string; tags: string[]; videos?: Video[]; link?: string };
export type School = { period: string; school: string; location: string; degree: string; description: string; main?: boolean; photo?: string; logo?: string; link?: string; handle?: string };
export type SkillGroup = { title: string; description: string; tags: string[] };
export type SoftSkill = { title: string; description: string };
export type HobbyItem = {
  label: string;
  title: string;
  detail: string;
  description: string;
  image: string;
  layout: "image-right" | "image-left" | "full-width";
  imageFit?: "cover" | "contain";
  imageBg?: string;
  imagePosition?: string;
};
