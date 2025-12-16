export function DashboardHeader({ title, description }) {
    return (
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    )
  }
  

  