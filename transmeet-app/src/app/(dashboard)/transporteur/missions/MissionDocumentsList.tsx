"use client";

interface Doc {
  id: string;
  type: string;
  file_url: string;
  created_at: string;
}

interface MissionDocumentsListProps {
  documents: Doc[];
}

export function MissionDocumentsList({ documents }: MissionDocumentsListProps) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun document.</p>;
  }
  return (
    <ul className="space-y-2">
      {documents.map((d) => (
        <li key={d.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
          <span>{d.type} — {new Date(d.created_at).toLocaleDateString()}</span>
          <a href={`/api/documents/${d.id}/url`} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Télécharger
          </a>
        </li>
      ))}
    </ul>
  );
}
