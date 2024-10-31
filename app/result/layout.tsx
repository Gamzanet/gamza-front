export default function Layout({
  children,
  gas,
  token,
}: {
  children: React.ReactNode;
  gas: React.ReactNode;
  token: React.ReactNode;
}) {
  return (
    <>
      {children}
      {gas}
      {token}
    </>
  );
}
