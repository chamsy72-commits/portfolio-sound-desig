export interface Project {
  id: string;
  title: string;
  category: 'theatre' | 'radio_cinema' | 'culture_event';
  categoryLabel: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  tags: string[];
  audioKey: 'cadounis' | 'eau' | 'alwokor' | 'ibnkhaldoun' | 'hayat' | 'joudour';
  acousticContext: string;
  duration: string;
  awardsOrHighlight?: string;
  image?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  deliverables: string[];
  icon: string;
  image?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  items: {
    name: string;
    level: string;
    percentage: number;
    description: string;
  }[];
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Ali Chams Eddine",
    title: "Sound Designer, Musicien & Chercheur en Anthropologie du Son",
    location: "Grand Tunis, Tunisie",
    institution: "ISAM Gabès – Université de Gabès",
    photoPortrait: "/assets/aistudio/image_f3ba4c86.png",
    photoStudio: "/assets/aistudio/image_d92bc914.png",
    degrees: [
      "Doctorat en Musicologie",
      "Habilitation Universitaire (HDR)",
      "Diplôme supérieur en Ingénierie & MAO"
    ],
    email: "ali.chamseddine@isamgb.u-gabes.tn",
    phone: "+216 52 767 575",
    whatsappLink: "https://wa.me/21652767575",
    slogan: "Donnez une identité unique à vos projets audiovisuels, théâtraux et numériques grâce à une conception sonore sur mesure, alliant tradition et innovations technologiques.",
    quote: "Le son n'est pas un simple accompagnement : il est mémoire, espace et dramaturgie invisible.",
    bio: [
      "Fort d'un parcours académique de pointe (titulaire d'un Doctorat en Musicologie et d'une Habilitation universitaire) et d'une longue expérience pratique dans le domaine de la production musicale et de l'ingénierie du son, je mets mon expertise au service de la création artistique, théâtrale et multimédia.",
      "Mon approche singulière allie la rigueur de la recherche en anthropologie du son à la sensibilité créative pour sculpter des paysages sonores immersifs et percutants. Mes domaines de prédilection incluent le design sonore pour le théâtre et le spectacle vivant, les fictions radiophoniques primées, la composition pour le cinéma, et l'intégration des outils d'intelligence artificielle dans la création audio contemporaine."
    ]
  },

  metrics: [
    { label: "Titres Universitaires", value: "Doctorat & HDR", note: "Musicologie & Acoustique" },
    { label: "Créations Scéniques & Radio", value: "15+", note: "Pièces, fictions & festivals" },
    { label: "Fictions Primées", value: "Radio & Cinéma", note: "Al-Wokor, Ibn Khaldoun" },
    { label: "Recherche & MAO", value: "Grand Tunis", note: "ISAMG / Université de Gabès" }
  ],

  services: [
    {
      id: "sound-design",
      title: "Design Sonore (Sound Design)",
      subtitle: "Scénographie acoustique & immersion dramatique",
      description: "Création d'ambiances sonores, bruitages sur mesure et identités sonores singulières pour le spectacle vivant, les pièces de théâtre, les courts et longs métrages, et les projets multimédias interactifs.",
      features: [
        "Conception sonore pour pièces de théâtre (ex: Cadence, Quand l'eau disparaît)",
        "Spatialisation sonore surround et systèmes de diffusion scénique",
        "Création de bruitages organiques, textures mécaniques et sons de synthèse",
        "Foley et synchronisation dramatique fine"
      ],
      deliverables: ["Stems multipistes", "Sessions Cubase/Reaper", "Banques de bruitages exclusives", "Régie de diffusion"],
      icon: "AudioWaveform"
    },
    {
      id: "composition",
      title: "Composition & Production Musicale",
      subtitle: "Bandes originales & habillages primés",
      description: "Composition originale de musiques de films, habillages sonores pour séries radiophoniques primées et productions musicales pour les arts de la scène, tissant un pont entre héritage méditerranéen et modernité électroacoustique.",
      features: [
        "Bandes originales pour fictions radiophoniques (ex: Al-Wokor, Ibn Khaldoun)",
        "Musiques de films d'auteur et films documentaires (ex: Hayat)",
        "Hybridation modale (maqam, échelles orientales) et textures contemporaines",
        "Mixage & mastering professionnel aux normes de diffusion (EBU R128)"
      ],
      deliverables: ["Mix stéréo & stems", "Partition / maquette d'orchestration", "Master 24-bit / 96 kHz", "Licence d'exploitation"],
      icon: "Music"
    },
    {
      id: "ai-audio",
      title: "IA & Innovation Audio",
      subtitle: "Recherche appliquée & synthèse neuronale",
      description: "Génération, morphing et traitement de paysages sonores et de musiques à l'aide de plateformes de pointe en intelligence artificielle, modèles neuronaux audio et traitement avancé du signal.",
      features: [
        "Sound design génératif et exploration de timbres par IA",
        "Restauration spectrale et séparation de sources audio par réseaux profonds",
        "Intégration d'algorithmes génératifs dans le workflow DAW (Reaper/Cubase)",
        "Création d'environnements sonores adaptatifs et procéduraux"
      ],
      deliverables: ["Algorithmes & presets personnalisés", "Textures audio génératives", "Rapports d'expérimentation"],
      icon: "Cpu"
    },
    {
      id: "consulting",
      title: "Conseil, Masterclasses & Formation",
      subtitle: "Pédagogie de haut niveau & transmission",
      description: "Formations spécialisées en design sonore, prise de son cinéma, traitement numérique du son, MAO (Musique Assistée par Ordinateur) et analyse acoustique pour étudiants, professionnels et institutions.",
      features: [
        "Masterclass « Quel SON pour quelle IMAGE ? » (ISAM Gabès / Université de Gabès)",
        "Formation « Son et Sens : Le pouvoir de la prise de son au Cinéma »",
        "Ateliers Cubase Pro, Cockos Reaper & mixage multicanal",
        "Enseignement en anthropologie du son et écologie acoustique"
      ],
      deliverables: ["Supports pédagogiques", "Banques d'exercices pratiques", "Certificats & audits acoustiques"],
      icon: "GraduationCap",
      image: "/assets/aistudio/image_d14c3869.png"
    }
  ] as Service[],

  projects: [
    {
      id: "cadence",
      title: "Cadence",
      category: "theatre",
      categoryLabel: "Théâtre & Arts de la Scène",
      year: "2024 - 2025",
      role: "Concepteur Sonore & Scénographie Acoustique",
      summary: "Création scénique majeure explorant les tensions dramatiques, la danse et les résonances intimes du paysage contemporain.",
      description: "Conception sonore immersive pour la pièce de théâtre « Cadence ». Le dispositif sonore explore les frottements entre le métal, les rumeurs urbaines, la guitare classique et les silences intérieurs des protagonistes, intégrant des synthèses modulaires sombres et des percussions traitées en direct.",
      tags: ["Théâtre contemporain", "Design sonore immersif", "Cubase Pro", "Synthèse granulaire"],
      audioKey: "cadounis",
      acousticContext: "Fréquences sub-basses résonantes (55 Hz), filtres passe-bande en balayage lent et frappes de gong réverbérées.",
      duration: "0:45",
      awardsOrHighlight: "Création théâtrale 2024-2025",
      image: "/assets/aistudio/image_48bdce69.png"
    },
    {
      id: "eau",
      title: "Quand l'eau disparaît",
      category: "theatre",
      categoryLabel: "Théâtre contemporain",
      year: "2024 - 2025",
      role: "Production Musicale, Vidéo & Conception de l'Affiche",
      summary: "Voyage sonore dramatique autour de la rareté de l'eau, du murmure des sources à l'aridité du désert.",
      description: "Dans cette pièce mise en scène par Kamel Sghaier, le son est le témoin d'une disparition. Le sound design et la musique signés Ali Chams Eddine tissent une métamorphose acoustique progressive : d'abord des écoulements cristallins et des résonances liquides foisonnantes, glissant lentement vers des froissements secs de sel et de sable, des textures de vent granuleux et un silence suffocant.",
      tags: ["Spectacle vivant", "Paysages aquatiques", "Production musicale", "Écologie sonore"],
      audioKey: "eau",
      acousticContext: "Modulation de bruit rose filtré (waterflow synthétique), gouttes d'eau à fréquence exponentielle et sifflement éolien.",
      duration: "0:45",
      awardsOrHighlight: "Production Scénique 2024-2025",
      image: "/assets/aistudio/image_0b83efcc.png"
    },
    {
      id: "hayat",
      title: "Hayat",
      category: "radio_cinema",
      categoryLabel: "Cinéma & Film d'Étude",
      year: "Film de Recherche",
      role: "Enregistrement & Montage Sonore",
      summary: "Film de recherche écrit et réalisé par Nabila Gouider. Conception sonore intimiste explorant l'espace, le vent et la mémoire.",
      description: "Travail sonore d'une grande rigueur sur l'hyper-acoustique du désert de sel et de l'espace infini dans « Hayat ». Prise de son directe, montage et mixage sonore des silences, de la respiration et du souffle éolien créant un contrepoint émotionnel saisissant avec la narration visuelle.",
      tags: ["Cinéma", "Film de recherche", "ESAC Gammarth", "Mixage cinéma"],
      audioKey: "hayat",
      acousticContext: "Ondes sinusoïdales pures en intervalle de tierce avec respiration lente et immensité réverbérée.",
      duration: "0:45",
      awardsOrHighlight: "Production ESAC Gammarth / Université de Carthage",
      image: "/assets/aistudio/image_7b7eddf2.png"
    },
    {
      id: "operette-baladi",
      title: "Ma Cha'a Allah Alayka Ya Baladi",
      category: "culture_event",
      categoryLabel: "Opérette & Grand Spectacle Scénique",
      year: "Avant-Première",
      role: "Direction de Projet & Production Audiovisuelle",
      summary: "Grande opérette célébrant les traditions, les costumes et l'histoire patrimoniale des régions de Tunisie.",
      description: "Direction du projet et production audiovisuelle pour la grande opérette scénique « Ma Cha'a Allah Alayka Ya Baladi », sous l'égide du Ministère des Affaires Culturelles et de la délégation régionale de Gabès. Une œuvre majeure combinant chœurs d'enfants, danses folkloriques et arrangements orchestraux.",
      tags: ["Opérette", "Patrimoine tunisien", "Production audiovisuelle", "Grand spectacle"],
      audioKey: "joudour",
      acousticContext: "Polyphonies vocales, cuivres, percussions traditionnelles et spatialisation scénique.",
      duration: "0:45",
      awardsOrHighlight: "Spectacle Officiel Avant-Première",
      image: "/assets/aistudio/image_1a48ec15.png"
    },
    {
      id: "alwokor",
      title: "Al-Wokor",
      category: "radio_cinema",
      categoryLabel: "Fiction Radiophonique Primée",
      year: "Série Récompensée",
      role: "Production Sonore & Musique Originale",
      summary: "Fiction radiophonique dramatique multi-récompensée pour son habillage sonore immersif et sa tension narrative.",
      description: "Une production radiophonique culte saluée pour son atmosphère acoustique d'une rare intensité. Le travail sonore façonne la psychologie des personnages à travers un mixage spatialisé, des respirations amplifiées, des textures de cordes et des ambiances nocturnes enveloppantes.",
      tags: ["Radio Drama", "Série primée", "Spatialisation binaurale", "Bande originale"],
      audioKey: "alwokor",
      acousticContext: "Accord de drone en Ré mineur, saturation analogique chaleureuse et traitement formant des voix.",
      duration: "0:45",
      awardsOrHighlight: "Série Radiophonique Primée"
    },
    {
      id: "ibnkhaldoun",
      title: "Ibn Khaldoun",
      category: "radio_cinema",
      categoryLabel: "Grande Série Radiophonique",
      year: "Production Historique",
      role: "Direction Musicale & Habillage Sonore",
      summary: "Fresque acoustique sur la vie et la pensée universelle de l'historien et sociologue Ibn Khaldoun.",
      description: "Composition et conception sonore d'envergure pour cette grande série radiophonique. La bande sonore convoque les modes musicaux historiques (Bayati, Rast), les instruments de facture traditionnelle (Oud, Nay, Bendir) et des nappes harmoniques profondes évoquant les grands voyages transsahariens.",
      tags: ["Histoire & Patrimoine", "Modes orientaux (Maqam)", "Percussions traditionnelles", "Mixage narratif"],
      audioKey: "ibnkhaldoun",
      acousticContext: "Modes Bayati sur fondamentale Ré, résonance de daf/bendir simulé et harmoniques cuivrées.",
      duration: "0:45",
      awardsOrHighlight: "Série Historique Majeure"
    },
    {
      id: "joudour",
      title: "Projet Joudour – Festival International de Gabès",
      category: "culture_event",
      categoryLabel: "Patrimoine & Festival International",
      year: "Événement Annuel",
      role: "Direction Artistique de l'Ouverture & Création Sonore",
      summary: "Spectacle monumental d'ouverture célébrant les racines oasiennes et maritimes du Sud tunisien.",
      description: "Direction artistique et création sonore de la grande cérémonie d'ouverture du Festival International de Gabès (Projet « Joudour » / Racines). Un spectacle hybride réunissant chants traditionnels de l'oasis, paysages sonores de palmeraies, modulations de vagues et synthétiseurs contemporains diffusés sur scène géante.",
      tags: ["Direction artistique", "Festival International", "Écologie oasienne", "Grand spectacle"],
      audioKey: "joudour",
      acousticContext: "Basse profonde Mi2, harmoniques d'arbres et de vent, résonances modales du Sud tunisien.",
      duration: "0:45",
      awardsOrHighlight: "Cérémonie d'Ouverture Officielle"
    },
    {
      id: "printemps",
      title: "Festival International du Printemps",
      category: "culture_event",
      categoryLabel: "Événementiel Culturel",
      year: "Spectacle de Saison",
      role: "Scénographie Sonore & Régie de Diffusion",
      summary: "Immersion auditive printanière associant acoustique en plein air et spatialisation multicanale.",
      description: "Mise en place de la scénographie acoustique et des séquences d'habillage sonore pour le Festival International du Printemps. Diffusion multicanale adaptée aux espaces extérieurs et aux architectures patrimoniales.",
      tags: ["Diffusion multicanale", "Plein air", "Scénographie", "Régie son"],
      audioKey: "cadounis",
      acousticContext: "Trajectoires d'échos spatiaux et motifs harmoniques éclatants.",
      duration: "0:45",
      awardsOrHighlight: "Programmation Culturelle Internationale"
    }
  ] as Project[],

  anthropologyResearch: {
    title: "Anthropologie du Son & Écologie Acoustique",
    subtitle: "L'écoute comme archive culturelle et mémoire des espaces",
    summary: "Dans le cadre de ses recherches universitaires (Doctorat & Habilitation), Ali Chams Eddine interroge le paysage sonore tunisien non comme un simple décor, mais comme un document anthropologique vivant.",
    axes: [
      {
        title: "Mémoire Acoustique des Oasis & de Gabès",
        desc: "Étude des strates sonores uniques de la seule oasis maritime de la Méditerranée (Gabès) : bruissement des palmes, murmure des canaux d'irrigation ancestraux et résonances de l'argile."
      },
      {
        title: "Anthropologie de la Médina & des Espaces Urbains",
        desc: "Captation et analyse spectrale des rumeurs, des échos de ruelles voûtées et des modulations de la voix humaine dans les souks et quartiers historiques du Grand Tunis."
      },
      {
        title: "Ethnomusicologie & Systèmes Modaux",
        desc: "Recherche sur les échelles microtonales, les modes maghrébins, les pratiques rituelles traditionnelles et leur réinterprétation dans le design sonore contemporain."
      },
      {
        title: "Intelligence Artificielle & Patrimoine Immatériel",
        desc: "Application de modèles d'apprentissage automatique à la classification, à la préservation et à la régénération de paysages sonores menacés d'extinction acoustique."
      }
    ]
  },

  skills: [
    {
      title: "Stations de Travail Audio Numérique (DAWs)",
      description: "Maîtrise approfondie des environnements professionnels d'enregistrement, d'édition et de mixage.",
      items: [
        { name: "Steinberg Cubase Pro", level: "Expert / Enseigné", percentage: 98, description: "Composition, orchestration hybride, mixage surround, gestion de sessions complexes." },
        { name: "Cockos Reaper", level: "Expert / Enseigné", percentage: 95, description: "Sound design avancé, scripts audio personnalisés, traitement par lots, flexibilité routing." },
        { name: "Avid Pro Tools", level: "Avancé", percentage: 88, description: "Standards post-production cinéma, mixage multicanal, synchronisation à l'image." },
        { name: "Ableton Live / Logic Pro", level: "Avancé", percentage: 85, description: "Performance live scénique, manipulation de boucles, audio interactif." }
      ]
    },
    {
      title: "Traitement Numérique, MAO & IA Audio",
      description: "Outils de pointe pour la sculpture timbrale, la restauration et l'innovation neuronale.",
      items: [
        { name: "Sound Design & Synthèse Modulaire", level: "Expert", percentage: 96, description: "Synthèse granulaire, soustractive, FM, modélisation physique (Serum, Kontakt, Reaktor)." },
        { name: "Traitement de Signal & Restauration (iZotope RX, FabFilter)", level: "Expert", percentage: 94, description: "Nettoyage chirurgical, dé-bruitage, égalisation dynamique, compression de bus." },
        { name: "Intelligence Artificielle & Synthèse Neuronale", level: "Avancé / Recherche", percentage: 90, description: "Génération de textures sonores, séparation de sources, modèles de diffusion audio." },
        { name: "Spatialisation & Audio Immersif", level: "Avancé", percentage: 88, description: "Binaural, Dolby Atmos, ambisonics pour le spectacle vivant et la radio." }
      ]
    },
    {
      title: "Compétences Scientifiques & Acoustiques",
      description: "Rigueur méthodologique issue d'un Doctorat et d'une Habilitation Universitaire.",
      items: [
        { name: "Analyse Spectrale & Acoustique (Praat / Sonic Visualiser)", level: "Doctorat / HDR", percentage: 96, description: "Analyse acoustique, formants, morphologie sonore, ethnomusicologie." },
        { name: "Field Recording & Prise de son de terrain", level: "Expert", percentage: 95, description: "Microphones haute sensibilité, couples stéréophoniques ORTF, micros de contact, hydrophones." },
        { name: "Scénographie sonore pour le théâtre", level: "Expert", percentage: 94, description: "Interactions son-comédien, temporalité dramaturgique, spatialisation scénique." }
      ]
    }
  ],

  languages: [
    { name: "Arabe", level: "Langue maternelle", note: "Maîtrise littéraire, contextes culturels et académiques", flag: "🇹🇳" },
    { name: "Français", level: "Bilingue / Académique", note: "Enseignement universitaire, publications et conférences", flag: "🇫🇷" },
    { name: "Anglais", level: "Avancé (Certifié TOEFL 120/67)", note: "Recherche internationale et logiciels professionnels", flag: "🇬🇧" },
    { name: "Italien", level: "Niveau intermédiaire", note: "Échanges artistiques et culturels méditerranéens", flag: "🇮🇹" }
  ]
};
