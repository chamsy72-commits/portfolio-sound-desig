import React, { useState, useEffect, useRef } from 'react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { audioEngine } from '../services/audioEngine';
import {
  Play,
  Pause,
  Info,
  Upload,
  Sparkles,
  X,
  Image as ImageIcon,
  Camera,
  Video,
  Music,
  SlidersHorizontal,
  ExternalLink,
  Check,
  RotateCcw,
  Film,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface CustomMediaItem {
  videoUrl?: string;
  audioUrl?: string;
  audioFileName?: string;
}

export function parseVideoUrl(url?: string): { type: 'youtube' | 'vimeo' | 'direct' | 'unknown'; embedUrl: string } {
  if (!url || typeof url !== 'string') return { type: 'unknown', embedUrl: '' };
  const trimmed = url.trim();

  // YouTube matchers: youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
    };
  }

  // Vimeo matchers: vimeo.com/ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // Direct MP4 / WebM
  if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i) || trimmed.startsWith('blob:') || trimmed.startsWith('data:video')) {
    return {
      type: 'direct',
      embedUrl: trimmed
    };
  }

  return { type: 'unknown', embedUrl: trimmed };
}

export const PortfolioSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video_only' | 'theatre' | 'radio_cinema' | 'culture_event'>('all');
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [trackProgress, setTrackProgress] = useState<number>(0);

  // Projects list with persistence in localStorage
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('ali_chamseddine_portfolio_projects');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PORTFOLIO_DATA.projects;
  });

  // Per-project active media tab: 'audio' or 'video'
  const [activeMediaTabs, setActiveMediaTabs] = useState<Record<string, 'audio' | 'video'>>({});

  // Media configuration modal state
  const [editingMediaProject, setEditingMediaProject] = useState<Project | null>(null);
  const [inputVideoUrl, setInputVideoUrl] = useState<string>('');
  const [inputAudioUrl, setInputAudioUrl] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Add project modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    category: 'theatre' as 'theatre' | 'radio_cinema' | 'culture_event',
    year: '2025',
    role: 'Sound Designer & Compositeur',
    summary: '',
    description: '',
    tags: 'Sound Design, Théâtre, MAO',
    image: '',
    videoUrl: '',
    audioKey: 'cadounis' as 'cadounis' | 'eau' | 'alwokor' | 'ibnkhaldoun' | 'hayat' | 'joudour'
  });

  // Delete project confirmation state
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Custom audio & image upload refs and states
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const modalAudioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const newProjectImageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedProjectForImage, setSelectedProjectForImage] = useState<string | null>(null);
  const [customFileProject, setCustomFileProject] = useState<Project | null>(null);

  // Persisted custom media and images
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [customMedia, setCustomMedia] = useState<Record<string, CustomMediaItem>>({
    cadence: {
      videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
    },
    eau: {
      videoUrl: 'https://www.youtube.com/watch?v=21X5lGlDOfg'
    },
    hayat: {
      videoUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc'
    }
  });

  useEffect(() => {
    // Load persisted images and media from localStorage
    try {
      const savedImgs = localStorage.getItem('ali_chamseddine_custom_project_images');
      if (savedImgs) setCustomImages(JSON.parse(savedImgs));

      const savedMedia = localStorage.getItem('ali_chamseddine_custom_project_media');
      if (savedMedia) {
        setCustomMedia(prev => ({ ...prev, ...JSON.parse(savedMedia) }));
      }
    } catch {
      // ignore
    }

    audioEngine.setOnStateChange((playing, id) => {
      setIsPlaying(playing);
      setActiveTrackId(id);
    });

    audioEngine.setOnTimeUpdate((time, dur) => {
      setTrackProgress((time / (dur || 45)) * 100);
    });

    const state = audioEngine.getPlaybackState();
    setIsPlaying(state.isPlaying);
    setActiveTrackId(state.trackId);
  }, []);

  const saveProjectsToStorage = (updated: Project[]) => {
    setProjectsList(updated);
    try {
      localStorage.setItem('ali_chamseddine_portfolio_projects', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleTogglePlay = (project: Project) => {
    if (isPlaying && activeTrackId === project.audioKey) {
      audioEngine.pause();
    } else {
      audioEngine.playTrack(project.audioKey);
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && customFileProject) {
      audioEngine.playTrack(customFileProject.audioKey, file);
      // Also record the audio file name
      const updated = {
        ...customMedia,
        [customFileProject.id]: {
          ...customMedia[customFileProject.id],
          audioFileName: file.name
        }
      };
      setCustomMedia(updated);
      try {
        localStorage.setItem('ali_chamseddine_custom_project_media', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const triggerUploadForProject = (project: Project) => {
    setCustomFileProject(project);
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = '';
      audioFileInputRef.current.click();
    }
  };

  const triggerImageUploadForProject = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProjectForImage(projectId);
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
      imageFileInputRef.current.click();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedProjectForImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          const updated = {
            ...customImages,
            [selectedProjectForImage]: resultUrl
          };
          setCustomImages(updated);
          try {
            localStorage.setItem('ali_chamseddine_custom_project_images', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Media Manager for a project
  const openMediaManager = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingMediaProject(project);
    const existing = customMedia[project.id] || {};
    setInputVideoUrl(existing.videoUrl || project.videoUrl || '');
    setInputAudioUrl(existing.audioUrl || project.audioUrl || '');
    setSaveSuccessMsg(false);
  };

  const saveMediaSettings = () => {
    if (!editingMediaProject) return;
    const updated = {
      ...customMedia,
      [editingMediaProject.id]: {
        ...customMedia[editingMediaProject.id],
        videoUrl: inputVideoUrl.trim() || undefined,
        audioUrl: inputAudioUrl.trim() || undefined
      }
    };
    setCustomMedia(updated);
    try {
      localStorage.setItem('ali_chamseddine_custom_project_media', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setEditingMediaProject(null);
    }, 1200);
  };

  const resetProjectMedia = (projectId: string) => {
    const updated = { ...customMedia };
    delete updated[projectId];
    setCustomMedia(updated);
    setInputVideoUrl('');
    setInputAudioUrl('');
    try {
      localStorage.setItem('ali_chamseddine_custom_project_media', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Delete project handler
  const confirmDeleteProject = () => {
    if (!deletingProject) return;
    const updated = projectsList.filter(p => p.id !== deletingProject.id);
    saveProjectsToStorage(updated);
    if (modalProject?.id === deletingProject.id) {
      setModalProject(null);
    }
    setDeletingProject(null);
  };

  // Restore initial projects handler
  const handleRestoreDefaultProjects = () => {
    saveProjectsToStorage(PORTFOLIO_DATA.projects);
  };

  // Add project form submit handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;

    const categoryLabels: Record<string, string> = {
      theatre: 'Théâtre & Arts de la Scène',
      radio_cinema: 'Cinéma & Fictions Radio',
      culture_event: 'Festivals & Événements'
    };

    const newId = 'project_' + Date.now();
    const createdProject: Project = {
      id: newId,
      title: newProjectForm.title.trim(),
      category: newProjectForm.category,
      categoryLabel: categoryLabels[newProjectForm.category] || 'Projet Artistique',
      year: newProjectForm.year.trim() || '2025',
      role: newProjectForm.role.trim() || 'Sound Designer',
      summary: newProjectForm.summary.trim() || 'Création sonore et musicale sur mesure.',
      description: newProjectForm.description.trim() || newProjectForm.summary.trim() || 'Conception sonore et arrangements acoustiques.',
      tags: newProjectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      audioKey: newProjectForm.audioKey,
      acousticContext: 'Spatialisation acoustique, fréquences harmoniques et traitement de signal adapté.',
      duration: '0:45',
      image: newProjectForm.image || undefined,
      videoUrl: newProjectForm.videoUrl.trim() || undefined
    };

    const updated = [createdProject, ...projectsList];
    saveProjectsToStorage(updated);

    // Save video in customMedia if provided
    if (newProjectForm.videoUrl.trim()) {
      const mediaUpdated = {
        ...customMedia,
        [newId]: { videoUrl: newProjectForm.videoUrl.trim() }
      };
      setCustomMedia(mediaUpdated);
      try {
        localStorage.setItem('ali_chamseddine_custom_project_media', JSON.stringify(mediaUpdated));
      } catch {}
    }

    // Reset form & close modal
    setNewProjectForm({
      title: '',
      category: 'theatre',
      year: '2025',
      role: 'Sound Designer & Compositeur',
      summary: '',
      description: '',
      tags: 'Sound Design, Théâtre, MAO',
      image: '',
      videoUrl: '',
      audioKey: 'cadounis'
    });
    setIsAddModalOpen(false);
  };

  // Check if project has video configured
  const getProjectVideo = (project: Project): string | undefined => {
    return customMedia[project.id]?.videoUrl || project.videoUrl;
  };

  const toggleMediaTab = (projectId: string, tab: 'audio' | 'video', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMediaTabs(prev => ({ ...prev, [projectId]: tab }));
    // If switching to video, pause Web Audio synth to avoid competing sound
    if (tab === 'video' && isPlaying) {
      audioEngine.pause();
    }
  };

  const filteredProjects = projectsList.filter(p => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'video_only') return Boolean(getProjectVideo(p));
    return p.category === selectedFilter;
  });

  return (
    <section id="portfolio" className="py-20 relative bg-[#070b14] border-t border-slate-800/80">
      {/* Hidden file inputs for audio and image uploads */}
      <input
        type="file"
        ref={audioFileInputRef}
        onChange={handleCustomAudioUpload}
        accept="audio/*"
        className="hidden"
      />
      <input
        type="file"
        ref={modalAudioFileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editingMediaProject) {
            setInputAudioUrl(file.name);
            handleCustomAudioUpload(e);
          }
        }}
        accept="audio/*"
        className="hidden"
      />
      <input
        type="file"
        ref={imageFileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Film className="w-4 h-4" />
              <span>Répertoire Multimédia & Créations Sonores</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Portfolio & Réalisations
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Projet</span>
            </button>

            {projectsList.length !== PORTFOLIO_DATA.projects.length && (
              <button
                onClick={handleRestoreDefaultProjects}
                className="text-[11px] text-slate-500 hover:text-amber-400 font-mono-tech transition-colors cursor-pointer"
                title="Rétablir les projets de départ du portfolio"
              >
                Rétablir défauts
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls with Video Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-[#0d1527] border border-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Tous les projets ({projectsList.length})
          </button>

          <button
            onClick={() => setSelectedFilter('video_only')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'video_only'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Extraits Vidéo</span>
          </button>

          <button
            onClick={() => setSelectedFilter('theatre')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'theatre'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Théâtre & Scène
          </button>

          <button
            onClick={() => setSelectedFilter('radio_cinema')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'radio_cinema'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Cinéma & Fictions Radio
          </button>

          <button
            onClick={() => setSelectedFilter('culture_event')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'culture_event'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Festivals & Opérettes
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isThisPlaying = isPlaying && activeTrackId === project.audioKey;
            const projectImg = customImages[project.id] || project.image;
            const videoUrl = getProjectVideo(project);
            const currentTab = activeMediaTabs[project.id] || 'audio';
            const parsedVideo = parseVideoUrl(videoUrl);

            return (
              <div
                key={project.id}
                className={`flex flex-col justify-between bg-[#0c1322] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg group ${
                  isThisPlaying
                    ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'border-slate-800 hover:border-amber-500/50'
                }`}
              >
                {/* Official Poster Header */}
                {projectImg ? (
                  <div
                    onClick={() => setModalProject(project)}
                    className="relative h-48 w-full overflow-hidden bg-slate-950 cursor-pointer group/img"
                  >
                    <img
                      src={projectImg}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500 opacity-90 group-hover/img:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-black/30" />

                    {/* Badge & Quick Change image button */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech bg-slate-950/80 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Affiche Officielle</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {videoUrl && (
                          <span className="text-[10px] font-mono-tech bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>Vidéo</span>
                          </span>
                        )}
                        <button
                          onClick={(e) => triggerImageUploadForProject(project.id, e)}
                          className="text-[10px] font-mono-tech bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition-colors flex items-center gap-1 shadow cursor-pointer"
                          title="Changer l'affiche depuis vos fichiers"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-24 bg-[#090e1c] border-b border-slate-800/80 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono-tech">
                      <span>Projet Sonore</span>
                      <button
                        onClick={(e) => triggerImageUploadForProject(project.id, e)}
                        className="text-[10px] bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 px-2 py-1 rounded border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Ajouter affiche</span>
                      </button>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-amber-600/40 via-amber-400/20 to-transparent rounded" />
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech truncate">
                        <span className="text-amber-400">{project.categoryLabel}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{project.year}</span>
                      </div>

                      {/* Delete button on card */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProject(project);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Effacer ce projet du portfolio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title & Role */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mt-1">
                        Rôle : <span className="text-slate-200">{project.role}</span>
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>

                    {/* Tags list */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mb-4">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* MEDIA PLAYER SECTION: Audio or Video Switcher */}
                  <div className="pt-4 border-t border-slate-800/80 mt-auto">
                    {/* Media Type Tabs Switcher */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1 bg-[#080d19] p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={(e) => toggleMediaTab(project.id, 'audio', e)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                            currentTab === 'audio'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Music className="w-3 h-3" />
                          <span>Extrait Audio</span>
                        </button>

                        <button
                          onClick={(e) => toggleMediaTab(project.id, 'video', e)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                            currentTab === 'video'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          <span>Vidéo {videoUrl ? '✓' : ''}</span>
                        </button>
                      </div>

                      {/* Button to configure media */}
                      <button
                        onClick={(e) => openMediaManager(project, e)}
                        className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 font-mono-tech p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
                        title="Ajouter ou modifier le lien vidéo ou le fichier audio"
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span className="hidden sm:inline">Médias</span>
                      </button>
                    </div>

                    {/* CONTENT TAB 1: AUDIO PLAYER */}
                    {currentTab === 'audio' && (
                      <div className="bg-[#080d19] rounded-xl p-3.5 border border-slate-800 flex flex-col gap-2.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleTogglePlay(project)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                isThisPlaying
                                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 animate-pulse'
                                  : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400'
                              }`}
                              title={isThisPlaying ? "Pause" : "Écouter l'extrait audio"}
                            >
                              {isThisPlaying ? (
                                <Pause className="w-4 h-4 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              )}
                            </button>

                            <div>
                              <p className="text-xs font-semibold text-slate-200">
                                {isThisPlaying ? "Lecture en cours" : "Extrait audio"}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono-tech">
                                {customMedia[project.id]?.audioFileName || `${project.duration} · Studio Stem`}
                              </p>
                            </div>
                          </div>

                          {/* Animated Soundwave indicator */}
                          <div className="flex items-end gap-1 h-5 px-2">
                            <span className={`w-1 bg-amber-400 rounded-full transition-all ${isThisPlaying ? 'animate-soundwave' : 'h-1.5'}`} style={{ animationDelay: '0.1s' }} />
                            <span className={`w-1 bg-amber-400 rounded-full transition-all ${isThisPlaying ? 'animate-soundwave' : 'h-2.5'}`} style={{ animationDelay: '0.3s' }} />
                            <span className={`w-1 bg-amber-400 rounded-full transition-all ${isThisPlaying ? 'animate-soundwave' : 'h-1'}`} style={{ animationDelay: '0.2s' }} />
                            <span className={`w-1 bg-amber-400 rounded-full transition-all ${isThisPlaying ? 'animate-soundwave' : 'h-3'}`} style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all duration-200"
                            style={{ width: `${isThisPlaying ? trackProgress : 0}%` }}
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <button
                            onClick={() => triggerUploadForProject(project)}
                            className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Remplacer par votre propre fichier audio .mp3 ou .wav"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Audio perso</span>
                          </button>

                          <button
                            onClick={() => setModalProject(project)}
                            className="text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            <span>Détails & Affiche</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 2: VIDEO PLAYER */}
                    {currentTab === 'video' && (
                      <div className="bg-[#080d19] rounded-xl p-2.5 border border-slate-800 animate-in fade-in duration-200">
                        {videoUrl ? (
                          <div className="space-y-2">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-slate-800">
                              {parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                                <iframe
                                  src={parsedVideo.embedUrl}
                                  title={`Extrait vidéo ${project.title}`}
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : (
                                <video
                                  src={parsedVideo.embedUrl}
                                  controls
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                              <span className="font-mono-tech text-[10px] text-amber-400">
                                Source : {parsedVideo.type.toUpperCase()}
                              </span>
                              <button
                                onClick={(e) => openMediaManager(project, e)}
                                className="text-amber-400 hover:underline cursor-pointer"
                              >
                                Modifier le lien
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-300 mb-1 font-semibold">Aucun lien vidéo configuré</p>
                            <p className="text-[11px] text-slate-400 mb-3">
                              Insérez un lien YouTube, Vimeo ou un fichier MP4 direct.
                            </p>
                            <button
                              onClick={(e) => openMediaManager(project, e)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Video className="w-3 h-3" />
                              <span>Insérer un lien vidéo</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: AJOUTER UN NOUVEAU PROJET */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0c1322] border border-amber-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase mb-1">
              <Plus className="w-4 h-4" />
              <span>Nouveau Projet</span>
            </div>

            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white mb-4">
              Ajouter une réalisation au Portfolio
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.title}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                    placeholder="ex: Méditations Sonores"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Catégorie
                  </label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                  >
                    <option value="theatre">Théâtre & Arts de la Scène</option>
                    <option value="radio_cinema">Cinéma & Fictions Radio</option>
                    <option value="culture_event">Festivals & Opérettes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Année / Période
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.year}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, year: e.target.value })}
                    placeholder="ex: 2025"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Rôle assuré
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.role}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, role: e.target.value })}
                    placeholder="ex: Sound Designer & Compositeur"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                  Résumé court (visible sur la carte) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newProjectForm.summary}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, summary: e.target.value })}
                  placeholder="Décrivez en 1 ou 2 phrases l'essence sonore du projet..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                  Note d'intention complète (modale)
                </label>
                <textarea
                  rows={3}
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  placeholder="Démarche artistique, instruments, spatialisation..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Lien Vidéo (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    type="url"
                    value={newProjectForm.videoUrl}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    URL Affiche / Image
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.image}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, image: e.target.value })}
                    placeholder="URL ou laisser vide"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.tags}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, tags: e.target.value })}
                    placeholder="ex: Théâtre, MAO, Cubase"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1 uppercase">
                    Ambiance sonore de base
                  </label>
                  <select
                    value={newProjectForm.audioKey}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, audioKey: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  >
                    <option value="cadounis">Ambiance Cadence (Tensions théâtrales & sub-bass)</option>
                    <option value="eau">Ambiance Quand l'eau disparaît (Textures aquatiques)</option>
                    <option value="alwokor">Ambiance Al-Wokor (Fiction radiophonique sombre)</option>
                    <option value="ibnkhaldoun">Ambiance Ibn Khaldoun (Épopée modale)</option>
                    <option value="hayat">Ambiance Hayat (Cinéma intimiste)</option>
                    <option value="joudour">Ambiance Joudour (Oasis & Vent)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer le Projet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0c1322] border border-red-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Supprimer ce projet ?</h4>
                <p className="text-xs text-slate-400">Cette action retirera le projet du portfolio.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              Voulez-vous vraiment effacer le projet <strong className="text-white font-semibold">« {deletingProject.title} »</strong> ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteProject}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmer la suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: MEDIA CONFIGURATION MODAL (Insert Video & Audio Links) */}
      {editingMediaProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0c1322] border border-amber-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <button
              onClick={() => setEditingMediaProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Gestionnaire de Médias</span>
            </div>

            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white mb-2">
              {editingMediaProject.title}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Insérez un lien vidéo (YouTube, Vimeo, MP4) ou personnalisez l'extrait audio pour cette réalisation.
            </p>

            {saveSuccessMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Modifications enregistrées avec succès !</span>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 1. Video Link Input */}
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Video className="w-3.5 h-3.5" />
                      <span>Lien Vidéo (YouTube / Vimeo / MP4)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">Optionnel</span>
                  </label>
                  <input
                    type="url"
                    value={inputVideoUrl}
                    onChange={(e) => setInputVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>Formats acceptés : YouTube, Vimeo, lien direct .mp4</span>
                    {inputVideoUrl && (
                      <button
                        onClick={() => setInputVideoUrl('')}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                {/* Video Quick Sample Helpers */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Exemples de test :</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInputVideoUrl('https://www.youtube.com/watch?v=ScMzIvxBSi4')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Bande-annonce 1
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setInputVideoUrl('https://www.youtube.com/watch?v=21X5lGlDOfg')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Teaser Cinéma
                    </button>
                  </div>
                </div>

                {/* 2. Audio Excerpt Option */}
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Music className="w-3.5 h-3.5" />
                      <span>Extrait Audio (Fichier local ou URL)</span>
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputAudioUrl}
                      onChange={(e) => setInputAudioUrl(e.target.value)}
                      placeholder="URL audio direct .mp3 ou .wav"
                      className="flex-grow bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />

                    <button
                      onClick={() => {
                        setCustomFileProject(editingMediaProject);
                        modalAudioFileInputRef.current?.click();
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shrink-0 cursor-pointer"
                      title="Choisir un fichier audio sur votre ordinateur"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fichier</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Par défaut, le moteur Web Audio génère l'ambiance studio dédiée pour chaque pièce.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={() => resetProjectMedia(editingMediaProject.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingMediaProject(null)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveMediaSettings}
                      className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Enregistrer les médias</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: PROJECT DETAILS & FULLSCREEN POSTER / VIDEO MODAL */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#0c1322] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase mb-2">
              <span>{modalProject.categoryLabel}</span>
              <span>·</span>
              <span>{modalProject.year}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
                {modalProject.title}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerImageUploadForProject(modalProject.id)}
                  className="text-xs bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Remplacer l'affiche pour ce projet"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Affiche</span>
                </button>

                <button
                  onClick={() => {
                    const prj = modalProject;
                    setModalProject(null);
                    openMediaManager(prj);
                  }}
                  className="text-xs bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Configurer le lien vidéo ou l'audio"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vidéo / Audio</span>
                </button>

                <button
                  onClick={() => {
                    const prj = modalProject;
                    setModalProject(null);
                    setDeletingProject(prj);
                  }}
                  className="text-xs bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/30 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Supprimer ce projet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>

            {/* Media Showcase in Modal: Video or Poster */}
            {getProjectVideo(modalProject) ? (
              <div className="mb-6 rounded-xl overflow-hidden border border-amber-500/30 bg-black aspect-video w-full">
                {parseVideoUrl(getProjectVideo(modalProject)).type === 'youtube' ||
                parseVideoUrl(getProjectVideo(modalProject)).type === 'vimeo' ? (
                  <iframe
                    src={parseVideoUrl(getProjectVideo(modalProject)).embedUrl}
                    title={modalProject.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={parseVideoUrl(getProjectVideo(modalProject)).embedUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (customImages[modalProject.id] || modalProject.image) ? (
              <div className="mb-6 rounded-xl overflow-hidden border border-amber-500/30 bg-black flex justify-center relative group">
                <img
                  src={customImages[modalProject.id] || modalProject.image}
                  alt={`Affiche de ${modalProject.title}`}
                  className="max-h-[380px] w-auto object-contain"
                />
              </div>
            ) : null}

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Rôle assuré : {modalProject.role}</span>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed mb-6">
              <div>
                <h4 className="text-xs uppercase font-mono-tech text-slate-400 mb-1">Note d'intention & Démarche :</h4>
                <p>{modalProject.description}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-mono-tech text-slate-400 mb-1">Architecture Acoustique & Fréquences :</h4>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono-tech text-xs">
                  {modalProject.acousticContext}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleTogglePlay(modalProject)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                {isPlaying && activeTrackId === modalProject.audioKey ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Mettre en pause l'extrait audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Écouter l'extrait sonore ({modalProject.duration})</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setModalProject(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
