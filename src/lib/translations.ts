import type { Lang } from "@/context/LanguageContext";

export const T: Record<Lang, Translation> = {
  en: {
    nav: {
      about: "About", skills: "Skills", education: "Education",
      career: "Career", hobbies: "Hobbies", references: "References", contact: "Contact",
    },
    hero: {
      subtitle: "AI & Data",
      suggestions: ["What's your background?", "What projects have you built?", "What are your skills?", "How can I reach you?"],
      placeholder: "Ask me anything…",
      placeholderMore: "Ask another question…",
    },
    about: {
      title: "About", subtitle: "AI & Data",
      bio: [
        "I'm a Final-Year AI & Data student at ESAIP (Angers, France), currently completing my Final Year Internship at Airbus Helicopters.",
        "My work spans machine learning, large language models, computer vision, and social robotics — built across research labs in Norway, exchange semesters in Finland & Spain, and projects in France.",
        "I'm fluent in French, English and I am a former high-level athlete. Additionally, I am a passionate content creator with a significant online presence, reaching over 80M views and growing a community of more than 200,000 subscribers across my channels.",
      ],
      stats: ["Countries", "Experiences", "Publication", "Pending"],
      availability: "Open to opportunities · Sept / Oct 2026",
    },
    career: {
      title: "Career", subtitle: "7 professional experiences across 4 countries",
      current: "Current", open: "Open to new opportunities from", openDate: "September / October 2026",
      experiences: [
        { period: "Mar 2026\nSep 2026", company: "Airbus Helicopters", location: "France", role: "AI Engineer Intern", description: "Final year engineering internship applying AI and data engineering expertise", current: true, logo: "/images/career/airbus.webp", logoSize: { w: 120, h: 36 } },
        { period: "May 2025\nAug 2025", company: "NTNU", location: "Gjøvik, Norway · EduTech Lab", role: "Researcher", bullets: ["Embodied AI & Multimodal HRI: Developed a comprehensive interaction system for a humanoid robot, integrating gesture-based Human-Robot Interaction (HRI) with an advanced RAG-powered conversational agent for domain-specific dialogue.", "System Optimization: Accelerated model inference using GPU pipelines to minimize latency, while designing a robust human-in-the-loop (HITL) framework for edge-case queries.", "Publication: Lead author of a paper accepted at HCI International 2026."], photo: "/images/career/ntnu.jpg" },
        { period: "Jan 2025\nMay 2025", company: "COMAT Specific", location: "Angers, France · Aerospace Industry", role: "ML Engineer — Mission", bullets: ["Designed an AI-driven solution to modernize industrial workflows: built a Deep Learning-based OCR pipeline to accurately translate legacy, hand-drawn 2D sketches into structured, machine-readable data."], logo: "/images/career/comat.png", logoSize: { w: 120, h: 40 } },
        { period: "May 2024\nAug 2024", company: "Banque de France", location: "Poitiers, France", role: "Data Engineer Intern", bullets: ["Large-Scale Data Extraction: Automated complex web scraping workflows using Python and Selenium to aggregate massive volumes of unstructured data from diverse sources.", "Multimodal AI Pipeline: Integrated OCR, Speech-to-Text (S2T) models, and LLMs to transcribe, digitize, and structure raw audio and visual data, directly feeding a Retrieval-Augmented Generation (RAG) system."], logo: "/images/career/bdf.png", logoSize: { w: 110, h: 36 } },
        { period: "Summer\n2023", company: "Via Electro", location: "Marseille, France", role: "Electronic Technician", description: "Installed and maintained electronic security, access control, image and sound systems for major clients. Managed network and computer rack systems.", logo: "/images/career/via-electro.png", logoSize: { w: 100, h: 36 } },
        { period: "2022\n1 month", company: "GRDF", location: "Marseille, France", role: "Intern", description: "Worked across departments at France's leading gas distribution operator: managerial roles, financial and economic aspects, asbestos prevention, green gas and its ecological benefits.", logo: "/images/career/grdf.png", logoSize: { w: 90, h: 36 } },
        { period: "2021\n2022", company: "JCAQSE", location: "Aix-en-Provence, France", role: "Junior Company — Quality Management", description: "Quality management in the Junior Enterprise. Managed processes and KPIs for continuous improvement.", logo: "/images/career/jcaqse.webp", logoSize: { w: 90, h: 36 } },
      ],
    },
    education: {
      title: "Education", subtitle: "Academic journey across 4 countries", mainLabel: "Main school",
      schools: [
        { period: "Sep 2025\nFeb 2026", school: "Universidad Politécnica de Madrid", location: "Madrid, Spain · International Exchange", degree: "Exchange Semester", description: "Machine Learning · Cloud Computing · Programming · Large-Scale Data Processing Architectures.", photo: "/images/education/upm.jpg" },
        { period: "Sep 2021\nSep 2026", school: "ESAIP", location: "Angers, France · CTI & EUR-ACE Accredited", degree: "IT Engineering — Big Data & AI", description: "Engineering diploma accredited by the Commission des Titres d'Ingénieurs (CTI) and EUR-ACE. Grade: ECTS A (highest, Top 10%). 2021–2023: Integrated preparatory courses. 2023–2026: Computer & network engineering — Big Data & AI option.", main: true, photo: "/images/education/esaipv2.webp" },
        { period: "Jan 2024\nMay 2024", school: "SeAMK", location: "Seinäjoki, Finland · International Exchange", degree: "Exchange Semester", description: "C++, C#, Embedded Systems, OOP, Introduction to AI, Electronics labs, Software Project (Unity), Project Work in Automation.", photo: "/images/education/seamk.jpg" },
        { period: "Sep 2018\nJul 2021", school: "Lycée Jean Perrin", location: "Marseille, France", degree: "Baccalauréat", description: "High-level athlete — Basketball Training Academy. BAC — Specialty: Physics & Human Sciences, Mathematics option.", photo: "/images/education/lycee.jpg" },
      ],
    },
    skills: {
      title: "Skills", subtitle: "Technical expertise & soft skills",
      technicalLabel: "Technical", softLabel: "Soft Skills",
      technical: [
        { title: "Programming Languages", description: "Primary focus on Python. Also C#, C++, JavaScript, HTML & CSS.", tags: ["Python", "C++", "C#", "JavaScript", "HTML / CSS"] },
        { title: "AI & Machine Learning", description: "LLMs, Fine-tuning, Transfer Learning, Deep Learning, Computer Vision, Speech Recognition (ASR).", tags: ["LLMs", "Deep Learning", "Computer Vision", "ASR", "RAG"] },
        { title: "Frameworks & Libraries", description: "Main ML frameworks and AI tooling for research and production.", tags: ["PyTorch", "TensorFlow", "Keras", "Hugging Face", "OpenCV"] },
        { title: "Data Analysis & Image Processing", description: "Data wrangling, visualisation, and classical image processing.", tags: ["NumPy", "Pandas", "Matplotlib", "Matlab"] },
        { title: "Robotics", description: "Social robotics, real-time AI systems, human-robot interaction.", tags: ["NAO Robot", "Reachy Robot", "RRI", "ROS"] },
        { title: "Tools & Project Management", description: "Version control, project tracking, and Agile workflows.", tags: ["GitHub", "GitLab", "Jira", "Trello", "Agile"] },
      ],
      soft: [
        { title: "Communication", description: "Public Speaking · Stress Management · Synthesising complex ideas clearly" },
        { title: "Team Work", description: "Collaboration · Cross-cultural communication · Agile workflows across 4 countries" },
        { title: "Leadership & Management", description: "Decision-Making · Time-Management · Founded & led student Sports Association at ESAIP" },
        { title: "Adaptability", description: "Resilience · Open-Mindedness · Studied and lived in France, Finland, Norway & Spain" },
      ],
    },
    hobbies: {
      title: "Hobbies", subtitle: "Beyond work",
      items: [
        { label: "Sport", title: "Basketball", detail: "Top-level athlete · Training Academy", description: "The Basketball Training Academy at Lycée Jean Perrin shaped my competitive drive, leadership instincts, and team communication — skills I carry into every project.", image: "/images/hobbies/basketball.png", imagePosition: "center 65%", layout: "image-right" as const },
        { label: "Content", title: "Content Creator", detail: "200k+ subscribers · 80M+ views", description: "YouTube channels covering different niches. I handle the full production cycle: scripting, filming, editing, publishing and audience engagement — with a deep algorithmic understanding built through systematic iteration.", image: "/images/hobbies/youtube.png", imageFit: "contain" as const, imageBg: "#fff", layout: "image-left" as const },
        { label: "Leadership", title: "School Associations", detail: "Founder & President", description: "Founded and led the Sports Association at ESAIP, enabling the school's entry into the Grandes Écoles Championship. Also improved quality processes and KPI monitoring at Junior Conseil AQSE.", image: "/images/hobbies/associations.jpg", layout: "full-width" as const },
      ],
    },
    references: {
      title: "References", subtitle: "Professional endorsements",
      text: "Professional references are available upon request.", button: "Request References",
    },
  },
  fr: {
    nav: {
      about: "À propos", skills: "Compétences", education: "Formation",
      career: "Parcours", hobbies: "Loisirs", references: "Références", contact: "Contact",
    },
    hero: {
      subtitle: "AI & Data",
      suggestions: ["Quel est ton parcours ?", "Quels projets as-tu réalisés ?", "Quelles sont tes compétences ?", "Comment te contacter ?"],
      placeholder: "Pose-moi une question…",
      placeholderMore: "Pose une autre question…",
    },
    about: {
      title: "À propos", subtitle: "AI & Data",
      bio: [
        "Étudiant en dernière année d'ingénierie IA à l'ESAIP (Angers, France), actuellement en stage de fin d'études chez Airbus Helicopters.",
        "Mon travail couvre le machine learning, les grands modèles de langage, la vision par ordinateur et la robotique sociale — développé dans des laboratoires de recherche en Norvège, des semestres d'échange en Finlande et en Espagne, et des projets en France.",
        "Bilingue français-anglais, ancien sportif de haut niveau et créateur de contenu passionné avec plus de 80M de vues et plus de 200 000 abonnés sur mes chaînes.",
      ],
      stats: ["Pays", "Expériences", "Publication", "En cours"],
      availability: "Disponible · Sept / Oct 2026",
    },
    career: {
      title: "Parcours", subtitle: "7 expériences professionnelles dans 4 pays",
      current: "En cours", open: "Disponible à partir de", openDate: "Septembre / Octobre 2026",
      experiences: [
        { period: "Mar 2026\nSep 2026", company: "Airbus Helicopters", location: "France", role: "Stagiaire Ingénieur IA", description: "Stage de fin d'études appliquant l'expertise en IA et ingénierie des données", current: true, logo: "/images/career/airbus.webp", logoSize: { w: 120, h: 36 } },
        { period: "Mai 2025\nAoû 2025", company: "NTNU", location: "Gjøvik, Norvège · EduTech Lab", role: "Chercheur", bullets: ["IA Incarnée & HRI Multimodale : Développement d'un système d'interaction complet pour un robot humanoïde, intégrant une HRI gestuelle avec un agent conversationnel RAG pour un dialogue spécialisé.", "Optimisation Système : Accélération de l'inférence via des pipelines GPU pour minimiser la latence, et conception d'un framework human-in-the-loop (HITL) pour les cas limites.", "Publication : Auteur principal d'un article accepté à HCI International 2026."], photo: "/images/career/ntnu.jpg" },
        { period: "Jan 2025\nMai 2025", company: "COMAT Specific", location: "Angers, France · Industrie Aérospatiale", role: "Ingénieur ML — Mission", bullets: ["Conception d'une solution IA pour moderniser les workflows industriels : développement d'un pipeline OCR basé sur le Deep Learning pour traduire des croquis 2D manuscrits en données structurées."], logo: "/images/career/comat.png", logoSize: { w: 120, h: 40 } },
        { period: "Mai 2024\nAoû 2024", company: "Banque de France", location: "Poitiers, France", role: "Stagiaire Data Engineer", bullets: ["Extraction de Données à Grande Échelle : Automatisation de workflows de web scraping complexes avec Python et Selenium pour agréger des volumes massifs de données non structurées.", "Pipeline IA Multimodal : Intégration d'OCR, de modèles Speech-to-Text (S2T) et de LLMs pour transcrire et structurer des données audio et visuelles brutes, alimentant un système RAG."], logo: "/images/career/bdf.png", logoSize: { w: 110, h: 36 } },
        { period: "Été\n2023", company: "Via Electro", location: "Marseille, France", role: "Technicien Électronique", description: "Installation et maintenance de systèmes électroniques de sécurité, contrôle d'accès, image et son pour des clients majeurs. Gestion de racks réseau et informatiques.", logo: "/images/career/via-electro.png", logoSize: { w: 100, h: 36 } },
        { period: "2022\n1 mois", company: "GRDF", location: "Marseille, France", role: "Stagiaire", description: "Travail dans différents départements de l'opérateur leader de distribution de gaz en France : rôles managériaux, aspects financiers et économiques, prévention amiante, gaz vert et ses bénéfices écologiques.", logo: "/images/career/grdf.png", logoSize: { w: 90, h: 36 } },
        { period: "2021\n2022", company: "JCAQSE", location: "Aix-en-Provence, France", role: "Junior Entreprise — Management Qualité", description: "Management qualité dans la Junior Entreprise. Gestion des processus et KPIs pour l'amélioration continue.", logo: "/images/career/jcaqse.webp", logoSize: { w: 90, h: 36 } },
      ],
    },
    education: {
      title: "Formation", subtitle: "Parcours académique dans 4 pays", mainLabel: "École principale",
      schools: [
        { period: "Sep 2025\nFév 2026", school: "Universidad Politécnica de Madrid", location: "Madrid, Espagne · Échange International", degree: "Semestre d'Échange", description: "Machine Learning · Cloud Computing · Programmation · Architectures de traitement de données à grande échelle.", photo: "/images/education/upm.jpg" },
        { period: "Sep 2021\nSep 2026", school: "ESAIP", location: "Angers, France · Accréditation CTI & EUR-ACE", degree: "Ingénierie Informatique — Big Data & IA", description: "Diplôme d'ingénieur accrédité par la Commission des Titres d'Ingénieurs (CTI) et EUR-ACE. Note : ECTS A (mention très bien, Top 10%). 2021–2023 : Classes préparatoires intégrées. 2023–2026 : Informatique et réseaux — option Big Data & IA.", main: true, photo: "/images/education/esaipv2.webp" },
        { period: "Jan 2024\nMai 2024", school: "SeAMK", location: "Seinäjoki, Finlande · Échange International", degree: "Semestre d'Échange", description: "C++, C#, Systèmes embarqués, POO, Introduction à l'IA, TP d'électronique, Projet logiciel (Unity), Projet en automatisation.", photo: "/images/education/seamk.jpg" },
        { period: "Sep 2018\nJul 2021", school: "Lycée Jean Perrin", location: "Marseille, France", degree: "Baccalauréat", description: "Sportif de haut niveau — Section sportive Basketball. BAC — Spécialité : Physique & Sciences Humaines, option Mathématiques.", photo: "/images/education/lycee.jpg" },
      ],
    },
    skills: {
      title: "Compétences", subtitle: "Expertise technique & soft skills",
      technicalLabel: "Technique", softLabel: "Soft Skills",
      technical: [
        { title: "Langages de Programmation", description: "Focus principal sur Python. Également C#, C++, JavaScript, HTML & CSS.", tags: ["Python", "C++", "C#", "JavaScript", "HTML / CSS"] },
        { title: "IA & Machine Learning", description: "LLMs, Fine-tuning, Transfer Learning, Deep Learning, Vision par ordinateur, Reconnaissance vocale (ASR).", tags: ["LLMs", "Deep Learning", "Computer Vision", "ASR", "RAG"] },
        { title: "Frameworks & Bibliothèques", description: "Principaux frameworks ML et outils IA pour la recherche et la production.", tags: ["PyTorch", "TensorFlow", "Keras", "Hugging Face", "OpenCV"] },
        { title: "Analyse de Données & Traitement d'Image", description: "Manipulation de données, visualisation et traitement d'image classique.", tags: ["NumPy", "Pandas", "Matplotlib", "Matlab"] },
        { title: "Robotique", description: "Robotique sociale, systèmes IA temps réel, interaction homme-robot.", tags: ["NAO Robot", "Reachy Robot", "RRI", "ROS"] },
        { title: "Outils & Gestion de Projet", description: "Contrôle de version, suivi de projet et workflows Agile.", tags: ["GitHub", "GitLab", "Jira", "Trello", "Agile"] },
      ],
      soft: [
        { title: "Communication", description: "Prise de parole en public · Gestion du stress · Synthèse d'idées complexes" },
        { title: "Travail d'Équipe", description: "Collaboration · Communication interculturelle · Workflows Agile dans 4 pays" },
        { title: "Leadership & Management", description: "Prise de décision · Gestion du temps · Fondateur et président d'une association sportive à l'ESAIP" },
        { title: "Adaptabilité", description: "Résilience · Ouverture d'esprit · Étudié et vécu en France, Finlande, Norvège & Espagne" },
      ],
    },
    hobbies: {
      title: "Loisirs", subtitle: "Au-delà du travail",
      items: [
        { label: "Sport", title: "Basketball", detail: "Sportif de haut niveau · Académie sportive", description: "L'académie sportive Basketball du Lycée Jean Perrin a forgé mon esprit de compétition, mon instinct de leadership et ma communication en équipe — des qualités que j'applique dans chaque projet.", image: "/images/hobbies/basketball.png", imagePosition: "center 65%", layout: "image-right" as const },
        { label: "Contenu", title: "Créateur de Contenu", detail: "200k+ abonnés · 80M+ vues", description: "Chaînes YouTube sur différentes niches. Je gère tout le cycle de production : scripting, tournage, montage, publication et engagement communautaire — avec une compréhension approfondie des algorithmes.", image: "/images/hobbies/youtube.png", imageFit: "contain" as const, imageBg: "#fff", layout: "image-left" as const },
        { label: "Leadership", title: "Associations Étudiantes", detail: "Fondateur & Président", description: "Fondateur et président de l'Association Sportive à l'ESAIP, permettant l'entrée de l'école au Championnat des Grandes Écoles. Amélioration des processus qualité et du suivi des KPIs au Junior Conseil AQSE.", image: "/images/hobbies/associations.jpg", layout: "full-width" as const },
      ],
    },
    references: {
      title: "Références", subtitle: "Recommandations professionnelles",
      text: "Les références professionnelles sont disponibles sur demande.", button: "Demander des références",
    },
  },
};

// Type definitions
export type Translation = {
  nav: { about: string; skills: string; education: string; career: string; hobbies: string; references: string; contact: string };
  hero: { subtitle: string; suggestions: string[]; placeholder: string; placeholderMore: string };
  about: { title: string; subtitle: string; bio: string[]; stats: string[]; availability: string };
  career: { title: string; subtitle: string; current: string; open: string; openDate: string; experiences: Experience[] };
  education: { title: string; subtitle: string; mainLabel: string; schools: School[] };
  skills: { title: string; subtitle: string; technicalLabel: string; softLabel: string; technical: SkillGroup[]; soft: SoftSkill[] };
  hobbies: { title: string; subtitle: string; items: HobbyItem[] };
  references: { title: string; subtitle: string; text: string; button: string };
};

export type Experience = { period: string; company: string; location: string; role: string; description?: string; bullets?: string[]; current?: boolean; logo?: string; logoSize?: { w: number; h: number }; photo?: string };
export type School = { period: string; school: string; location: string; degree: string; description: string; main?: boolean; photo?: string; logo?: string };
export type SkillGroup = { title: string; description: string; tags: string[] };
export type SoftSkill = { title: string; description: string };
export type HobbyItem = { label: string; title: string; detail: string; description: string; image: string; layout: "image-right" | "image-left" | "full-width"; imageFit?: "cover" | "contain"; imageBg?: string; imagePosition?: string };
