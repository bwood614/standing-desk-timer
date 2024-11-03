import type { CSSProperties } from 'react';

export interface SettingsSection {
  title: string;
  description: string;
  element: JSX.Element;
}

interface SettingsFormProps {
  sections: SettingsSection[];
  formHeader: string;
  formDescription: string;
}

const SettingsForm = ({
  formHeader,
  formDescription,
  sections
}: SettingsFormProps) => {
  const styles = buildStyle();

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeaderContainer}>
        <h1 style={styles.header}>{formHeader}</h1>
        <p style={styles.description}>{formDescription}</p>
      </div>

      {sections.map((section) => {
        return (
          <div style={styles.sectionContainer}>
            <h2 style={styles.sectionHeader}>{section.title}</h2>
            <p style={styles.sectionDescription}>{section.description}</p>
            {section.element}
          </div>
        );
      })}
    </div>
  );
};

const buildStyle = (): Record<string, CSSProperties> => {
  const sectionPadding = 40;
  return {
    formContainer: {},
    formHeaderContainer: {
      paddingBottom: sectionPadding
    },
    sectionContainer: {
      paddingTop: sectionPadding,
      paddingBottom: sectionPadding,
      borderTop: '1.5px solid #e5e7eb'
    }
  };
};

export default SettingsForm;
