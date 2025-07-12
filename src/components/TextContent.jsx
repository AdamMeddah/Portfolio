export default function TextContent({
  className,
  hasGrid,
  title,
  content,
  textColor,
}) {
  return (
    <div className={className}>
      <h1 style={{ color: textColor }}>{title}</h1>
    </div>
  );
}
