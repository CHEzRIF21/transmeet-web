export default function TransporteurMissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Détail mission</h1>
      <p className="mt-2 text-muted-foreground">ID: {params.id} — à implémenter</p>
    </div>
  );
}
