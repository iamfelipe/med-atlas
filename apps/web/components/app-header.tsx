export const AppHeader = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode | React.ReactNode[];
}) => {
  return (
    <div className="flex items-center justify-between space-y-2 mb-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </div>
  );
};
