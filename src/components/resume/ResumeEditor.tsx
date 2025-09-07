import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

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

interface ResumeEditorProps {
  data: ResumeData;
  onDataUpdate: (data: ResumeData) => void;
  onPreview: () => void;
}

export function ResumeEditor({ data, onDataUpdate, onPreview }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const updatePersonalInfo = (field: string, value: string) => {
    onDataUpdate({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onDataUpdate({
      ...data,
      experience: [...data.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onDataUpdate({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onDataUpdate({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onDataUpdate({
      ...data,
      education: [...data.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onDataUpdate({
      ...data,
      education: data.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onDataUpdate({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const addSkillCategory = () => {
    const newSkillCategory = {
      id: Date.now().toString(),
      category: '',
      items: []
    };
    onDataUpdate({
      ...data,
      skills: [...data.skills, newSkillCategory]
    });
  };

  const updateSkillCategory = (id: string, category: string, items: string[]) => {
    onDataUpdate({
      ...data,
      skills: data.skills.map(skill => 
        skill.id === id ? { ...skill, category, items } : skill
      )
    });
  };

  const removeSkillCategory = (id: string) => {
    onDataUpdate({
      ...data,
      skills: data.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: ''
    };
    onDataUpdate({
      ...data,
      projects: [...data.projects, newProject]
    });
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    onDataUpdate({
      ...data,
      projects: data.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const removeProject = (id: string) => {
    onDataUpdate({
      ...data,
      projects: data.projects.filter(project => project.id !== id)
    });
  };

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    onDataUpdate({
      ...data,
      certifications: [...data.certifications, newCertification]
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onDataUpdate({
      ...data,
      certifications: data.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id: string) => {
    onDataUpdate({
      ...data,
      certifications: data.certifications.filter(cert => cert.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resume Details</h3>
        <Button onClick={onPreview} className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Resume
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certs</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={data.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+255 123 456 789"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={data.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="Dar es Salaam, Tanzania"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={data.personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={data.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Write a brief summary of your professional background and key achievements..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Button onClick={addExperience} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>

          {data.experience.map((exp, index) => (
            <Card key={exp.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Experience {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label>Position *</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <div className="space-y-2">
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm">
                          Current Position
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.experience.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No work experience added yet.</p>
              <Button onClick={addExperience} className="mt-2">
                Add Your First Experience
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button onClick={addEducation} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </div>

          {data.education.map((edu, index) => (
            <Card key={edu.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Education {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.education.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No education added yet.</p>
              <Button onClick={addEducation} className="mt-2">
                Add Your Education
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Skills</h3>
            <Button onClick={addSkillCategory} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Skill Category
            </Button>
          </div>

          {data.skills.map((skillCategory, index) => (
            <Card key={skillCategory.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Skill Category {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkillCategory(skillCategory.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={skillCategory.category}
                    onChange={(e) => updateSkillCategory(skillCategory.id, e.target.value, skillCategory.items)}
                    placeholder="e.g., Programming Languages, Tools, etc."
                  />
                </div>
                <div>
                  <Label>Skills (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={skillCategory.items.join('\n')}
                    onChange={(e) => updateSkillCategory(skillCategory.id, skillCategory.category, e.target.value.split('\n').filter(item => item.trim()))}
                    placeholder="React&#10;Node.js&#10;Python&#10;SQL"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.skills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No skills added yet.</p>
              <Button onClick={addSkillCategory} className="mt-2">
                Add Your Skills
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Projects</h3>
            <Button onClick={addProject} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>

          {data.projects.map((project, index) => (
            <Card key={project.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Project {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div>
                    <Label>Project URL (Optional)</Label>
                    <Input
                      value={project.url || ''}
                      onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe what the project does and your role..."
                  />
                </div>
                <div>
                  <Label>Technologies (one per line)</Label>
                  <Textarea
                    rows={2}
                    value={project.technologies.join('\n')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split('\n').filter(tech => tech.trim()))}
                    placeholder="React&#10;Node.js&#10;MongoDB"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.projects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects added yet.</p>
              <Button onClick={addProject} className="mt-2">
                Add Your First Project
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Button onClick={addCertification} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </div>

          {data.certifications.map((cert, index) => (
            <Card key={cert.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Certification {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Certification Name *</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <Label>Issuing Organization *</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Issue Date</Label>
                    <Input
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Credential URL (Optional)</Label>
                    <Input
                      value={cert.url || ''}
                      onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                      placeholder="https://credential-url.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.certifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No certifications added yet.</p>
              <Button onClick={addCertification} className="mt-2">
                Add Your First Certification
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}