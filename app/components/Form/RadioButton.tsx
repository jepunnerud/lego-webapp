import cx from 'classnames';
import { createField } from './Field';
import styles from './RadioButton.css';
import type { FormProps } from './Field';
import type { InputHTMLAttributes } from 'react';

type Props = {
  id: string;
  type?: string;
  label?: string;
  className?: string;
  inputValue?: string;
  value?: string | number;
} & InputHTMLAttributes<HTMLInputElement>;

function RadioButton({
  id,
  label,
  inputValue,
  value,
  className,
  ...props
}: Props) {
  return (
    <div className={cx(styles.box, className)}>
      <input
        {...props}
        className={styles.input}
        checked={inputValue === value}
        type="radio"
        id={id}
        value={inputValue}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

const RawField = createField(RadioButton);

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField fieldClassName={cx(fieldClassName, styles.radioField)} {...props} />
);

RadioButton.Field = StyledField;
export default RadioButton;
