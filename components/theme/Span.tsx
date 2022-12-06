import React from 'react';

/**
 * A text component that can be used to display text with different sizes and colors.
 *
 * @param {string} [size="medium"] The size of the text. Can be "small", "medium", or "large".
 * @param {string} [color="lightest"] The color of the text. Can be "light", "lighter", or "lightest".
 */

type SpanProps = {
  size?: 'sm' | 'lg' | 'xl' | '2xl';
  color?: 'light' | 'lighter' | 'lightest';
  children: React.ReactNode;
}

const Span = (props: SpanProps) => {
  const { size, color, children } = props;

  let className = '';
  switch (size) {
    case 'sm':
      className = 'text-sm';
      break;
    case 'lg':
      className = 'text-lg';
      break;
    case 'xl':
      className = 'text-xl';
    case '2xl':
      className = 'text-2xl';
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

Span.defaultProps = {
  size: 'medium',
  color: 'lightest',
};

export default Span;
