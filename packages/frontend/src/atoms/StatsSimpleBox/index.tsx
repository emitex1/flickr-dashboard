type StatBoxProps = {
  title: string;
  value: string;
}

export const StatsSimpleBox: React.FC<StatBoxProps> = ({title, value}) => (
  <div>
    <span className="heading">{value}</span>
    <span className="description">{title}</span>
  </div>
);