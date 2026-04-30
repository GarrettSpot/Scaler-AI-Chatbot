import React from 'react';
import './PersonaSwitcher.css';

interface Persona {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface PersonaSwitcherProps {
  personas: Persona[];
  activPersona: string;
  onPersonaChange: (personaId: string) => void;
  isLoading?: boolean;
}

/**
 * Persona switcher component - tabs to switch between personas
 */
export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  personas,
  activPersona,
  onPersonaChange,
  isLoading = false,
}) => {
  return (
    <div className="persona-switcher">
      <div className="persona-label">Select Mentor:</div>
      <div className="persona-tabs">
        {personas.map((persona) => (
          <button
            key={persona.id}
            className={`persona-tab ${activPersona === persona.id ? 'active' : ''}`}
            onClick={() => !isLoading && onPersonaChange(persona.id)}
            disabled={isLoading}
            style={
              activPersona === persona.id
                ? { borderBottomColor: persona.color }
                : {}
            }
            title={persona.name}
          >
            <span className="persona-emoji">{persona.emoji}</span>
            <span className="persona-name">{persona.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
