type AppContentFrameProps = {
  children: React.ReactNode;
};

export function AppContentFrame({ children }: AppContentFrameProps) {
  return <main className="page-shell">{children}</main>;
}
