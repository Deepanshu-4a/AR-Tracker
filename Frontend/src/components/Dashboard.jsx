export function Dashboard() {
  return (
    <div className="min-h-screen w-full">
      {/* Modern background + spacing */}
      <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-linear-to-b from-muted/30 via-background to-background">
        {/* Header row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome Back! Here's What's Happening today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}