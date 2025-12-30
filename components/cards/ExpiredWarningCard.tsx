interface ExpiredWarningCardProps {
  forfeitedVisits: number;
}

export function ExpiredWarningCard({ forfeitedVisits }: ExpiredWarningCardProps) {
  return (
    <div className="rounded-xl bg-error-100 p-4">
      <h3 className="mb-2 text-sm font-semibold text-neutral-900">
        This package has expired
      </h3>
      <div className="mb-2 h-px bg-error-200" />
      <p className="text-sm text-neutral-700">
        {forfeitedVisits} unused visit{forfeitedVisits !== 1 ? "s were" : " was"} forfeited
      </p>
    </div>
  );
}
