import React from 'react';

/**
 * Text component
 *
 * @param {Object} props
 * @param {boolean} [props.light] - Whether the text should be light
 * @param {boolean} [props.lighter] - Whether the text should be lighter
 * @param {boolean} [props.lightest] - Whether the text should be lightest
 * @param {('sm'|'md'|'lg')} [props.size='md'] - The size of the text
 * @param {React.ReactNode} [props.children] - The children to render
 */
const Text = (props: {
  light?: boolean,
  lighter?: boolean,
  lightest?: boolean,
  size?: 'sm' | 'md' | 'lg',
  children?: React.ReactNode
}) => {
  const { light, lighter, lightest, size = 'md' } = props;

  let className = 'text';
  if (light) className += ' text-light';
  if (lighter) className += ' text-lighter';
  if (lightest) className += ' text-lightest';
  if (size === 'sm') className += ' text-sm';
  if (size === 'lg') className += ' text-lg';

  return (
    <span className={className}>
      {props.children}
    </span>
  );
};

export default Text;
