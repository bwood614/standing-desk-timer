import type { CSSProperties } from 'react';

interface SettingsSectionProps {
  children: JSX.Element | JSX.Element[];
  header?: string;
  description?: string;
}

const SettingsSection = ({
  children,
  header,
  description
}: SettingsSectionProps) => {
  const styles = buildStyle();
  return (
    <div style={styles.sectionContainer}>
      <h2 style={styles.sectionHeader}>{header}</h2>
      <p style={styles.sectionDescription}>{description}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {children}
      </div>
    </div>
  );
};

const buildStyle = (): Record<string, CSSProperties> => {
  const sectionPadding = 40;
  return {
    sectionContainer: {
      paddingTop: sectionPadding,
      paddingBottom: sectionPadding,
      borderTop: '1.5px solid #e5e7eb'
    },
    sectionDescription: {
      marginBottom: 15,
      color: '#7e7e7e'
    }
  };
};

export default SettingsSection;
