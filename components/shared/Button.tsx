import { debounce as debounceFn } from 'lodash';
import { useMemo, type CSSProperties } from 'react';

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  icon?: JSX.Element;
  isTransparent?: boolean;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  customStyle?: CSSProperties;
  debounce?: number;
}

const Button = ({
  text,
  onClick,
  icon,
  isTransparent = false,
  backgroundColor = '#a3c9ff',
  textColor = '#ffffff',
  width,
  customStyle,
  debounce
}: ButtonProps) => {
  const styles = buildStyle(
    isTransparent ? 'transparent' : backgroundColor,
    textColor,
    width,
    isTransparent,
    customStyle
  );

  // memoize debounced onClick so that rerender doesn't reset debounce
  const modifiedOnClick = useMemo(
    () =>
      !!debounce
        ? debounceFn(onClick, debounce, {
            leading: true,
            trailing: false
          })
        : onClick,
    []
  );

  return (
    <>
      <button style={styles.button} onClick={modifiedOnClick}>
        {!!text && text}
        {!!icon && icon}
      </button>
    </>
  );
};

const buildStyle = (
  backgroundColor: string,
  color: string,
  width: number,
  isTransparent: boolean,
  customStyle: CSSProperties
): Record<string, CSSProperties> => {
  return {
    button: {
      padding: isTransparent ? 0 : '5px 10px',
      backgroundColor,
      borderRadius: 7,
      color,
      border: 0,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: width ?? 'initial',
      boxShadow: isTransparent
        ? 'none'
        : 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
      ...customStyle
    }
  };
};

export default Button;
