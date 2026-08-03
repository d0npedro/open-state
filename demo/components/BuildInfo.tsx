export function BuildInfo() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'local';
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev';
  const version = process.env.NEXT_PUBLIC_DEMO_VERSION ?? '0.1.0';

  const envColors: Record<string, string> = {
    production: '#1A6B3C',
    demo: '#003F8C',
    preview: '#7A4F00',
    local: '#4A5568',
  };
  const color = envColors[env] ?? '#4A5568';

  const accessibleName = `Demo-Build: Umgebung ${env}, Version ${version}, Commit ${sha}`;

  return (
    <div
      role="group"
      aria-label={accessibleName}
      data-testid="build-info"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)',
        fontFamily: 'monospace'
      }}
    >
      <span
        data-testid="build-info-env"
        style={{
          background: color, color: 'white', padding: '0.1rem 0.4rem',
          borderRadius: '3px', fontSize: '0.65rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}
      >
        {env}
      </span>
      <span data-testid="build-info-version">v{version}</span>
      <span style={{ opacity: 0.6 }} aria-hidden="true">·</span>
      <span data-testid="build-info-sha" title="Git Commit SHA">{sha}</span>
      <span style={{ opacity: 0.6 }} aria-hidden="true">·</span>
      <span>Demonstrator</span>
    </div>
  );
}
