'use client'

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { coverUrl } from '@/utils/coverUrl';
import { ProjectFeaturesBlock } from '@/components/ui/ProjectFeaturesBlock';
import type { ProjectFeatureLink } from '@/hooks/useProjects';

interface Project {
  title: string;
  short: string;
  full: string;
  image?: string;
  projectId?: string;
  featureCount?: number;
  techTags?: string[];
  features?: ProjectFeatureLink[];
}

interface ProjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  activeProjectIndex: number;
  lang: 'en' | 'no' | 'ua';
  // Screen rectangle of the bento grid; both views fill it, like the expanded Services window
  frame?: { top: number; left: number; width: number; height: number } | null;
}

export const ProjectsModal = ({ open, onOpenChange, projects, activeProjectIndex, lang, frame }: ProjectsModalProps) => {
  const frameStyle: React.CSSProperties = frame
    ? { top: frame.top, left: frame.left, width: frame.width, height: frame.height }
    : { top: 16, left: 16, right: 16, bottom: 16 };
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      {/* Grid View Modal */}
      <Dialog.Root open={open && !isDetailOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content style={frameStyle} className="fixed flex flex-col bg-surface-darker/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-surface-border z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <Dialog.Title className="text-2xl sm:text-3xl font-bold text-content">
                All Projects
              </Dialog.Title>
              <Dialog.Close className="text-content-muted hover:text-content transition-colors">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>

            {/* Projects Grid */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projects.map((project, index) => {
                  const isActive = index === activeProjectIndex;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'bg-brand/20 border-2 border-brand/40 shadow-lg shadow-brand/20'
                          : 'bg-surface-elevated border border-surface-border hover:bg-surface-border'
                      }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <h3 className="text-lg font-bold text-content mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {project.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={coverUrl(project.image)}
                              alt=""
                              className="rounded-md object-cover w-10 h-10 flex-shrink-0"
                            />
                          )}
                          {project.title}
                        </span>
                        {isActive && (
                          <span className="text-xs bg-brand/20 text-brand-light px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </h3>

                      <p className="text-base text-content-secondary mb-2 leading-relaxed">
                        {project.short}
                      </p>

                      <div className="mt-2 text-xs text-content-muted">
                        Click to view details
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Detail View Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleDetailClose();
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-in fade-in" />
          <Dialog.Content style={frameStyle} className="fixed flex flex-col bg-surface-darker/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-surface-border z-[60] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <Dialog.Title className="text-2xl sm:text-3xl font-bold text-content">
                {selectedProject?.title}
              </Dialog.Title>
              <button
                onClick={handleDetailClose}
                className="text-content-muted hover:text-content transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Project Details: cover on the left, write-up and features scroll on the right */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
              {selectedProject?.image && (
                <div className="relative shrink-0 h-48 lg:h-auto lg:w-2/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl(selectedProject.image)}
                    alt={selectedProject.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-h-0 overflow-y-auto p-6 lg:p-8">
              {/* Full write-up */}
              <div className="max-w-none">
                <p className="text-base sm:text-lg text-content-secondary leading-relaxed whitespace-pre-line">
                  {selectedProject?.full}
                </p>
              </div>

              {selectedProject?.projectId && (
                <ProjectFeaturesBlock
                  projectId={selectedProject.projectId}
                  techTags={selectedProject.techTags || []}
                  features={selectedProject.features || []}
                  featureCount={selectedProject.featureCount || 0}
                  lang={lang}
                />
              )}

              {/* Back Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDetailClose}
                  className="px-6 py-2 bg-surface-elevated hover:bg-surface-border text-content rounded-lg transition-all duration-300 border border-surface-border"
                >
                  Back to Projects
                </button>
              </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
