import React from 'react';

/**
 * A text component that can be used to display text with different sizes and colors.
 *
 * @param {string} [size="medium"] The size of the text. Can be "small", "medium", or "large".
 * @param {string} [color="lightest"] The color of the text. Can be "light", "lighter", or "lightest".
 */

type TextProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'lighter' | 'lightest';
  children: React.ReactNode;
}

const Text = (props: TextProps) => {
  const { size, color, children } = props;

  let className = '';
  switch (size) {
    case 'small':
      className = 'text-sm';
      break;
    case 'medium':
      className = 'text-base';
      break;
    case 'large':
      className = 'text-lg';
      break;
    default:
      className = 'text-base';
      break;
  }

  switch (color) {
    case 'light':
      className += ' text-light';
      break;
    case 'lighter':
      className += ' text-lighter';
      break;
    case 'lightest':
      className += ' text-lightest';
      break;
    default:
      className += ' text-lightest';
      break;
  }

  return (
    <span className={className}>
      {children}
    </span>
  );
};

Text.defaultProps = {
  size: 'medium',
  color: 'lightest',
};

export default Text;
