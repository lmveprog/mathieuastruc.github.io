"use client";

import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Projects() {
  const { lang } = useLanguage();
  const t = T[lang].projects;

  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <div className="project-list">
        {t.items.map((project) => (
          <article key={project.title} className="project-entry">
            <div className="project-entry-head">
              <div>
                <p className="project-period">{project.period}</p>
                <h2>{project.title}</h2>
                {project.link && (
                  <a
                    className="project-link"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code ↗
                  </a>
                )}
              </div>
              <div className="project-tags" aria-label="Technologies and topics">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <p className="project-description">{project.description}</p>
            {(project.videos || project.image) && (
              <div className="project-videos" aria-label="Project media">
                {project.videos?.map((video) => (
                  <div key={video.embedId} className="project-video">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.embedId}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      {video.title}
                    </a>
                  </div>
                ))}
                {project.image && (
                  <div className="project-video project-photo-cell">
                    <Image
                      className="project-photo"
                      src={project.image}
                      alt={project.title}
                      width={2000}
                      height={1506}
                    />
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
