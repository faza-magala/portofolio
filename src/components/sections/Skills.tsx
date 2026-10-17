import React, { useState } from 'react';
import { Layout, Server, Database, Wrench, Sparkles } from 'lucide-react';
import { skillsData } from '../../data/skills';
import { SkillCategory } from '../../types/portfolio';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const categories: { id: SkillCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Technologies', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'frontend', label: 'Frontend', icon: <Layout className="h-4 w-4" /> },
    { id: 'backend', label: 'Backend & APIs', icon: <Server className="h-4 w-4" /> },
    { id: 'databases', label: 'Databases', icon: <Database className="h-4 w-4" /> },
    { id: 'tools', label: 'Tools & DevOps', icon: <Wrench className="h-4 w-4" /> },
  ];

  const filteredSkills =
    selectedCategory === 'all'
      ? skillsData
      : skillsData.filter((skill) => skill.category === selectedCategory);

  const getProficiencyVariant = (proficiency?: string) => {
    switch (proficiency) {
      case 'Proficient':
        return 'primary' as const;
      case 'Learning':
        return 'accent' as const;
      case 'Exploring':
        return 'default' as const;
      default:
        return 'subtle' as const;
    }
  };

  return (
    <section id="skills" aria-label="Skills and Technologies" className="py-20 bg-[#F8FBFF]">
      <Container>
        <SectionHeading
          eyebrow="TECHNICAL ARSENAL"
          title="Skills, tools, and continuous learning."
          description="A transparent breakdown of the technologies I build with daily and those I am actively exploring."
        />

        {/* Category Filters */}
        <div
          role="tablist"
          aria-label="Skill category filters"
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] ${
                  isSelected
                    ? 'bg-[#3898EC] text-white shadow-sm'
                    : 'bg-white text-[#5B6B82] border border-[#DCEAF7] hover:border-[#3898EC] hover:text-[#172B4D]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Card
              key={skill.name}
              hoverable
              className="flex flex-col justify-between p-5 bg-white border-[#DCEAF7]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-[#172B4D]">{skill.name}</h3>
                  {skill.proficiency && (
                    <Badge variant={getProficiencyVariant(skill.proficiency)} size="sm">
                      {skill.proficiency}
                    </Badge>
                  )}
                </div>
                {skill.description && (
                  <p className="text-xs text-[#5B6B82] leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              {skill.isFocus && (
                <div className="mt-4 pt-3 border-t border-[#DCEAF7]/60 flex items-center gap-1.5 text-[11px] font-medium text-[#3898EC]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span>Primary Project Focus</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Legend / Context Note */}
        <div className="mt-10 rounded-2xl border border-[#DCEAF7] bg-[#EAF6FF]/60 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6B82]">
          <p>
            <strong className="text-[#172B4D]">Transparency Note:</strong> Proficiencies reflect
            hands-on projects and ongoing practice, not inflated claims of mastery.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#3898EC]" /> Proficient
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#60B5FF]" /> Learning
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#5B6B82]" /> Exploring
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
