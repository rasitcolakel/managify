import React from 'react';

type Props = {
  width: number;
};

export default function Line({ width }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '8px',
        borderRadius: '8px',
        backgroundColor: '#dce5eb',
      }}
    >
      <div
        style={{
          width: `${width}%`,
          backgroundColor: '#5dc1d5',
          height: '100%',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}
