export default function DouanesPage({
  params,
}: {
  params: { missionId: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dossier douanier</h1>
      <p className="mt-2 text-muted-foreground">Mission: {params.missionId} — à implémenter</p>
    </div>
  );
}
