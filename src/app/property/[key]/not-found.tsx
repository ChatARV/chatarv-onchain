export default function PropertyNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-xl font-semibold text-foreground">Property not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No published value exists for this property key.
      </p>
    </div>
  );
}
