import React from 'react';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

interface ResumePreviewProps {
  template: string;
  data: ResumeData;
  previewMode: boolean;
}

export function ResumePreview({ template, data, previewMode }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: string, end: string, current: boolean) => {
    const startFormatted = formatDate(start);
    if (current) return `${startFormatted} - Present`;
    const endFormatted = formatDate(end);
    return `${startFormatted} - ${endFormatted}`;
  };

  const ModernProfessionalTemplate = () => (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-slate-600 space-y-1">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          <div className="flex flex-wrap gap-4 text-sm">
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {data.personalInfo.summary && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
              <p className="text-slate-700 text-sm leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">PROFESSIONAL EXPERIENCE</h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-slate-800">{exp.position}</h3>
                        <p className="text-slate-600 text-sm font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-slate-700 text-sm leading-relaxed mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">EDUCATION</h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <p className="text-slate-600 text-sm">{edu.institution}</p>
                      {edu.gpa && <p className="text-slate-500 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-slate-600">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">PROJECTS</h2>
              <div className="space-y-3">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-800">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} className="text-slate-600 text-sm hover:underline">View Project</a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-slate-700 text-sm leading-relaxed mb-2">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <p className="text-slate-600 text-sm">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">SKILLS</h2>
              <div className="space-y-3">
                {data.skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    {skillCategory.category && (
                      <h3 className="font-medium text-slate-800 text-sm mb-1">{skillCategory.category}</h3>
                    )}
                    <div className="text-slate-700 text-sm space-y-0.5">
                      {skillCategory.items.map((skill, index) => (
                        <p key={index}>• {skill}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">CERTIFICATIONS</h2>
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-medium text-slate-800 text-sm">{cert.name}</h3>
                    <p className="text-slate-600 text-sm">{cert.issuer}</p>
                    <p className="text-slate-500 text-sm">{formatDate(cert.date)}</p>
                    {cert.url && (
                      <a href={cert.url} className="text-slate-600 text-sm hover:underline">View Credential</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CreativeDesignerTemplate = () => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName || 'Your Name'}</h1>
          <div className="w-24 h-1 bg-white/30 mx-auto mb-3"></div>
          <div className="space-y-1 text-blue-100">
            {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
            <div className="flex justify-center gap-4 text-sm">
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            </div>
            <div className="flex justify-center gap-4 text-sm">
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Summary */}
          {data.personalInfo.summary && (
            <div className="mb-6 text-center">
              <p className="text-slate-700 text-sm leading-relaxed max-w-2xl mx-auto">{data.personalInfo.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Experience */}
              {data.experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                      <div key={exp.id} className="border-l-2 border-purple-200 pl-4">
                        <h3 className="font-semibold text-slate-800">{exp.position}</h3>
                        <p className="text-purple-700 text-sm font-medium">{exp.company}</p>
                        <p className="text-slate-600 text-sm">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                        {exp.description && (
                          <p className="text-slate-700 text-sm leading-relaxed mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    PROJECTS
                  </h2>
                  <div className="space-y-3">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <h3 className="font-semibold text-slate-800">{project.name}</h3>
                        {project.description && (
                          <p className="text-slate-700 text-sm leading-relaxed">{project.description}</p>
                        )}
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills */}
              {data.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    SKILLS
                  </h2>
                  <div className="space-y-3">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id}>
                        {skillCategory.category && (
                          <h3 className="font-medium text-slate-800 text-sm mb-2">{skillCategory.category}</h3>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {skillCategory.items.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                        <p className="text-purple-700 text-sm">{edu.institution}</p>
                        <p className="text-slate-600 text-sm">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    CERTIFICATIONS
                  </h2>
                  <div className="space-y-3">
                    {data.certifications.map((cert) => (
                      <div key={cert.id}>
                        <h3 className="font-medium text-slate-800 text-sm">{cert.name}</h3>
                        <p className="text-purple-700 text-sm">{cert.issuer}</p>
                        <p className="text-slate-600 text-sm">{formatDate(cert.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ExecutivePremiumTemplate = () => (
    <div className="bg-slate-50 p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="bg-white border-t-8 border-slate-800 shadow-sm">
        {/* Header */}
        <div className="border-b-2 border-slate-200 p-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-wide mb-3">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
          <div className="text-slate-600 space-y-2">
            {data.personalInfo.email && <p className="font-medium">{data.personalInfo.email}</p>}
            <div className="flex flex-wrap gap-6 text-sm">
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Executive Summary */}
          {data.personalInfo.summary && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-wide border-b-2 border-slate-300 pb-2 mb-4">EXECUTIVE SUMMARY</h2>
              <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="col-span-2 space-y-8">
              {/* Experience */}
              {data.experience.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-wide border-b-2 border-slate-300 pb-2 mb-4">PROFESSIONAL EXPERIENCE</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                            <p className="text-slate-700 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right text-slate-600">
                            <p className="font-medium">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                            {exp.location && <p className="text-sm">{exp.location}</p>}
                          </div>
                        </div>
                        {exp.description && (
                          <div className="text-slate-700 leading-relaxed">
                            {exp.description.split('\n').map((line, index) => (
                              <p key={index} className="mb-1">• {line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-wide border-b-2 border-slate-300 pb-2 mb-4">KEY PROJECTS</h2>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <h3 className="font-bold text-slate-800">{project.name}</h3>
                        {project.description && (
                          <p className="text-slate-700 leading-relaxed mt-1">{project.description}</p>
                        )}
                        {project.technologies.length > 0 && (
                          <p className="text-slate-600 text-sm mt-1">
                            <strong>Technologies:</strong> {project.technologies.join(' • ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Education */}
              {data.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-wide border-b border-slate-300 pb-2 mb-4">EDUCATION</h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-slate-800 text-sm">{edu.degree}</h3>
                        <p className="text-slate-700 text-sm">{edu.institution}</p>
                        <p className="text-slate-600 text-sm">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                        {edu.gpa && <p className="text-slate-500 text-sm">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-wide border-b border-slate-300 pb-2 mb-4">CORE COMPETENCIES</h2>
                  <div className="space-y-4">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id}>
                        {skillCategory.category && (
                          <h3 className="font-medium text-slate-800 text-sm mb-1">{skillCategory.category}</h3>
                        )}
                        <div className="text-slate-700 text-sm space-y-0.5">
                          {skillCategory.items.map((skill, index) => (
                            <p key={index}>• {skill}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-wide border-b border-slate-300 pb-2 mb-4">CERTIFICATIONS</h2>
                  <div className="space-y-3">
                    {data.certifications.map((cert) => (
                      <div key={cert.id}>
                        <h3 className="font-medium text-slate-800 text-sm">{cert.name}</h3>
                        <p className="text-slate-700 text-sm">{cert.issuer}</p>
                        <p className="text-slate-600 text-sm">{formatDate(cert.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TechMinimalTemplate = () => (
    <div className="bg-gray-100 p-8 max-w-4xl mx-auto" style={{ fontFamily: 'ui-monospace, monospace' }}>
      <div className="bg-white border shadow-sm">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-green-400 mb-2">
                {data.personalInfo.fullName ? data.personalInfo.fullName.toLowerCase().replace(' ', '_') : 'developer_name'}
              </h1>
              <p className="text-gray-300 text-sm">// Full Stack Developer</p>
            </div>
            <div className="text-right text-xs text-gray-400 space-y-1">
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
              {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          {data.personalInfo.summary && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
              <p className="text-gray-700 text-sm font-mono">
                $ {data.personalInfo.summary}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Experience */}
              {data.experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">// experience</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                      <div key={exp.id} className="border-l-2 border-green-500 pl-4">
                        <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                        <p className="text-gray-600 text-sm">{exp.company} • {formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                        {exp.description && (
                          <div className="text-gray-700 text-sm mt-2 font-mono">
                            {exp.description.split('\n').map((line, lineIndex) => (
                              <p key={lineIndex}>→ {line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">// projects</h2>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="text-green-500">&gt;</span>
                          {project.name}
                          {project.url && (
                            <a href={project.url} className="text-blue-600 text-xs hover:underline ml-2">
                              [view]
                            </a>
                          )}
                        </h3>
                        {project.description && (
                          <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                        )}
                        {project.technologies.length > 0 && (
                          <p className="text-gray-600 text-xs mt-1 font-mono">
                            Tech: [{project.technologies.join(', ')}]
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills */}
              {data.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">// tech_stack</h2>
                  <div className="space-y-3">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id}>
                        {skillCategory.category && (
                          <h3 className="text-gray-800 text-sm mb-2 font-semibold">
                            {skillCategory.category.toLowerCase().replace(' ', '_')}:
                          </h3>
                        )}
                        <div className="text-gray-700 text-sm space-y-0.5 font-mono">
                          {skillCategory.items.map((skill, index) => (
                            <p key={index}>
                              <span className="text-green-500">&gt;</span> {skill}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">// education</h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-semibold text-gray-800 text-sm">{edu.degree}</h3>
                        <p className="text-gray-600 text-sm">{edu.institution}</p>
                        <p className="text-gray-500 text-xs font-mono">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">// certifications</h2>
                  <div className="space-y-3">
                    {data.certifications.map((cert) => (
                      <div key={cert.id}>
                        <h3 className="font-semibold text-gray-800 text-sm">{cert.name}</h3>
                        <p className="text-gray-600 text-sm">{cert.issuer}</p>
                        <p className="text-gray-500 text-xs font-mono">{formatDate(cert.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case 'modern-professional':
        return <ModernProfessionalTemplate />;
      case 'creative-designer':
        return <CreativeDesignerTemplate />;
      case 'executive-premium':
        return <ExecutivePremiumTemplate />;
      case 'tech-minimal':
        return <TechMinimalTemplate />;
      default:
        return <ModernProfessionalTemplate />;
    }
  };

  return (
    <div className={`${previewMode ? 'scale-100' : 'scale-100'} origin-top transition-transform`}>
      {renderTemplate()}
    </div>
  );
}