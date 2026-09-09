function generateDefaultAvatar(email: string) {
  const letter = email.charAt(0).toUpperCase();
  const colors = [
    '#F87171',
    '#FBBF24',
    '#34D399',
    '#60A5FA',
    '#A78BFA',
    '#F472B6',
  ];
  const color = colors[email.charCodeAt(0) % colors.length]; // modulo (m%n) is always constrained to n-1 rem

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
    <rect width="128" height="128" fill="${color}"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle"
      font-family="sans-serif" font-size="64" fill="white">${letter}</text>
  </svg>`;

  return {
    buffer: Buffer.from(svg, 'utf-8'),
    mimetype: 'image/svg+xml',
  };
}

export default generateDefaultAvatar;
