import type { CSSProperties } from 'react';

interface SettingsFormProps {
  formHeader: string;
  formDescription: string;
  children: JSX.Element | JSX.Element[];
}

const SettingsForm = ({
  formHeader,
  formDescription,
  children // SettingsSection[]
}: SettingsFormProps) => {
  const styles = buildStyle();

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeaderContainer}>
        <h1 style={styles.formHeaderHeader}>{formHeader}</h1>
        <p style={styles.formHeaderDescription}>{formDescription}</p>
      </div>
      {children}
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
    formHeaderDescription: {
      color: '#7e7e7e'
    },
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

export default SettingsForm;
