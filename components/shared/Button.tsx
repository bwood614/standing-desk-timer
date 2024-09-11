import cssText from "data-text:~/components/shared/Button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <>
      <style>{cssText}</style>
      <button
        className="test"
        onClick={() => {
          onClick();
        }}>
        {text}
      </button>
    </>
  );
};

export default Button;
