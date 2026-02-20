export default function ExpediteurMissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Suivi mission</h1>
      <p className="mt-2 text-muted-foreground">ID: {params.id} — à implémenter</p>
    </div>
  );
}
