export default function Layout({
  children,
  gas,
  token,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {children}
      {gas}
      {token}
    </>
  );
}
