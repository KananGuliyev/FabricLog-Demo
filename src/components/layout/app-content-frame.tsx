type AppContentFrameProps = {
  children: React.ReactNode;
};

export function AppContentFrame({ children }: AppContentFrameProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
